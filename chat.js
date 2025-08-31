import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  sender: {
    type: String, // "user" or "bot"
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Create the model and export it
const Chat = mongoose.model('Chat', chatSchema);
export default Chat;
