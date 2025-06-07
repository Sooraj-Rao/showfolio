import mongoose, { Schema } from "mongoose";

const AnalyticsSchema = new Schema(
  {
    resume: { type: Schema.Types.ObjectId, ref: "Resume" },
    event: String,
    referrer: String,
    device: String,
    os: String,
    browser: String,
    city: String,
    country: String,
  },
  { timestamps: true }
);

export const Analytics =
  mongoose.models.Analytics || mongoose.model("Analytics", AnalyticsSchema);
