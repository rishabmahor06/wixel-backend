import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    projectType: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    projectDetails: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
            );

export default mongoose.models.User || mongoose.model("User", userSchema);
