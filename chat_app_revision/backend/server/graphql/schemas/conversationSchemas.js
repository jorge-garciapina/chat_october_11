const conversationSchemas = `#graphql
  type Message {
    index: Int
    sender: String
    content: String
    date: String
  }
  type Conversation {
    _id: String
    participants: [String]
    conversation: [Message]
  }
  type MessageResponse {
    chatID: String
    receivers: [String]
  }
  type Group {
    chatID: String
    participants: [String]
    rejectedUsers: [String]
  }


  type Query {
    retrieveMessagesFromConversation(id: String): Conversation
    retrieveParticipantsFromConversation(id: String): [String]

  }
  type Mutation {
    sendMessage( receiver: String, id: String, content: String): MessageResponse
    createGroupConversation(participants: [String]): Group
  }
`;

module.exports = conversationSchemas;
