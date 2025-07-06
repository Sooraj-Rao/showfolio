import { NextRequest, NextResponse } from "next/server";
import { GetUserId } from "../../helper/utils";
import User from "@/models/user";
import connectDB from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const userId = GetUserId(req);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized..Login again" },
        { status: 401 }
      );
    }
    const updateData: {
      portfolioData?: string;
      imageUrl?: string;
      portfolio?: string;
    } = {};

    const { portfolioData, portfolio, imageUrl } = await req.json();
    if (portfolioData) {
      updateData.portfolioData = JSON.stringify(portfolioData);
    }
    if (portfolio) {
      updateData.portfolio = portfolio;
    }
    if (imageUrl) {
      updateData.imageUrl = imageUrl;
    }

    const res = await User.findByIdAndUpdate(userId, updateData, { new: true });
    if (!res) {
      return NextResponse.json(
        { error: "Failed to save portfolio" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "Portfolio saved successfully", portfolio: res.portfolio },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = await GetUserId(req);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized..Login again" },
        { status: 401 }
      );
    }
    const user = await User.findById(userId).select("portfolioData");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(
      { portfolio: JSON.parse(user.portfolioData || "{}") },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const userId = await GetUserId(req);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized..Login again" },
        { status: 401 }
      );
    }
    await connectDB();
    const { templateId, portfolio, appearance, privacy } = await req.json();
    if (templateId) {
      const res = await User.findByIdAndUpdate(
        userId,
        {
          templateId,
        },
        { new: true, upsert: true }
      );
      if (res.templateId == templateId) {
        return NextResponse.json(
          { message: "Successfully saved template for portfolio" },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { error: "Failed to save template" },
          { status: 500 }
        );
      }
    } else if (portfolio) {
      const res = await User.findByIdAndUpdate(
        userId,
        {
          portfolio,
        },
        { new: true, upsert: true }
      );
      if (res.portfolio == portfolio) {
        return NextResponse.json(
          { message: "Successfully saved for portfolio link" },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { error: "Failed to save portfolio link" },
          { status: 500 }
        );
      }
    } else if (appearance) {
      const res = await User.findByIdAndUpdate(
        userId,
        {
          "portfolioSettings.theme": appearance.theme,
          "portfolioSettings.themeColor": appearance.themeColor,
        },

        { new: true, upsert: true }
      );
      if (
        res.portfolioSettings.theme == appearance.theme &&
        res.portfolioSettings.themeColor == appearance.themeColor
      ) {
        return NextResponse.json(
          { message: "Successfully saved appearance" },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { error: "Failed to save portfolio appearance" },
          { status: 500 }
        );
      }
    } else if (privacy) {
      const res = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            "portfolioSettings.analyticsTrack": privacy.analyticsTrack,
            "portfolioSettings.showContacts": privacy.showContacts,
            "private.portfolio": !privacy.isPublic,
          },
        },
        { new: true, upsert: true }
      );
      console.log(res.portfolioSettings);
      if (
        res.portfolioSettings.analyticsTrack === privacy.analyticsTrack &&
        res.portfolioSettings.showContacts === privacy.showContacts &&
        res.private.portfolio === !privacy.isPublic
      ) {
        return NextResponse.json(
          { message: "Successfully saved privacy settings", data: privacy },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { error: "Failed to save portfolio privacy settings" },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
