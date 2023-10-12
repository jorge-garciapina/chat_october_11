// Import required packages
const { PubSub } = require("graphql-subscriptions");

// Initialize the PubSub instance for real-time updates
const pubsub = new PubSub();
pubsub.ee.setMaxListeners(30);

function changeUserToOnline(username, contactList) {
  const status = "ONLINE";

  pubsub.publish("CHANGE_TO_ONLINE", {
    changeUserToOnline: { username, status, contactList },
  });

  return { username, status, contactList };
}

function changeUserToOffline(username, contactList) {
  const status = "OFFLINE";

  pubsub.publish("CHANGE_TO_OFFLINE", {
    changeUserToOffline: { username, status, contactList },
  });

  return { username, status, contactList };
}

function changeUserStatus(username, contactList, status) {
  pubsub.publish("CHANGE_USER_STATUS", {
    changeUserStatus: { username, status, contactList },
  });

  return { username, status, contactList };
}

// Export all necessary variables as a single object
module.exports = {
  pubsub,
  changeUserToOnline,
  changeUserToOffline,
  changeUserStatus,
};
