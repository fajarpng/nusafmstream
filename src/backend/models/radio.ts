import { DataStream } from "@/utils/types"
import mongoose from "mongoose"

mongoose.Promise = global.Promise

const Schema = new mongoose.Schema<DataStream>({
  title: {
    type: String,
    required: true,
  },
  logo: String,
  streamUrl: {
    type: String,
    required: true,
  },
})

const Radio = mongoose.models?.Radio || mongoose.model("Radio", Schema)
export default Radio