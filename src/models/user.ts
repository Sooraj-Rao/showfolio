import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  imageUrl: string;
  resumes: mongoose.Types.ObjectId[];
  provider: "email" | "google" | "linkedin";
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  image: string;
  isActive: boolean;
  portfolio: string;
  resumeCredits: number;
  sharedResumes: string[];
  private: {
    portfolio: boolean;
    profile: boolean;
  };
  settings: {
    notifications: boolean;
  };
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    image: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    resumes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Resume",
      required: true,
    },
    provider: {
      type: String,
      enum: ["email", "google", "linkedin"],
      default: "email",
    },
    lastLogin: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    resumeCredits: {
      type: Number,
      default: 5,
    },
    sharedResumes: {
      type: [String],
      default: [],
    },
    portfolio: {
      type: String,
    },
    private: {
      portfolio: {
        type: Boolean,
        default: false,
        required: true,
      },
      profile: {
        type: Boolean,
        default: false,
        required: true,
      },
    },
    imageUrl: {
      type: String,
    },

    settings: {
      notifications: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);
export default User;
