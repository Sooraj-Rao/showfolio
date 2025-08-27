import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { GetUserId } from "../helper/utils";
import User from "@/models/user";
import Resume from "@/models/resume";
import { Analytics } from "@/models/analytics";

export async function GET(req: NextRequest) {
  try {
    const userId = GetUserId(req);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized..Login again" },
        { status: 401 }
      );
    }
    await connectDB();
    Resume.countDocuments();
    const user = await User.findById(userId)
      .select("-password")
      .populate("resumes");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const personalInfo = user?.portfolioData
      ? JSON.parse(user?.portfolioData)?.personalInfo
      : "";
    const isPortfolio = personalInfo?.name && personalInfo?.email;

    return NextResponse.json({
      name: user.name,
      email: user.email,
      portfolio: user.portfolio || null,
      templateId: user.templateId || null,
      private: {
        profile: user.private.profile,
        portfolio: user.private.portfolio,
        resumes: user.private.resumes,
      },
      hasPorfolioData: isPortfolio ? true : false,
      imageUrl: user?.imageUrl || "",
      portfolioSettings: {
        themeColor: user.portfolioSettings?.themeColor || null,
        theme: user.portfolioSettings?.theme || null,
        showContacts: user.portfolioSettings?.showContacts ,
        analyticsTrack: user.portfolioSettings?.analyticsTrack ,
      },
      resumes: user.resumes,
      createdAt: user.createdAt,
      isActive: user.isActive,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const userId = GetUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const operation = url.searchParams.get("operation");

    if (operation == "disableAcc" || operation == "enableAcc") {
      const type = operation == "disableAcc" ? false : true;
      await connectDB();
      const user = await User.findByIdAndUpdate(
        userId,
        { isActive: type },
        { new: true }
      ).select("-password");
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json({
        message: `Account has been ${
          type ? "Enable" : "Disable"
        } successfully.`,
        active: user.isActive,
      });
    }

    const { name, email, profile, resumes } = await req.json();

    await connectDB();
    const user = await User.findByIdAndUpdate(
      userId,
      { name, email, private: { profile, resumes } },
      { new: true }
    ).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      name: user.name,
      email: user.email,
      private: {
        profile: user.private.profile,
        resumes: user.private.resumes,
      },
    });
  } catch (error) {
    console.error("Error updating user data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = GetUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const userDeletion = User.findByIdAndDelete(userId);
    const analyticsDeletion = Analytics.deleteMany({ user: userId });
    const resumesDeletion = Resume.deleteMany({ user: userId }); 


    await Promise.all([userDeletion, analyticsDeletion, resumesDeletion]);

    if (!userDeletion) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const response = NextResponse.json({
      message: "Account deleted successfully",
    });
    response.cookies.set("token", "", { maxAge: 0 });

    return response;
  } catch (error) {
    console.error("Error deleting user account:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
