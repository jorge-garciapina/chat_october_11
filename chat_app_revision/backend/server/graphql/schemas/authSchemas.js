const authSchemas = `#graphql
  type Example{
    email: String
    username: String
    password: String
  }

  type validateUser{
    success: Boolean,
    validatedUser: String
  }

  type Query {
    users: [Example]
    validateUserOperation: validateUser
    validateMessageReciever(receiver: String!): validateUser

  }

  type User {
    token: String
    message: String
  }

  type Mutation {
    registerUser(email: String, username: String, password: String, avatar: String): User
    loginUser(username: String, password: String): User
    changePassword(token: String!, oldPassword: String!, newPassword: String!): User
    logoutUser(token: String!): User
  }

  type Subscription {
  userLoggedIn(notifiedUser: String!): String
}
`;

module.exports = authSchemas;
