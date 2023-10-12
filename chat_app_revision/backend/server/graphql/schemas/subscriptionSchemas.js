const { gql } = require("apollo-server-express");

const subscriptionSchemas = gql`
  type UserStatus {
    username: String!
    status: String!
    contactList: [String] # <-- Add this line
  }

  type Query {
    dummy: String
  }

  type Mutation {
    changeStatusLogin(username: String!): UserStatus
    changeStatusLogout(username: String!): UserStatus
    changeFriendStatus(username: String!, status: String!): UserStatus
  }

  type Subscription {
    changeUserToOnline(username: String!): UserStatus
    changeUserToOffline(username: String!): UserStatus
    changeUserStatus(username: String!): UserStatus
  }

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`;

module.exports = subscriptionSchemas;
