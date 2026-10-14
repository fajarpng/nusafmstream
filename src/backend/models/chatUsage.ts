import mongoose from "mongoose"

mongoose.Promise = global.Promise

// One document per chat request; MongoDB deletes them after a day
const Schema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24,
  },
})

Schema.index({ key: 1, createdAt: 1 })

const ChatUsage = mongoose.models?.ChatUsage || mongoose.model("ChatUsage", Schema)
export default ChatUsage
