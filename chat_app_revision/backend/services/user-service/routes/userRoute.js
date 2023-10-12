const express = require("express");
const User = require("../models/userModel");
const router = express.Router();

//////////////////////////////////
router.get("/information", async (req, res) => {
  try {
    console.log(process.env.USER_CONNECTION);
    res.status(200).json("information endpoint");
  } catch (error) {
    res.status(500).json({ error: "Server Error: " + error.message });
  }
});

///////////////////////////////////
// Route to create a new user
router.post("/create", async (req, res) => {
  const { email, username, avatar, contactList } = req.body;
  try {
    const user = new User({ email, username, avatar, contactList });
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server Error: " + error.message });
  }
});

//////////////////////////////////
router.get("/info/:validatedUser", async (req, res) => {
  try {
    const username = req.params.validatedUser;
    const validatedUserProfile = await User.findOne({ username });
    if (!validatedUserProfile) {
      return res.status(200).json({ error: "User not found" });
    }
    const { email, contactList, avatar, friendRequests } = validatedUserProfile;
    res
      .status(200)
      .json({ email, username, contactList, avatar, friendRequests });
  } catch (error) {
    res.status(500).json({ error: "Server Error: " + error.message });
  }
});
///////////////////////////////////
router.post("/searchUser", async (req, res) => {
  try {
    const userToSearch = req.body.searchTerm;
    const { validatedUser } = req.body.validatedUser;

    const usersFound = await User.find({
      username: new RegExp("^" + userToSearch, "i"),
    });

    // console.log(usersFound);

    const filteredResults = usersFound.filter((result) => {
      return result.username !== validatedUser;
    });

    if (!usersFound.length) {
      return res
        .status(200)
        .json({ error: "No user found for the given search term" });
    }

    const searchResults = filteredResults.map((user) => ({
      username: user.username,
      avatar: user.avatar,
    }));
    res.status(200).json(searchResults);
  } catch (error) {
    res.status(500).json({ error: "Server Error: " + error.message });
  }
});

///////////////////////////////////
// Endpoint to retrieve contact requests
router.get("/retrieveContactRequests/:validatedUser", async (req, res) => {
  try {
    const validatedUser = req.params.validatedUser;
    const validatedUserProfile = await User.findOne({
      username: validatedUser,
    });

    console.log(validatedUserProfile);

    if (!validatedUserProfile) {
      return res.status(200).json({ error: "User not found" });
    }
    // Extract and return just the current received contact requests
    const contactRequests = validatedUserProfile.receivedContactRequests.map(
      (request) => request.sender
    );
    res.status(200).json(contactRequests);
  } catch (error) {
    res.status(500).json({ error: "Server Error: " + error.message });
  }
});
///////////////////////////////////
// Route to retrieve pending contact requests
router.get(
  "/retrievePendingContactRequests/:validatedUser",
  async (req, res) => {
    try {
      const validatedUser = req.params.validatedUser;
      const validatedUserProfile = await User.findOne({
        username: validatedUser,
      });
      if (!validatedUserProfile) {
        return res.status(200).json({ error: "User not found" });
      }

      // Extract and return contact requets made by validated user
      const pendingContactRequests =
        validatedUserProfile.pendingContactRequests.map(
          (request) => request.receiver
        );
      res.status(200).json(pendingContactRequests);
    } catch (error) {
      res.status(500).json({ error: "Server Error: " + error.message });
    }
  }
);
///////////////////////////////////
router.post("/sendContactRequest", async (req, res) => {
  try {
    const validatedUser = req.body.validatedUser;
    const validatedUserProfile = await User.findOne({
      username: validatedUser,
    });
    if (!validatedUserProfile) {
      return res.status(200).json({ error: "Sender not found" });
    }

    // Prevent users from sending a friend request to themselves
    const receiver = req.body.receiverUsername;
    if (validatedUser === receiver) {
      return res
        .status(200)
        .json({ message: "You can't send a friend request to yourself." });
    }
    const receiverProfile = await User.findOne({ username: receiver });
    if (!receiverProfile) {
      return res.status(200).json({ message: "Receiver not found" });
    }

    // Check if receiver is already in sender's contactList
    if (validatedUserProfile.contactList.includes(receiver)) {
      return res
        .status(200)
        .json({ message: "You are already friends with this user." });
    }

    // Check if a pending request already exists
    const pendingRequest = validatedUserProfile.pendingContactRequests.find(
      (request) => request.receiver === receiver
    );
    if (pendingRequest) {
      return res
        .status(200)
        .json({ message: "Pending request already exists" });
    }

    // Check if there are 3 or more rejected requests
    const rejectedRequest = validatedUserProfile.rejectedContactRequests.find(
      (request) => request.receiver === receiver
    );
    if (rejectedRequest && rejectedRequest.rejectionCount >= 3) {
      return res.status(200).json({
        message: "Your request cannot be sent due to multiple past rejections",
      });
    }

    // Everything is OK, send the request:
    validatedUserProfile.pendingContactRequests.push({
      receiver: receiver,
    });

    console.log(validatedUserProfile.pendingContactRequests);
    await validatedUserProfile.save();

    receiverProfile.receivedContactRequests.push({
      sender: validatedUser,
      status: "pending",
    });
    await receiverProfile.save();
    res.status(200).json({ message: "Friend request sent" });
  } catch (error) {
    res.status(500).json({ error: "Server Error: " + error.message });
  }
});
///////////////////////////////////

