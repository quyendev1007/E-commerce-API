import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    avatar: {
      type: String,
    },
    phone: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
userSchema.plugin(mongoosePaginate);

export const User = mongoose.model("User", userSchema);
