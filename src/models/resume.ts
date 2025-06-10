import mongoose, { Schema, Document, Model } from "mongoose";
import { IUser } from "./user";

export interface IResume extends Document {
  user: mongoose.Types.ObjectId | IUser;
  title: string;
  fileUrl: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  analytics: {
    views: number;
    shares: number;
    downloads: number;
  };
  shortUrl: string;
  isPublic: boolean;
  passwordProtected: boolean;
  password?: string;
}

const ResumeSchema: Schema<IResume> = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    shortUrl: {
      type: String,
      unique: true,
    },

    isPublic: {
      type: Boolean,
      default: true,
    },
    passwordProtected: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      select: false,
    },
    analytics: {
      views: {
        type: Number,
        default: 0,
      },
      shares: {
        type: Number,
        default: 0,
      },
      downloads: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Resume: Model<IResume> =
  mongoose.models.Resume || mongoose.model<IResume>("Resume", ResumeSchema);

export default Resume;
