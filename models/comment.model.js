import { Schema, model } from "mongoose";

const commentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    content: {
      type: String,
      required: true,
    },
    likes: {
      type: Map,
      of: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      default: new Map(),
    },
    replies: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    parentComment:{
        type: Schema.Types.ObjectId,
        ref: "Comment",
        default:null,
    },
    postId:{
      type:Schema.Types.ObjectId,
      required:true,
    },
    type:{
      type:String,
      default:'comment',
    }
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

commentSchema.virtual("repliesNumber").get(function () {
  return this.replies.length;
});
commentSchema.virtual("likesNumber").get(function () {
  const likes = this.likes;
  return likes.size;
});
const Comment = model("Comment", commentSchema);

export default Comment;
