// actions.js
export const loginAction = (usernameFromInfo, username) => ({
  type: "LOGIN",
  payload: { usernameFromInfo, username },
});

export const logoutAction = (username) => ({
  type: "LOGOUT",
  payload: { username },
});
