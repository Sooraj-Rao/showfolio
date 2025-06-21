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
  isActive: boolean;
  templateId: string;
  portfolio: string;
  portfolioData: string;
  aiCredits: number;
  private: {
    portfolio: boolean;
    profile: boolean;
    resumes: boolean;
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
    isActive: {
      type: Boolean,
      default: true,
    },
    aiCredits: {
      type: Number,
      default: 5,
    },
    portfolio: {
      type: String,
    },
    portfolioData: {
      type: String,
    },
    templateId: {
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
      resumes: {
        type: Boolean,
        default: false,
        required: true,
      },
    },
    imageUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);
export default User;
