// Importing the necessary modules and environmental variables
const express = require("express");
const ConversationDocument = require("../models/conversationModel");

// Creating a new Express Router instance
const router = express.Router();

/////////////////////////
router.post("/sendMessage", async (req, res) => {
  // Extract parameters from the request body
  const { sender, receiver, id, content } = req.body;

  console.log("sender", sender);
  console.log("receiver", receiver);

  try {
    // CASE 1: User send message to herself
    if (sender === receiver) {
      return res
        .status(200)
        .json({ error: "You cannot send messages to yourself" });
    }

    let conversation;
    if (id) {
      // CASE 2: Conversation already exists
      conversation = await ConversationDocument.findById(id);

      // Check if conversation exists
      if (!conversation) {
        return res.status(200).json({ error: "Conversation not found" });
      }

      // Check if sender is part of the conversation
      if (!conversation.participants.includes(sender)) {
        return res
          .status(200)
          .json({ error: "Sender not part of the conversation" });
      }
    } else {
      conversation = new ConversationDocument({
        participants: [sender, receiver],
        conversation: [],
      });
      await conversation.save();
    }

    // Construct the message object
    const message = {
      sender,
      content,
      date: new Date(),
      index: conversation.conversation.length,
    };

    // Add the message to the conversation
    conversation.conversation.push(message);

    // Save the updated conversation
    await conversation.save();

    // Send back the conversation ID and receivers
    res.status(200).json({
      chatID: conversation._id,
      receivers: conversation.participants.filter(
        (participant) => participant !== sender
      ),
    });
  } catch (error) {
    // Handle any errors
    res.status(500).json({ error: "Server Error: " + error.message });
  }
});

///////////////////////////////
router.post("/createGroupConversation", async (req, res) => {
  // Extract parameters from the request body
  const { creator, validatedReceivers, rejectedReceivers } = req.body;

  try {
    // Filter in case creator added himself to the group conversation:
    const filterReceivers = validatedReceivers.filter((receiver) => {
      return receiver !== creator;
    });
    // Add the creator to the participants list
    const allParticipants = [...filterReceivers, creator];

    // Create a new conversation
    const conversation = new ConversationDocument({
      participants: allParticipants,
      admins: [creator],
      conversation: [],
    });

    // Save the conversation
    await conversation.save();

    // Send back the conversation ID and participants
    res.status(200).json({
      chatID: conversation._id,
      participants: allParticipants,
      rejectedUsers: rejectedReceivers,
    });
  } catch (error) {
    // Handle any errors
    res.status(500).json({ error: "Server Error: " + error.message });
  }
});

router.get("/retrieveMessagesFromConversation/:id", async (req, res) => {
  // Extract the conversation ID from the request:
  const conversationID = req.params.id;

  try {
    // Use the id to retrieve the conversation from DB:
    const conversation = await ConversationDocument.findById(conversationID);

    // Conversation not found:
    if (!conversation) {
      return res.status(200).json({ error: "Conversation not found" });
    }

    //TODO: retrieve: conversation.conversation, check consumers
    return res.status(200).json(conversation);
  } catch (error) {
    // Handle any errors
    res.status(500).json({ error: "Server Error: " + error.message });
  }
});

router.get("/retrieveParticipantsFromConversation/:id", async (req, res) => {
  // Extract the conversation ID from the request:
  const conversationID = req.params.id;

  try {
    // Use the id to retrieve the conversation from DB:
    const conversation = await ConversationDocument.findById(conversationID);

    // Conversation not found:
    if (!conversation) {
      return res.status(200).json({ error: "Conversation not found" });
    }

    return res.status(200).json(conversation.participants);
  } catch (error) {
    // Handle any errors
    res.status(500).json({ error: "Server Error: " + error.message });
  }
});

module.exports = router;