// To accept a contact request
router.post("/acceptContactRequest", async (req, res) => {
  try {
    const validatedUser = req.body.validatedUser;
    const validatedUserProfile = await User.findOne({
      username: validatedUser,
    });
    if (!validatedUserProfile) {
      return res.status(200).json({ error: "User not found" });
    }
    const userWhoSends = req.body.senderUsername;
    const userWhoSendsProfile = await User.findOne({ username: userWhoSends });
    // Ensure that a request from the sender exists in the receiver's receivedContactRequests
    const requestIndex = validatedUserProfile.receivedContactRequests.findIndex(
      (request) =>
        request.sender === userWhoSends && request.status === "pending"
    );
    if (requestIndex === -1) {
      return res
        .status(200)
        .json({ message: "No pending request from the specified sender" });
    }

    // Add each other to their contact lists
    validatedUserProfile.contactList.push(userWhoSends);
    userWhoSendsProfile.contactList.push(validatedUser);

    // Remove the request from the receiver's receivedContactRequests and sender's pendingContactRequests
    validatedUserProfile.receivedContactRequests.splice(requestIndex, 1);
    const pendingRequestIndex =
      userWhoSendsProfile.pendingContactRequests.findIndex(
        (request) => request.receiver === validatedUser
      );
    userWhoSendsProfile.pendingContactRequests.splice(pendingRequestIndex, 1);
    await validatedUserProfile.save();
    await userWhoSendsProfile.save();
    res.status(200).json({ message: "Contact request accepted" });
  } catch (error) {
    res.status(500).json({ error: "Server Error: " + error.message });
  }
});
///////////////////////////////////

