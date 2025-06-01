"use server";

import Resume from "@/models/resume";

export const ClickEvent = async ({
  resume,
  event,
}: {
  resume: string;
  event: string;
}) => {
  let res;
  if (event === "download") {
    res = await Resume.findOneAndUpdate(
      { shortUrl: resume },
      { $inc: { "analytics.downloads": 1 } },
      { new: true }
    );
  } else if (event === "views") {
    res = await Resume.findOneAndUpdate(
      { shortUrl: resume },
      { $inc: { "analytics.views": 1 } },
      { new: true }
    );
  }
  console.log(res);
};
