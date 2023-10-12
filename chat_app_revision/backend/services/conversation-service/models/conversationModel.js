const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  // 'index' field will store the index of the message in the conversation.
  index: { type: Number, required: true },

  // 'sender' field will store the user who sent the message.
  sender: { type: String, required: true },

  // 'date' field will store the date in which the message was sent.
  date: { type: Date, default: Date.now },

  // 'content' field will store the content of the message.
  content: { type: String, required: true },
});

const ConversationSchema = new mongoose.Schema({
  // 'participants' field will store the users who are part of the conversation.
  participants: { type: Array, required: true },

  admins: { type: Array, required: true },

  // 'conversation' field will store the array of messages sent in the conversation.
  conversation: [MessageSchema],
});

module.exports = mongoose.model("Conversations", ConversationSchema);
