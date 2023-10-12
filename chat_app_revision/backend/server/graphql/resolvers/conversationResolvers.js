const { ApolloError } = require("apollo-server-errors");

const conversationResolvers = {
  Query: {
    retrieveMessagesFromConversation: async (
      _source,
      { id },
      { dataSources, token }
    ) => {
      try {
        await dataSources.authAPI.validateUserOperation(token);

        return await dataSources.conversationAPI.retrieveMessagesFromConversation(
          id
        );
      } catch (error) {
        throw new ApolloError(` ${error.message}`, "SERVER_ERROR");
      }
    },
  },
  Mutation: {
    sendMessage: async (
      _source,
      { receiver, id, content },
      { dataSources, token }
    ) => {
      try {
        const senderValidation =
          await dataSources.authAPI.validateUserOperation(token);
        const sender = senderValidation.validatedUser;

        // If there is an ID, it means that sender and receiver or receivers have been
        // validated in the past and are already part of a conversation.
        let isPrevious;
        if (!id) {
          const receiverValidation =
            await dataSources.authAPI.validateMessageReciever(receiver);
          receiver = receiverValidation.validatedUser;

          // In case ID is not given but there is a conversation between users
          // This is only for oneToOne
          isPrevious =
            await dataSources.userAPI.verifyIfPreviousConversationExists({
              sender,
              receiver,
            });

          if (isPrevious.previousConversation) {
            id = isPrevious.previousConversation;
          }
        } else {
          // No needed if a valid ID is provided
          receiver =
            await dataSources.conversationAPI.retrieveParticipantsFromConversation(
              id
            );
        }

        const messageSent = await dataSources.conversationAPI.sendMessage({
          sender,
          receiver,
          id,
          content,
        });

        await dataSources.userAPI.addConversationIdToParticipantsProfiles({
          chatID: messageSent.chatID,
          creator: sender,
          receivers: receiver,
          isGroup: false,
        });

        return messageSent;
      } catch (error) {
        throw new ApolloError(` ${error.message}`, "SERVER_ERROR");
      }
    },
    createGroupConversation: async (
      _source,
      { participants },
      { dataSources, token }
    ) => {
      try {
        // validate the group's creator
        const senderValidation =
          await dataSources.authAPI.validateUserOperation(token);
        creator = senderValidation.validatedUser;

        //--------------------START: VALIDATE MULTIPLE RECEIVERS--------------------
        // Validate each participant:
        const participantValidations = participants.map((participant) =>
          dataSources.authAPI.validateMessageReciever(participant)
        );

        // Wait for all promises to settle, whether they fulfill or reject.
        const results = await Promise.allSettled(participantValidations);

        // Divide in validated and rejected users.
        const validatedReceivers = [];
        const rejectedReceivers = [];
        results.forEach((result, index) => {
          if (result.status === "fulfilled") {
            validatedReceivers.push(participants[index]);
          } else if (result.status === "rejected") {
            rejectedReceivers.push(participants[index]);
          }
        });
        //-------------------END: VALIDATE MULTIPLE RECEIVERS-------------------

        const groupConversationInfo =
          await dataSources.conversationAPI.createGroupConversation({
            creator,
            validatedReceivers,
            rejectedReceivers,
          });

        await dataSources.userAPI.addConversationIdToParticipantsProfiles({
          chatID: groupConversationInfo.chatID,
          creator,
          receivers: validatedReceivers,
          isGroup: true,
        });

        // Once creator and participants are validated, proceed with group creation
        return groupConversationInfo;
      } catch (error) {
        throw new ApolloError(` ${error.message}`, "SERVER_ERROR");
      }
    },
  },
};

module.exports = conversationResolvers;
