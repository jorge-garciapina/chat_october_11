import * as React from "react";
import { useSubscription, useQuery, useMutation } from "@apollo/client";
import { INFO_QUERY, GET_USER_STATUS_QUERY } from "../../graphql/userQueries";
import { LOGOUT_USER_MUTATION } from "../../graphql/authQueries";
import { useDispatch } from "react-redux";
import { loginAction, logoutAction } from "./../../redux/actions";
import { CHANGE_USER_STATUS } from "../../graphql/subscriptionClient";
import GeneralNotifications from "./GeneralNotifications";

export default function Dashboard() {
  ///////////////////////
  ///START: USER INFO////
  const {
    data: infoData,
    // loading: infoLoading,
    error: infoError,
  } = useQuery(INFO_QUERY, {
    fetchPolicy: "no-cache",
  });

  const usernameFromInfo = infoData?.userInfo?.username;
  // const contactList = infoData?.userInfo?.contactList;

  ///END: USER INFO////
  /////////////////////

  ////////////////////////////////////////////////////////////////////////////

  /////////////////////////
  ///START: LOGOUT USER////

  const [logoutUser] = useMutation(LOGOUT_USER_MUTATION, {
    onCompleted(data) {},
  });

  const handleLogout = () => {
    const userToken = localStorage.getItem("authToken");

    logoutUser({ variables: { token: userToken } });
  };
  ///END: LOGOUT USER////
  ///////////////////////

  ////////////////////////////////////////////////////////////////////////////

  //////////////////////////////
  ///START: STATUS QUERY////////
  // Fetch user status on component load
  // This is only to test, will be used in another component
  const { data: userStatusData } = useQuery(GET_USER_STATUS_QUERY, {
    variables: { username: "test2" },
  });

  console.log("DASHBOARD: userStatusData: ", userStatusData);

  // React.useEffect(() => {
  //   if (userStatusData) {
  //     console.log("User Status:", userStatusData.getUserStatus.onlineStatus);
  //   }
  // }, [userStatusData]);
  ///END: STATUS QUERY////
  ////////////////////////

  ////////////////////////////////////////////////////////////////////////////

  ///////////////////////
  ///START: REDUX////////
  // const onlineUsers = useSelector((state) => state.onlineUsers);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (usernameFromInfo) {
      dispatch(loginAction(usernameFromInfo));
    }
  }, [dispatch, usernameFromInfo]);
  ///END: REDUX////////
  /////////////////////

  ////////////////////////////////////////////////////////////////////////////

  /////////////////////////////
  /////START: SUBSCRIPTION/////
  const { data: subscriptionData, error: subscriptionError } = useSubscription(
    CHANGE_USER_STATUS,
    {
      variables: { username: usernameFromInfo },
      onSubscriptionData: ({ subscriptionData }) => {
        const { username, status } = subscriptionData.data.changeUserStatus;

        if (status === "ONLINE") {
          console.log(usernameFromInfo, username);
          dispatch(loginAction(usernameFromInfo, username));
        } else if (status === "OFFLINE") {
          dispatch(logoutAction(username));
        }
      },
    }
  );

  // Error handling for the user info query
  if (infoError) {
    return <p>Error in fetching user info: {infoError.message}</p>;
  }

  // Error handling for the subscription
  if (subscriptionError) {
    return <p>Error in subscription: {subscriptionError.message}</p>;
  }

  const { username: friendUsername, status } =
    subscriptionData?.changeUserStatus || {};
  /////END: SUBSCRIPTION///////
  /////////////////////////////

  return (
    <div>
      <h1>{usernameFromInfo}</h1>
      <GeneralNotifications />
      {friendUsername ? (
        <p>
          {friendUsername}'s status is now: {status}
        </p>
      ) : (
        <p>Waiting for status update...</p>
      )}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

// // // // // import * as React from "react";

// // // // // // import { useSubscription, useQuery, gql } from "@apollo/client";
// // // // // import { useSubscription, useQuery, useMutation, gql } from "@apollo/client";

// // // // // // import { INFO_QUERY } from "../../graphql/userQueries";
// // // // // import { useDispatch } from "react-redux"; // New Import
// // // // // import { loginAction } from "./../../redux/actions"; // New Import

// // // // // import { INFO_QUERY, GET_USER_STATUS_QUERY } from "../../graphql/userQueries";
// // // // // import { LOGOUT_USER_MUTATION } from "../../graphql/authQueries";

// // // // // import { useSelector } from "react-redux";

// // // // // const CHANGE_TO_ONLINE = gql`
// // // // //   subscription ChangeUserToOnline($username: String!) {
// // // // //     changeUserToOnline(username: $username) {
// // // // //       username
// // // // //       status
// // // // //     }
// // // // //   }
// // // // // `;

// // // // // export default function Dashboard() {
// // // // //   ///////////////////////
// // // // //   ///START: USER INFO////
// // // // //   const {
// // // // //     data: infoData,
// // // // //     loading: infoLoading,
// // // // //     error: infoError,
// // // // //   } = useQuery(INFO_QUERY, {
// // // // //     fetchPolicy: "no-cache",
// // // // //   });

// // // // //   const usernameFromInfo = infoData?.userInfo?.username;
// // // // //   const contactListFromInfo = infoData?.userInfo?.contactList;

// // // // //   const [logoutUser, { data: logoutData }] = useMutation(LOGOUT_USER_MUTATION, {
// // // // //     onCompleted(data) {
// // // // //       console.log("Logout result:", data.logoutUser.message);
// // // // //     },
// // // // //   });

// // // // //   const handleLogout = () => {
// // // // //     // Assuming you are storing the token in redux or local state
// // // // //     // Replace "yourUserTokenHere" with the appropriate variable or state where you store the token.
// // // // //     logoutUser({ variables: { token: "yourUserTokenHere" } });
// // // // //   };

// // // // //   // Fetch user status on component load
// // // // //   const { data: userStatusData } = useQuery(GET_USER_STATUS_QUERY, {
// // // // //     variables: { username: usernameFromInfo },
// // // // //   });

// // // // //   React.useEffect(() => {
// // // // //     if (userStatusData) {
// // // // //       console.log("User Status:", userStatusData.getUserStatus.onlineStatus);
// // // // //     }
// // // // //   }, [userStatusData]);
// // // // //   ///END: USER INFO////
// // // // //   /////////////////////

// // // // //   ///////////////////////
// // // // //   ///START: REDUX////////
// // // // //   const onlineUsers = useSelector((state) => state.onlineUsers);

// // // // //   console.log("ONLINE USERS: ", onlineUsers);

// // // // //   const dispatch = useDispatch(); // New addition

// // // // //   React.useEffect(() => {
// // // // //     if (usernameFromInfo && contactListFromInfo) {
// // // // //       console.log(contactListFromInfo);
// // // // //       dispatch(loginAction(usernameFromInfo));
// // // // //     }
// // // // //   }, [dispatch, usernameFromInfo, contactListFromInfo]);

// // // // //   ///END: REDUX////////
// // // // //   /////////////////////

// // // // //   /////////////////////////////
// // // // //   /////START: SUBSCRIPTION/////
// // // // //   const {
// // // // //     data: subscriptionData,
// // // // //     loading: subscriptionLoading,
// // // // //     error: subscriptionError,
// // // // //   } = useSubscription(CHANGE_TO_ONLINE, {
// // // // //     variables: { username: usernameFromInfo },
// // // // //   });

// // // // //   // Handle loading and error states for both query and subscription

// // // // //   if (infoLoading || subscriptionLoading)
// // // // //     return (
// // // // //       <div>
// // // // //         <h1>{usernameFromInfo}</h1>
// // // // //         <p>Loading...</p>
// // // // //       </div>
// // // // //     );

// // // // //   if (infoError) {
// // // // //     return <p>Error in fetching user info: {infoError.message}</p>;
// // // // //   }

// // // // //   if (subscriptionError) {
// // // // //     return <p>Error in subscription: {subscriptionError.message}</p>;
// // // // //   }

// // // // //   // Destructure only if friendStatusChanged exists, else provide a default value

// // // // //   const { username: friendUsername, status } =
// // // // //     subscriptionData?.changeUserToOnline || { username: "", status: "" };

// // // // //   /////END: SUBSCRIPTION///////
// // // // //   /////////////////////////////

// // // // //   return (
// // // // //     <div>
// // // // //       {friendUsername ? (
// // // // //         <p>
// // // // //           {friendUsername}'s status is now: {status}
// // // // //         </p>
// // // // //       ) : (
// // // // //         <div>
// // // // //           <p>Waiting for status update...</p>
// // // // //         </div>
// // // // //       )}
// // // // //       <button onClick={handleLogout}>Logout</button>
// // // // //     </div>
// // // // //   );
// // // // // }

////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
// import { useSubscription, useQuery, gql } from "@apollo/client";
// import { INFO_QUERY } from "../../graphql/userQueries";
// import { useRetrieveContactRequests } from "./contactRequestLogic";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import CssBaseline from "@mui/material/CssBaseline";
// import Box from "@mui/material/Box";
// import React, { useState } from "react";
// import AppBarComponent from "./dashboardElements/AppBarComponent";
// import StaticDrawerComponent from "./dashboardElements/StaticDrawerComponent";
// import MainContentComponent from "./dashboardElements/MainContentComponent";

// const FRIEND_STATUS_CHANGED = gql`
//   subscription FriendStatusChanged($username: String!) {
//     friendStatusChanged(username: $username) {
//       username
//       status
//     }
//   }
// `;

// const defaultTheme = createTheme();

// export default function Dashboard() {
//   const [content, setContent] = useState(null);

//   // INFO_QUERY related logic
//   const {
//     data: infoData,
//     loading: infoLoading,
//     error: infoError,
//     refetch: refetchInfo,
//   } = useQuery(INFO_QUERY, {
//     fetchPolicy: "no-cache",
//   });
//   const userFromInfo = infoData?.userInfo?.username;

//   // Subscription logic
//   const { data: subscriptionData, error: subscriptionError } = useSubscription(
//     FRIEND_STATUS_CHANGED,
//     {
//       variables: { username: userFromInfo },
//     }
//   );
//   const { username: friendUsername, status } =
//     subscriptionData?.friendStatusChanged || { username: "", status: "" };

//   // Check for friend status change and log it
//   if (friendUsername && status) {
//     console.log(`${friendUsername}'s status is now: ${status}`);
//   }

//   // Custom hook logic
//   const { contactRequests, refetch: refetchContactRequests } =
//     useRetrieveContactRequests();

//   const handleContactsClick = async () => {
//     setContent("contacts");
//     await refetchContactRequests();
//     await refetchInfo();
//   };

//   if (infoLoading) return <p>Loading...</p>;
//   if (infoError) return <p>Error: {infoError.message}</p>;
//   if (subscriptionError)
//     return <p>Error in subscription: {subscriptionError.message}</p>;

//   return (
//     <ThemeProvider theme={defaultTheme}>
//       <Box sx={{ display: "flex" }}>
//         <CssBaseline />
//         <AppBarComponent username={userFromInfo || "Dashboard"} />
//         <StaticDrawerComponent onContactsClick={handleContactsClick} />
//         <MainContentComponent
//           content={content}
//           infoData={infoData}
//           contactRequests={contactRequests}
//         />
//       </Box>
//     </ThemeProvider>
//   );
// }
