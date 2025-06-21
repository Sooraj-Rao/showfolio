import mongoose from "mongoose"

const PortfolioAnalyticsSchema = new mongoose.Schema(
  {
    // Session tracking
    sessionId: {
      type: String,
      required: true,
      index: true,
    },

    // Page/Route information
    page: {
      type: String,
      required: true, // e.g., '/portfolio', '/about', '/blog/post-1'
    },

    section: {
      type: String, // e.g., 'hero', 'projects', 'about', 'contact'
    },

    anchor: {
      type: String, // for # anchors like '#projects', '#contact'
    },

    // Event tracking
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

    // Time tracking
    timeSpent: {
      type: Number, // in seconds
      default: 0,
    },

    scrollDepth: {
      type: Number, // percentage (0-100)
      default: 0,
    },

    // Click tracking
    clickTarget: {
      type: String, // element clicked, project name, link URL, etc.
    },

    // Device & Browser info
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
      type: String, // e.g., '1920x1080'
    },

    // Location (from /api/loc)
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

    // Traffic source
    referrer: {
      type: String, // from ref parameter or document.referrer
      default: null,
    },

    // User agent for additional analysis
    userAgent: {
      type: String,
      required: true,
    },

    // IP for session tracking (hashed for privacy)
    ipHash: {
      type: String,
      required: true,
    },

    // Timestamps
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for better query performance
PortfolioAnalyticsSchema.index({ sessionId: 1, timestamp: -1 })
PortfolioAnalyticsSchema.index({ event: 1, timestamp: -1 })
PortfolioAnalyticsSchema.index({ page: 1, timestamp: -1 })
PortfolioAnalyticsSchema.index({ country: 1, timestamp: -1 })
PortfolioAnalyticsSchema.index({ device: 1, timestamp: -1 })

export default mongoose.models.PortfolioAnalytics || mongoose.model("PortfolioAnalytics", PortfolioAnalyticsSchema)
