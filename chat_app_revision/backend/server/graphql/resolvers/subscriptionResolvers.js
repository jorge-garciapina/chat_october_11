const { withFilter } = require("graphql-subscriptions");

const { pubsub } = require("./pubsub_logic");

const resolvers = {
  Mutation: {
    // Role: Log in a user and set their status to "online"
    // How it works: Marks the user as online in the 'onlineUsers' object
    // Publishes the status change to the FRIEND_STATUS_CHANGED event
    changeStatusLogin: (_, { username }) => {
      onlineUsers[username] = "online";
      pubsub.publish(FRIEND_STATUS_CHANGED, {
        // friendStatusChanged: { username, status: "online" },
        friendStatusChanged: { username, contactList },
      });
      return { username, status: "online" };
    },

    // Role: Log out a user and set their status to "offline"
    // How it works: Removes the user's online status in the 'onlineUsers' object
    // Publishes the status change to the FRIEND_STATUS_CHANGED event
    changeStatusLogout: (_, { username }) => {
      delete onlineUsers[username];
      pubsub.publish(FRIEND_STATUS_CHANGED, {
        friendStatusChanged: { username, status: "offline" },
      });
      return { username, status: "offline" };
    },
  },

  Subscription: {
    // changeUserToOnline AND changeUserToOffline ARE NOT IMPORTANT, ONLY PAY ATTENTION TO changeUserStatus
    changeUserStatus: {
      // The `subscribe` function is called when a client initiates a subscription
      // The `withFilter` function adds a layer of filtering to ensure only relevant updates are sent
      // It checks whether the username in the payload matches the username provided by the client
      subscribe: withFilter(
        () => pubsub.asyncIterator(["CHANGE_USER_STATUS"]),
        (payload, variables) => {
          const contactListOfLoggedUser = payload.changeUserStatus.contactList;

          const userInSubscription = variables.username;

          return contactListOfLoggedUser.indexOf(userInSubscription) !== -1;
        }
      ),

      // The `resolve` function constructs the payload that is sent to the client
      // Here, it simply forwards the data that was published to the FRIEND_STATUS_CHANGED event
      resolve: (payload) => {
        return payload.changeUserStatus;
      },
    },

    ///////////////////////////////////////////////////////////////////
    changeUserToOnline: {
      // The `subscribe` function is called when a client initiates a subscription
      // The `withFilter` function adds a layer of filtering to ensure only relevant updates are sent
      // It checks whether the username in the payload matches the username provided by the client
      subscribe: withFilter(
        () => pubsub.asyncIterator(["CHANGE_TO_ONLINE"]),
        (payload, variables) => {
          const contactListOfLoggedUser =
            payload.changeUserToOnline.contactList;

          const userInSubscription = variables.username;

          return contactListOfLoggedUser.indexOf(userInSubscription) !== -1;
        }
      ),

      // The `resolve` function constructs the payload that is sent to the client
      // Here, it simply forwards the data that was published to the FRIEND_STATUS_CHANGED event
      resolve: (payload) => {
        return payload.changeUserToOnline;
      },
    },
    ////////////////////////////////////////////////////////////////////////////////
    changeUserToOffline: {
      // The `subscribe` function is called when a client initiates a subscription
      // The `withFilter` function adds a layer of filtering to ensure only relevant updates are sent
      // It checks whether the username in the payload matches the username provided by the client
      subscribe: withFilter(
        () => pubsub.asyncIterator(["CHANGE_TO_OFFLINE"]),
        (payload, variables) => {
          const contactListOfLoggedUser =
            payload.changeUserToOffline.contactList;

          const userInSubscription = variables.username;

          return contactListOfLoggedUser.indexOf(userInSubscription) !== -1;
        }
      ),

      // The `resolve` function constructs the payload that is sent to the client
      // Here, it simply forwards the data that was published to the FRIEND_STATUS_CHANGED event
      resolve: (payload) => {
        return payload.changeUserToOffline;
      },
    },
  },
};

// Export resolvers for use in the GraphQL server
module.exports = resolvers;
