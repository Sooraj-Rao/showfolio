"use server";

import Resume from "@/models/resume";

export const ClickEvent = async ({
  resume,
  event,
}: {
  resume: string;
  event: string;
}) => {
  if (event === "download") {
    await Resume.findOneAndUpdate(
      { shortUrl: resume },
      { $inc: { "analytics.downloads": 1 } },
      { new: true }
    );
  } else if (event === "views") {
    await Resume.findOneAndUpdate(
      { shortUrl: resume },
      { $inc: { "analytics.views": 1 } },
      { new: true }
    );
  } else if (event === "shares") {
    await Resume.findOneAndUpdate(
      { shortUrl: resume },
      { $inc: { "analytics.shares": 1 } },
      { new: true }
    );
  }
};
