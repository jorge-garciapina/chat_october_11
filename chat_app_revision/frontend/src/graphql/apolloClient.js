import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  Observable,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

const API_ENDPOINT =
  window.location.protocol === "https:"
    ? `https://${window.location.host}/graphql`
    : `http://${window.location.host}/graphql`;

const httpLink = new HttpLink({
  uri: API_ENDPOINT,
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("authToken");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// WebSocket link setup
const wsClient = createClient({
  url: "ws://localhost:4000/graphql",

  // url: `ws://${window.location.host}/graphql`,
  lazy: true,
  reconnect: true,
});

const wsLink = new ApolloLink((operation) => {
  return new Observable((observer) => {
    const dispose = wsClient.subscribe(
      { ...operation, query: operation.query.loc?.source.body },
      {
        next: observer.next.bind(observer),
        error: observer.error.bind(observer),
        complete: observer.complete.bind(observer),
      }
    );
    return () => {
      dispose();
    };
  });
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export default client;

///////////////
///////////////
///////////////
// // // // import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
// // // // import { setContext } from "@apollo/client/link/context";

// // // // // // const API_ENDPOINT = "http://server-service:4000";
// // // // // const API_ENDPOINT = "http://127.0.0.1:4000/graphql";

// // // // // const API_ENDPOINT =
// // // // //   window.location.protocol === "https:"
// // // // //     ? `https://${window.location.host}/graphql`
// // // // //     : `http://${window.location.host}/graphql`;

// // // // const API_ENDPOINT = "http://localhost:4000/graphql";

// // // // const httpLink = new HttpLink({
// // // //   uri: API_ENDPOINT,
// // // // });

// // // // const authLink = setContext((_, { headers }) => {
// // // //   // get the authToken from local storage
// // // //   const token = localStorage.getItem("authToken");

// // // //   return {
// // // //     headers: {
// // // //       ...headers,
// // // //       authorization: token ? `Bearer ${token}` : "",
// // // //     },
// // // //   };
// // // // });

// // // // const client = new ApolloClient({
// // // //   link: authLink.concat(httpLink),
// // // //   cache: new InMemoryCache(),
// // // // });

// // // // export default client;
