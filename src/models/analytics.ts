import mongoose, { Model, Schema } from "mongoose";
import { IResume } from "./resume";

export interface IAnalytics {
  resume: mongoose.Types.ObjectId | IResume;
  user: mongoose.Types.ObjectId;
  event: string;
  referrer: string;
  device: string;
  os: string;
  browser: string;
  city: string;
  country: string;
  countryCode: string;
  region: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const AnalyticsSchema = new Schema<IAnalytics>(
  {
    resume: { type: Schema.Types.ObjectId, ref: "Resume" },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    event: String,
    referrer: String,
    device: String,
    os: String,
    browser: String,
    city: String,
    country: String,
    countryCode: String,
    region: String,
  },
  { timestamps: true }
);

export const Analytics: Model<IAnalytics> =
  mongoose.models.Analytics ||
  mongoose.model<IAnalytics>("Analytics", AnalyticsSchema);
