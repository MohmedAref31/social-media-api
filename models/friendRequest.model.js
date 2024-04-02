import mongoose, { Schema } from "mongoose";

const FriendRequestSchema = new mongoose.Schema({
  sender: { type: Schema.ObjectId, ref: "User", required: true },
  receiver: { type: Schema.ObjectId, ref: "User", required: true },
  accepted: {
    type: Boolean,
    default: false,
  },

}, {timestamps:true});

const FriendRequest = mongoose.model("FriendRequest", FriendRequestSchema);

export default FriendRequest;