// To reject a contact request
router.post("/rejectContactRequest", async (req, res) => {
  try {
    const validatedUser = req.body.validatedUser;
    const validatedUserProfile = await User.findOne({
      username: validatedUser,
    });
    if (!validatedUserProfile) {
      return res.status(200).json({ error: "User not found" });
    }

    const userWhoSends = req.body.senderUsername;
    const userWhoSendsProfile = await User.findOne({ username: userWhoSends });

    // Ensure that a request from the sender exists in the receiver's receivedContactRequests
    const requestIndex = validatedUserProfile.receivedContactRequests.findIndex(
      (request) =>
        request.sender === userWhoSends && request.status === "pending"
    );
    if (requestIndex === -1) {
      return res
        .status(200)
        .json({ message: "No pending request from the specified sender" });
    }

    // Remove the request from the receiver's receivedContactRequests and sender's pendingContactRequests
    validatedUserProfile.receivedContactRequests.splice(requestIndex, 1);
    const pendingRequestIndex =
      userWhoSendsProfile.pendingContactRequests.findIndex(
        (request) => request.receiver === validatedUser
      );
    userWhoSendsProfile.pendingContactRequests.splice(pendingRequestIndex, 1);

    // Add or update the rejection in the sender's rejectedContactRequests
    let rejection = userWhoSendsProfile.rejectedContactRequests.find(
      (rejection) => rejection.receiver === validatedUser
    );
    if (rejection) {
      rejection.rejectionCount += 1;
      rejection.date = Date.now();
    } else {
      userWhoSendsProfile.rejectedContactRequests.push({
        receiver: validatedUser,
        date: Date.now(),
        rejectionCount: 1,
      });
    }
    await validatedUserProfile.save();
    await userWhoSendsProfile.save();
    res.status(200).json({ message: "Contact request rejected" });
  } catch (error) {
    res.status(500).json({ error: "Server Error: " + error.message });
  }
});
///////////////////////////////////

router.post("/deleteContact", async (req, res) => {
  try {
    const validatedUser = req.body.validatedUser;
    const validatedUserProfile = await User.findOne({
      username: validatedUser,
    });
    if (!validatedUserProfile) {
      return res.status(200).json({ error: "Sender not found" });
    }
    const userToDelete = req.body.receiverUsername;
    const userToDeleteProfile = await User.findOne({ username: userToDelete });
    if (!userToDeleteProfile) {
      return res.status(200).json({ error: "Receiver not found" });
    }

    // Check if receiver is in sender's contactList
    const contactIndex = validatedUserProfile.contactList.findIndex(
      (contact) => contact === userToDelete
    );
    if (contactIndex === -1) {
      return res
        .status(200)
        .json({ message: "You are not friends with this user." });
    }

    // Delete receiver from sender's contactList
    validatedUserProfile.contactList.splice(contactIndex, 1);
    await validatedUserProfile.save();

    // Delete sender from receiver's contactList
    const senderIndex = userToDeleteProfile.contactList.findIndex(
      (contact) => contact === validatedUser
    );
    if (senderIndex !== -1) {
      userToDeleteProfile.contactList.splice(senderIndex, 1);
      await userToDeleteProfile.save();
    }
    res.status(200).json({ message: "Contact deleted" });
  } catch (error) {
    res.status(500).json({ error: "Server Error: " + error.message });
  }
});
///////////////////////////////////

router.post("/cancelRequest", async (req, res) => {
  try {
    const validatedUser = req.body.validatedUser;
    const validatedUserProfile = await User.findOne({
      username: validatedUser,
    });
    if (!validatedUserProfile) {
      return res.status(200).json({ error: "Sender not found" });
    }
    const receiver = req.body.receiverUsername;
    const receiverProfile = await User.findOne({
      username: receiver,
    });
    if (!receiverProfile) {
      return res.status(200).json({ error: "Receiver not found" });
    }

    // Find and remove request from sender's pendingContactRequests
    const senderRequestIndex =
      validatedUserProfile.pendingContactRequests.findIndex(
        (request) => request.receiver === receiver
      );
    if (senderRequestIndex !== -1) {
      validatedUserProfile.pendingContactRequests.splice(senderRequestIndex, 1);
      await validatedUserProfile.save();
    } else {
      return res.status(400).json({ message: "No pending request to cancel" });
    }

    // Find and remove request from receiver's receivedContactRequests
    const receiverRequestIndex =
      receiverProfile.receivedContactRequests.findIndex(
        (request) =>
          request.sender === validatedUser && request.status === "pending"
      );
    if (receiverRequestIndex !== -1) {
      receiverProfile.receivedContactRequests.splice(receiverRequestIndex, 1);
      await receiverProfile.save();
    }
    res.json({ message: "Friend request cancelled" });
  } catch (error) {
    res.status(500).json({ error: "Server Error: " + error.message });
  }
});

