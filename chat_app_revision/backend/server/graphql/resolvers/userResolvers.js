const userResolvers = {
  Query: {
    userInfo: async (_source, _args, { dataSources, token }) => {
      const validation = await dataSources.authAPI.validateUserOperation(token);

      const validatedUser = validation.validatedUser;

      // If token is valid, proceed with getUserInfo
      return dataSources.userAPI.getUserInfo({ validatedUser });
    },

    searchUser: async (_source, { searchTerm }, { dataSources, token }) => {
      const validatedUser = await dataSources.authAPI.validateUserOperation(
        token
      );

      return dataSources.userAPI.searchUser({ searchTerm, validatedUser });
    },

    //////////////////////////////////////////////////
    retrieveContactRequests: async (_source, _args, { dataSources, token }) => {
      const validation = await dataSources.authAPI.validateUserOperation(token);

      const validatedUser = validation.validatedUser;

      return dataSources.userAPI.retrieveContactRequests({ validatedUser });
    },

    retrievePendingContactRequests: async (
      _source,
      _args,
      { dataSources, token }
    ) => {
      const validation = await dataSources.authAPI.validateUserOperation(token);

      const validatedUser = validation.validatedUser;

      return dataSources.userAPI.retrievePendingContactRequests({
        validatedUser,
      });
    },

    ////////

    verifyIfPreviousConversationExists: async (
      _source,
      { sender, receiver },
      { dataSources }
    ) => {
      return dataSources.userAPI.verifyIfPreviousConversationExists({
        sender,
        receiver,
      });
    },

    onlineFriends: async (_source, _args, { dataSources, token }) => {
      const validation = await dataSources.authAPI.validateUserOperation(token);
      const validatedUser = validation.validatedUser;

      return dataSources.userAPI.getOnlineFriends(validatedUser);
    },

    getUserStatus: async (_source, { username }, { dataSources, token }) => {
      await dataSources.authAPI.validateUserOperation(token);
      return dataSources.userAPI.getUserStatus({ username });
    },
  },

  Mutation: {
    createUser: async (
      _source,
      { email, username, avatar, contactList },
      { dataSources }
    ) => {
      return dataSources.userAPI.createUser({
        email,
        username,
        avatar,
        contactList,
      });
    },

    sendContactRequest: async (
      _source,
      { receiverUsername },
      { dataSources, token }
    ) => {
      const validation = await dataSources.authAPI.validateUserOperation(token);

      const validatedUser = validation.validatedUser;

      return dataSources.userAPI.sendContactRequest({
        validatedUser,
        receiverUsername,
      });
    },

    acceptContactRequest: async (
      _source,
      { senderUsername },
      { dataSources, token }
    ) => {
      const validation = await dataSources.authAPI.validateUserOperation(token);

      const validatedUser = validation.validatedUser;

      return dataSources.userAPI.acceptContactRequest({
        validatedUser,
        senderUsername,
      });
    },

    rejectContactRequest: async (
      _source,
      { senderUsername },
      { dataSources, token }
    ) => {
      const validation = await dataSources.authAPI.validateUserOperation(token);

      const validatedUser = validation.validatedUser;

      return dataSources.userAPI.rejectContactRequest({
        validatedUser,
        senderUsername,
      });
    },

    deleteContact: async (
      _source,
      { receiverUsername },
      { dataSources, token }
    ) => {
      const validation = await dataSources.authAPI.validateUserOperation(token);

      const validatedUser = validation.validatedUser;

      return dataSources.userAPI.deleteContact({
        validatedUser,
        receiverUsername,
      });
    },

    cancelRequest: async (
      _source,
      { receiverUsername },
      { dataSources, token }
    ) => {
      const validation = await dataSources.authAPI.validateUserOperation(token);

      const validatedUser = validation.validatedUser;

      return dataSources.userAPI.cancelRequest({
        validatedUser,
        receiverUsername,
      });
    },

    addConversationIdToParticipantsProfiles: async (
      _source,
      { chatID, creator, receivers, isGroup },
      { dataSources }
    ) => {
      return dataSources.userAPI.addConversationIdToParticipantsProfiles({
        chatID,
        creator,
        receivers,
        isGroup,
      });
    },
    changeUserToOnline: async (
      _source,
      { username },
      { dataSources, token }
    ) => {
      await dataSources.authAPI.validateUserOperation(token);
      return dataSources.userAPI.changeUserToOnline({ username });
    },

    changeUserToOffline: async (
      _source,
      { username },
      { dataSources, token }
    ) => {
      await dataSources.authAPI.validateUserOperation(token);
      return dataSources.userAPI.changeUserToOffline({ username });
    },
  },
};

module.exports = userResolvers;
