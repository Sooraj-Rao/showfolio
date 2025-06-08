import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { GetUserId } from "../helper/utils";
import User from "@/models/user";
import Resume from "@/models/resume";

export async function GET(req: NextRequest) {
  try {
    const userId = GetUserId(req);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized..Login again" },
        { status: 401 }
      );
    }

    // await connectDB();
    await Resume.countDocuments();
    const user = await User.findById(userId)
      .select("-password")
      .populate("resumes");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({
      name: user.name,
      email: user.email,
      portfolio: user.portfolio || null,
      private: {
        profile: user.private.profile,
        portfolio: user.private.portfolio,
      },
      imageUrl: user.imageUrl,
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

    if (operation === "disableAcc") {
      await connectDB();
      const user = await User.findByIdAndUpdate(
        userId,
        { isActive: false },
        { new: true }
      ).select("-password");
      console.log(user?.isActive);
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json({
        message: "Account has been disabled successfully.",
        active: user.isActive,
      });
    }

    const { name, email, profile, portfolio } = await req.json();

    await connectDB();
    const user = await User.findByIdAndUpdate(
      userId,
      { name, email, private: { profile, portfolio } },
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
        portfolio: user.private.portfolio,
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
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
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