///////////////////////////////////
router.post("/addConversationIdToParticipantsProfiles", async (req, res) => {
  const { chatID, creator, receivers, isGroup } = req.body;

  let participants;
  if (Array.isArray(receivers)) {
    const filteredReceivers = receivers.filter((user) => {
      return user !== creator;
    });
    participants = [creator, ...filteredReceivers];
  } else {
    participants = [creator, receivers];
  }

  try {
    participants.map(async (participant) => {
      const participantProfile = await User.findOne({ username: participant });
      if (isGroup) {
        participantProfile.chatsGroup.push(chatID);
        await participantProfile.save();
      } else {
        const interlocutor = participants
          .filter((locutor) => {
            return locutor !== participant;
          })
          .at(0);

        const chatsOneToOneInUser = participantProfile.chatsOneToOne;

        const isTheIdInUserProfile = chatsOneToOneInUser.filter((chat) => {
          return chatID === chat.chatID;
        });

        if (!isTheIdInUserProfile) {
          participantProfile.chatsOneToOne.push({ chatID, interlocutor });
          await participantProfile.save();
        }
      }
    });

    res.json({ chatID: chatID });
  } catch (error) {
    res.status(500).json({ error: "Server Error: " + error.message });
  }
});

///////////////////////////////////
router.get("/verifyIfPreviousConversationExists/:sender", async (req, res) => {
  const validatedSender = req.params.sender;
  const validatedReceiver = req.query.receiver;

  const validatedSenderProfile = await User.findOne({
    username: validatedSender,
  });

  const oneToOneChats = validatedSenderProfile.chatsOneToOne;

  const filteredOneToOneChats = oneToOneChats.filter((chatOneToOne) => {
    return chatOneToOne.interlocutor === validatedReceiver;
  });

  let chatID;
  try {
    const previousConversation = filteredOneToOneChats.at(0);
    chatID = previousConversation.chatID;
  } catch (error) {
    chatID = null;
  }

  try {
    res.json({ previousConversation: chatID });
  } catch (error) {
    res.status(500).json({ error: "Server Error: " + error.message });
  }
});

//////////////////////////////////////////////////////////////////
router.get("/onlineFriends", async (req, res) => {
  try {
    const validatedUser = req.query.validatedUser;

    const validatedUserProfile = await User.findOne({
      username: validatedUser,
    });

    if (!validatedUserProfile) {
      return res.status(400).json({ error: "User not found" });
    }

    const onlineFriends = [];

    for (const contactUsername of validatedUserProfile.contactList) {
      const contactUserProfile = await User.findOne({
        username: contactUsername,
      });

      if (contactUserProfile && contactUserProfile.online) {
        onlineFriends.push(contactUsername);
      }
    }

    res.status(200).json({ onlineFriends });
  } catch (error) {
    res.status(500).json({ error: "Server Error: " + error.message });
  }
});

// ... Your existing imports

// changeUserToOnline Route: Sets the user's online status to true based on the provided username
router.patch("/changeUserToOnline", async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.online = true;
    await user.save();
    res.status(200).json({ message: "User is now online" });
  } catch (error) {
    res.status(500).json({ error: "Server Error: " + error.message });
  }
});

// changeUserToOffline Route: Sets the user's online status to false based on the provided username
router.patch("/changeUserToOffline", async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.online = false;
    await user.save();
    res.status(200).json({ message: `${username} is now offline` });
  } catch (error) {
    res.status(500).json({ error: "Server Error: " + error.message });
  }
});

// getUserStatus Route: Retrieves the online status of a user based on the provided username
router.get("/getUserStatus", async (req, res) => {
  try {
    const { username } = req.query; // Using query parameters for GET requests
    const user = await User.findOne({ username }, "online"); // Project only the 'online' field
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ onlineStatus: user.online });
  } catch (error) {
    res.status(500).json({ error: "Server Error: " + error.message });
  }
});

module.exports = router;
