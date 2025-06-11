import connectDB from "@/lib/db";
import Resume from "@/models/resume";
import User from "@/models/user";
import { IUser } from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectDB();
  User.countDocuments()
  const { searchParams } = new URL(req.url);
  const shortUrl = searchParams.get("shortUrl");

  if (!shortUrl) {
    return NextResponse.json(
      { error: "Short URL is required." },
      { status: 400 }
    );
  }

  return getResumePreview(shortUrl);
}

async function getResumePreview(shortUrl: string) {
  try {
    const resume = await Resume.findOne({ shortUrl }).populate({
      path: "user",
      select: "-password",
    });
    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }
    if (!resume.isPublic) {
      return NextResponse.json(
        { error: "Resume is private. You do not have permission to view it." },
        { status: 403 }
      );
    }

    const user = resume.user as IUser;

    if (user.private.resumes) {
      return NextResponse.json(
        { error: "Resume is private. Access denied." },
        { status: 401 }
      );
    }

    if (!user?.isActive) {
      return NextResponse.json(
        { error: "Resume owner account is disabled. Access denied." },
        { status: 403 }
      );
    }

    const portfolioUrl = user.private ? user.private.portfolio : null;

    const result = {
      name: user.name,
      email: user.email,
      fileUrl: `/api/resume-file?resume=${shortUrl}`,
      portfolioUrl: portfolioUrl,
    };

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Error fetching resume:", error);

    if (error instanceof Error) {
      if (error.name === "CastError") {
        return NextResponse.json(
          { error: "Error occurred while fetching the resume." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: "An unexpected error occurred while fetching the resume." },
      { status: 500 }
    );
  }
}

// import Resume from "@/models/resume";
// import { NextRequest, NextResponse } from "next/server";
// import geoip from "geoip-lite"; // To detect regions
// import { UAParser } from "ua-parser-js"; // To detect device information

// export async function GET(req: NextRequest) {
//   const { searchParams } = new URL(req.url);
//   const shortUrl = searchParams.get("shortUrl");

//   if (!shortUrl) {
//     return NextResponse.json(
//       { error: "Short URL is required." },
//       { status: 400 }
//     );
//   }

//   // Extract analytics data from the request
//   const userAgent = req.headers.get("user-agent");
//   const ip = req.ip || req.headers.get("x-forwarded-for") || "unknown";
//   const referrer = req.headers.get("referer");

//   // Increment view count and gather analytics data
//   await updateResumeAnalytics(shortUrl, userAgent, ip, referrer);

//   // Return the result from getResumePreview
//   return getResumePreview(shortUrl);
// }

// async function updateResumeAnalytics(
//   shortUrl: string,
//   userAgent: string | null,
//   ip: string,
//   referrer: string | null
// ) {
//   try {
//     const resume = await Resume.findOneAndUpdate({ shortUrl });

//     if (!resume) {
//       console.error("Resume not found for analytics update");
//       return;
//     }

//     // Increment views
//     resume.analytics.views += 1;

//     // Track device type using ua-parser-js
//     const parser = new UAParser();
//     parser.setUA(userAgent || "");
//     const deviceType = parser.getDevice().type; // e.g., 'mobile', 'tablet', 'desktop'

//     if (deviceType) {
//       resume.analytics.devices.set(
//         deviceType,
//         (resume.analytics.devices.get(deviceType) || 0) + 1
//       );
//     }

//     // Track region using geoip
//     const geo = geoip.lookup(ip);
//     if (geo && geo.country) {
//       resume.analytics.regions.set(
//         geo.country,
//         (resume.analytics.regions.get(geo.country) || 0) + 1
//       );
//     }

//     // Track clicks (you can modify this to count real clicks via frontend tracking)
//     if (referrer) {
//       resume.analytics.clicks += 1;
//     }

//     // Save the updated analytics data
//     await resume.save();
//   } catch (error: any) {
//     console.error("Error updating analytics for resume:", error);
//   }
// }

// async function getResumePreview(shortUrl: string) {
//   try {
//     const resume = await Resume.findOne({ shortUrl }).populate(
//       "user",
//       "-password"
//     );
//     console.log(resume?.title);
//     if (!resume) {
//       return NextResponse.json({ error: "Resume not found" }, { status: 404 });
//     }

//     // Check if the resume is public or not
//     if (!resume.isPublic) {
//       return NextResponse.json(
//         { error: "Resume is private. You do not have permission to view it." },
//         { status: 403 }
//       );
//     }

//     // Check if the resume is password protected
//     if (resume.passwordProtected) {
//       return NextResponse.json(
//         { error: "Resume is password protected. Access denied." },
//         { status: 401 }
//       );
//     }

//     if (!resume.user.isActive) {
//       return NextResponse.json(
//         { error: "Resume owner account is disabled. Access denied." },
//         { status: 403 }
//       );
//     }

//     // Check if user has a valid portfolio (handle case where 'private' might not exist)
//     const portfolioUrl = resume.user.private
//       ? resume.user.private.portfolio
//       : null;

//     // Construct the result object
//     const result = {
//       name: resume.user.name,
//       email: resume.user.email,
//       fileUrl: resume.fileUrl,
//       portfolioUrl: portfolioUrl,
//     };

//     return NextResponse.json(result);
//   } catch (error: any) {
//     console.error("Error fetching resume preview:", error);

//     // Default error message
//     return NextResponse.json(
//       { error: "An unexpected error occurred while fetching the resume." },
//       { status: 500 }
//     );
//   }
// }
