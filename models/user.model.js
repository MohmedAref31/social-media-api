import mongoose, { Schema, SchemaType } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: "first name is required",
      min: [2, "first name minimum length is 2"],
      max: [50, "first name mxnimum length is 50"],
      trim: true,
    },
    lastName: {
      type: String,
      required: "last name is required",
      min: [2, "last name minimum length is 2"],
      max: [50, "last name mxnimum length is 50"],
      trim: true,
    },
    email: {
      type: String,
      required: "email is required ",
      unique: [true, "sorry this email is taken"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
      trim: true,
    },
    password: {
      type: String,
      required: "password is required",
      minLength: [6, "password minimum length is 6"],
      trim: true,
    },
    profileImage: {
      type: String,
      default: "",
    },
    friends: [{ type: Schema.ObjectId, ref: "User" }],
    registerType: {
      type: String,
      enum: ["register", "google"],
      default: "register",
    },
    passwordResetCode: String,
    passwordResetCodeExpiresAt: Date,
    passwordResetCodeverifiedExpiresAt: Date,
    passwordResetCodeVerified: Boolean,
  },
  { timestamps: true }
);

userSchema.post("find", (docs) => {
  docs.forEach((doc) => {
    if (doc.profileImage)
      doc.profileImage = `${process.env.BASE_URL}${doc.profileImage}`;
  });
});

const User = mongoose.model("User", userSchema);

export default User;
