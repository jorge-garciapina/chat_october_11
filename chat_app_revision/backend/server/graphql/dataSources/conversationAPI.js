// Import the RESTDataSource module from the Apollo server's data source REST package.
const { RESTDataSource } = require("apollo-datasource-rest");

// Define the ConversationService class, which will handle conversation-related operations.
class ConversationService extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "http://localhost:3003/conversation/";
    // this.baseURL = "http://conversation-service:3003/conversation/";
  }

  // This function intercepts all outgoing requests and attaches the "Authorization" header with the user's token.
  willSendRequest(request) {
    request.headers.set("Authorization", this.context.token);
  }

  // Function to send a message. It takes sender, receiver, conversation ID, and the content of the message as parameters.
  async sendMessage({ sender, receiver, id, content }) {
    const response = await this.post(`sendMessage`, {
      sender,
      receiver,
      id,
      content,
    });
    // Check for any errors in the response and throw an exception if any is found.
    if (response.error) {
      throw new Error(response.error);
    }
    return response;
  }

  // Function to create a group conversation. It requires details of the creator, validated receivers, and any rejected receivers.
  async createGroupConversation({
    creator,
    validatedReceivers,
    rejectedReceivers,
  }) {
    const response = await this.post(`createGroupConversation`, {
      creator,
      validatedReceivers,
      rejectedReceivers,
    });
    // Check for any errors in the response and throw an exception if any is found.
    if (response.error) {
      throw new Error(response.error);
    }
    return response;
  }

  // Function to retrieve all messages from a particular conversation identified by its ID.
  async retrieveMessagesFromConversation(id) {
    const response = await this.get(`retrieveMessagesFromConversation/${id}`);
    // Check for any errors in the response and throw an exception if any is found.
    if (response.error) {
      throw new Error(response.error);
    }
    return response;
  }

  // Function to retrieve all participants of a particular conversation, identified by its ID.
  async retrieveParticipantsFromConversation(id) {
    const response = await this.get(
      `retrieveParticipantsFromConversation/${id}`
    );
    // Check for any errors in the response and throw an exception if any is found.
    if (response.error) {
      throw new Error(response.error);
    }
    return response;
  }
}

// Export the ConversationService class so that it can be used in other parts of the application.
module.exports = ConversationService;
