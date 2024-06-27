import mongoose, { Schema } from "mongoose";



const postSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.ObjectId,
      ref: "User",
      required: [true, "user is is required"],
    },
    location: String,
    content: String,
    picture: String,
    likes: {
      type: Map,
      of: {
        type: Schema.ObjectId,
        ref: "User",
      },
      default: new Map(),
    },

    comments: [
      {
        type:Schema.Types.ObjectId,
        ref:"Comment"
      }
    ],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

postSchema.virtual("commentsNumber").get(function () {
  return this.comments.length;
});
postSchema.virtual("likesNumber").get(function () {
  const likes = this.likes;
  return likes.size;
});

postSchema.post("aggregate", function (posts) {
  posts.forEach((post) => {
    if (post.picture) post.picture = `${process.env.BASE_URL}${post.picture}`;
  });
});


export default mongoose.model("Post", postSchema);
