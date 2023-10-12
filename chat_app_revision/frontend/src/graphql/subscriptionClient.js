import gql from "graphql-tag";

export const CHANGE_TO_ONLINE = gql`
  subscription ChangeUserToOnline($username: String!) {
    changeUserToOnline(username: $username) {
      username
      status
    }
  }
`;

export const CHANGE_USER_STATUS = gql`
  subscription Subscription($username: String!) {
    changeUserStatus(username: $username) {
      status
      username
    }
  }
`;
