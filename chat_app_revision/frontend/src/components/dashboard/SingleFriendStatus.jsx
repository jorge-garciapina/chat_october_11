// SingleFriendStatus.js
import { useState } from "react";
import { useQuery, useSubscription } from "@apollo/client";
import {
  GET_USER_STATUS_QUERY,
  // CHANGE_USER_STATUS,
} from "../../graphql/userQueries";

import { CHANGE_USER_STATUS } from "./../../graphql/subscriptionClient";

function SingleFriendStatus({ friendUsername }) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { data: userStatusData, refetch } = useQuery(GET_USER_STATUS_QUERY, {
    variables: { username: friendUsername },
    skip: !isSubscribed,
  });

  const { data: subscriptionData } = useSubscription(CHANGE_USER_STATUS, {
    variables: { username: friendUsername },
    skip: !isSubscribed,
  });

  const handleSimulateClick = () => {
    if (!isSubscribed) {
      refetch();
      setIsSubscribed(true);
    } else {
      setIsSubscribed(false);
    }
  };

  const statusFromSubscription = subscriptionData?.changeUserStatus?.status;
  const currentStatus =
    statusFromSubscription || userStatusData?.getUserStatus?.onlineStatus;

  console.log(friendUsername);

  return (
    <div>
      <span>{friendUsername}</span> |
      <button onClick={handleSimulateClick}>
        {isSubscribed ? "Stop Simulation" : "Simulate Status in Conversation"}
      </button>{" "}
      |<span>User Status: {currentStatus}</span>
    </div>
  );
}

export default SingleFriendStatus;
