import { Schema, model } from "mongoose";

const msgSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    receiver: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    message: {
      type: String,
      trim: true,
      required: function () {
        if (this.media.length === 0) return true;
        return false;
      },
    },
    media: [String],
  },
  { timestamps: true }
);
msgSchema.index({sender:1, receiver:1})
msgSchema.index({receiver:1})
msgSchema.index({sender:1})

const ChatMessage = model("ChatMessage", msgSchema)



export default ChatMessage