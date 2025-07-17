import mongoose from "mongoose";
import { Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  provider: "email" | "google";
  portfolio?: string;
  portfolioData: string;
  templateId: string;
  imageUrl: string;
  portfolioSettings: {
    theme: string;
    themeColor: string;
    showContacts: boolean;
    analyticsTrack: boolean;
  };
  private: {
    profile: boolean;
    portfolio: boolean;
    resumes: boolean;
  };
  resumes: mongoose.Types.ObjectId[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    googleId: {
      type: String,
      sparse: true,
    },
    provider: {
      type: String,
      enum: ["email", "google"],
      default: "email",
    },
    portfolio: {
      type: String,
      unique: true,
    },
    portfolioData: {
      type: String,
      default: "{}",
    },
    templateId: {
      type: String,
      default: "2",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    portfolioSettings: {
      theme: {
        type: String,
        default: "default",
      },
      themeColor: {
        type: String,
        default: "#000000",
      },
      showContacts: {
        type: Boolean,
        default: true,
      },
      analyticsTrack: {
        type: Boolean,
        default: true,
      },
    },
    private: {
      profile: {
        type: Boolean,
        default: false,
      },
      portfolio: {
        type: Boolean,
        default: false,
      },
      resumes: {
        type: Boolean,
        default: false,
      },
    },
    resumes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Resume",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
