// FriendStatus.js

import SingleFriendStatus from "./SingleFriendStatus";

export default function FriendStatus({ contactList }) {
  console.log(contactList);
  return (
    <div>
      {contactList?.map((friend) => (
        <SingleFriendStatus
          key={friend.username}
          friendUsername={friend.username}
        />
      ))}

      <SingleFriendStatus key={"test2"} friendUsername={"test2"} />
    </div>
  );
}
