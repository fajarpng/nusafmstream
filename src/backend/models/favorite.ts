import mongoose from "mongoose"

mongoose.Promise = global.Promise

const Schema = new mongoose.Schema({
  visitorId: {
    type: String,
    required: true,
    index: true,
  },
  radio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Radio",
    required: true,
  },
}, { timestamps: true })

Schema.index({ visitorId: 1, radio: 1 }, { unique: true })

const Favorite = mongoose.models?.Favorite || mongoose.model("Favorite", Schema)
export default Favorite
