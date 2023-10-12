// Modules:

import * as React from "react";
import { useSubscription, useQuery, useMutation } from "@apollo/client";
import { useDispatch } from "react-redux";

// REDUX:
import { loginAction, logoutAction } from "./../../redux/actions";

// GRAPHQL
import { LOGOUT_USER_MUTATION } from "../../graphql/authQueries";
import { INFO_QUERY, GET_USER_STATUS_QUERY } from "../../graphql/userQueries";
import { CHANGE_USER_STATUS } from "../../graphql/subscriptionClient";

// OTHER REACT COMPONENTS:
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
    // ENTER HERE THE NAME OF THE USER YOU WANT TO FETCH HIS STATUS:
    variables: { username: "test2" },
  });

  console.log("DASHBOARD: userStatusData: ", userStatusData);

  ///END: STATUS QUERY////
  ////////////////////////

  ////////////////////////////////////////////////////////////////////////////

  ///////////////////////
  ///START: REDUX////////
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
