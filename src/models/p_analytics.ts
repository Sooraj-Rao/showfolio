import mongoose, { Schema } from "mongoose";

const PortfolioAnalyticsSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    page: {
      type: String,
      required: true,
    },

    section: {
      type: String,
    },

    anchor: {
      type: String,
    },

    event: {
      type: String,
      required: true,
      enum: [
        "page_view",
        "section_view",
        "time_spent",
        "scroll_depth",
        "click",
        "contact_form_submit",
        "project_view",
        "resume_download",
        "social_link_click",
        "external_link_click",
      ],
    },

    timeSpent: {
      type: Number,
      default: 0,
    },

    scrollDepth: {
      type: Number,
      default: 0,
    },

    clickTarget: {
      type: String,
    },

    device: {
      type: String,
      enum: ["desktop", "mobile", "tablet"],
      required: true,
    },

    os: {
      type: String,
      required: true,
    },

    browser: {
      type: String,
      required: true,
    },

    screenResolution: {
      type: String,
    },

    city: {
      type: String,
      required: true,
    },

    region: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      required: true,
    },

    countryCode: {
      type: String,
      required: true,
    },

    referrer: {
      type: String,
      default: null,
    },

    userAgent: {
      type: String,
      required: true,
    },

    ipHash: {
      type: String,
      required: true,
    },

    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

PortfolioAnalyticsSchema.index({ sessionId: 1, timestamp: -1 });
PortfolioAnalyticsSchema.index({ event: 1, timestamp: -1 });
PortfolioAnalyticsSchema.index({ page: 1, timestamp: -1 });
PortfolioAnalyticsSchema.index({ country: 1, timestamp: -1 });
PortfolioAnalyticsSchema.index({ device: 1, timestamp: -1 });

export default mongoose.models.PortfolioAnalytics ||
  mongoose.model("PortfolioAnalytics", PortfolioAnalyticsSchema);
