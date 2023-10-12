const initialState = {
  username: null,
  onlineFriends: [],
  notifications: [],
};

const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN":
      const newUser = action.payload.username;

      // Create a new notification when a user logs in
      const newNotification = {
        message: `${newUser} is online`,
      };

      // Check if the notification already exists in the notifications array
      const notificationExists = state.notifications.some(
        (notification) => notification.message === newNotification.message
      );

      let updatedNotifications = state.notifications;
      if (!notificationExists) {
        updatedNotifications = [...state.notifications, newNotification];
      }

      if (!newUser) {
        updatedNotifications = [...state.notifications];
      }

      // Check if the username already exists in onlineFriends
      if (!state.onlineFriends.includes(newUser)) {
        return {
          ...state,
          username: newUser,
          onlineFriends: [...state.onlineFriends, newUser],
          notifications: updatedNotifications,
        };
      } else {
        // If the user is already in the onlineFriends array, return the state with possibly updated notifications
        return {
          ...state,
          username: newUser,
          notifications: updatedNotifications,
        };
      }

    case "LOGOUT":
      const logoutUser = action.payload.username;

      // Check if the username exists in onlineFriends
      if (state.onlineFriends.includes(logoutUser)) {
        // Filter the user out of the onlineFriends list
        const updatedUsers = state.onlineFriends.filter(
          (user) => user !== logoutUser
        );
        return {
          ...state,
          username: null, // Clear the current user as the user has logged out
          onlineFriends: updatedUsers,
        };
      } else {
        // If the user isn't in the onlineFriends array, just return the state as it is
        return state;
      }

    default:
      return state; // Just return the state as it is without making changes
  }
};

export default loginReducer;
