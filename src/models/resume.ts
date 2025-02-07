import mongoose, { Schema, Document, Model } from "mongoose";
import { IUser } from "./user";

export interface IResume extends Document {
  user: mongoose.Types.ObjectId | IUser;
  title: string;
  fileUrl: string;
  fileType: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  folder?: string;
  shortUrl: string;
  qrCode?: string;
  isPublic: boolean;
  passwordProtected: boolean;
  password?: string;
  analytics: {
    views: number;
    clicks: number;
    regions: Record<string, number>;
    devices: Record<string, number>;
  };
  archiveVersions: {
    version: number;
    fileUrl: string;
    createdAt: Date;
  }[];
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
    fileType: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    folder: {
      type: String,
      trim: true,
    },
    shortUrl: {
      type: String,
      unique: true,
    },
    qrCode: {
      type: String,
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
      clicks: {
        type: Number,
        default: 0,
      },
      regions: {
        type: Map,
        of: Number,
        default: {},
      },
      devices: {
        type: Map,
        of: Number,
        default: {},
      },
    },
    archiveVersions: [
      {
        version: {
          type: Number,
          required: true,
        },
        fileUrl: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Resume: Model<IResume> =
  mongoose.models.Resume || mongoose.model<IResume>("Resume", ResumeSchema);

export default Resume;
