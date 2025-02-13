"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Share2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";

export default function SharePortfolio({
  portfolio,
}: {
  portfolio: string | null;
}) {
  const [portfolioUrl] = useState(portfolio);

  const handleCopyLink = () => {
    if (!portfolioUrl) return;
    navigator.clipboard.writeText(portfolioUrl);
    toast({
      title: "Link Copied",
      description: "Your portfolio link has been copied to the clipboard.",
    });
  };

  const handleShare = async () => {
    if (!portfolioUrl) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Portfolio",
          text: "Check out my portfolio!",
          url: portfolioUrl,
        });
        toast({
          title: "Shared Successfully",
          description: "Your portfolio has been shared.",
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      handleCopyLink();
    }
  };

  const handleDownloadQR = () => {
    if (!portfolio) return;
    const svg = document.getElementById("portfolio-qr-code");
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = "portfolio_QR.png";
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      img.src = "data:image/svg+xml;base64," + btoa(svgData);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Share Your Portfolio</CardTitle>
        <CardDescription>
          Share your professional portfolio with potential employers or clients.
        </CardDescription>
      </CardHeader>
      {portfolioUrl ? (
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Portfolio Link</Label>
            <div className="flex space-x-2">
              <Input value={portfolioUrl} readOnly />
              <Button size="icon" onClick={handleCopyLink}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button size="icon" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-4">
            <Label>QR Code</Label>
            <div className="flex flex-col items-center space-y-4">
              <div className="w-48 h-48 flex items-center justify-center">
                <QRCodeSVG
                  id="portfolio-qr-code"
                  value={portfolioUrl}
                  size={192}
                />
              </div>
              <Button onClick={handleDownloadQR}>Download QR Code</Button>
            </div>
          </div>
        </CardContent>
      ) : (
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Portfolio Link</Label>
            <div className="flex space-x-2">
              <Input value="No portfolio link available" readOnly />
              <Link href="/dashboard/portfolio/create">
                <Button size="sm">Create now</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
