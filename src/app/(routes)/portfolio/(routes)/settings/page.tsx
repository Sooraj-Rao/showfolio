"use client";

import { useEffect, useState } from "react";
import {
  Check,
  ExternalLink,
  Lock,
  Moon,
  Palette,
  Sun,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useGetUserData from "@/app/hooks/use-getUserData";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";
import { themes } from "@/app/(routes)/p/live/2";
import Loader from "@/app/helper/loader";

const themeColors = {
  emerald: {
    name: "Emerald",
    bg: themes["emerald"].primary,
    border: "border-emerald-500",
    ring: "ring-emerald-500",
    hex: "#10b981",
  },
  rose: {
    name: "Rose",
    bg: themes["rose"].primary,
    border: "border-rose-500",
    ring: "ring-rose-500",
    hex: "#f43f5e",
  },
  violet: {
    name: "Violet",
    bg: themes["violet"].primary,
    border: "border-violet-500",
    ring: "ring-violet-500",
    hex: "#8b5cf6",
  },
  sunset: {
    name: "Sunset",
    bg: themes["sunset"].primary,
    border: "border-orange-400",
    ring: "ring-orange-400",
    hex: "#fb923c",
  },
  ocean: {
    name: "Ocean",
    bg: themes["ocean"].primary,
    border: "border-blue-600",
    ring: "ring-blue-600",
    hex: "#2563eb",
  },
  forest: {
    name: "Forest",
    bg: themes["forest"].primary,
    border: "border-green-700",
    ring: "ring-green-700",
    hex: "#15803d",
  },
  aurora: {
    name: "Aurora",
    bg: themes["aurora"].primary,
    border: "border-lime-400",
    ring: "ring-lime-400",
    hex: "#a3e635",
  },
  cosmic: {
    name: "Cosmic",
    bg: themes["cosmic"].primary,
    border: "border-indigo-800",
    ring: "ring-indigo-800",
    hex: "#3730a3",
  },
  neon: {
    name: "Neon",
    bg: themes["neon"].primary,
    border: "border-yellow-400",
    ring: "ring-yellow-400",
    hex: "#facc15",
  },
  fire: {
    name: "Fire",
    bg: themes["fire"].primary,
    border: "border-red-600",
    ring: "ring-red-600",
    hex: "#dc2626",
  },
};

export default function SettingsPage() {
  const { toast } = useToast();
  const [tab, setTab] = useState("profile");
  const searchParams = useSearchParams();
  const { userData, setUserData } = useGetUserData();
  const [portfolioUrl, setportfolioUrl] = useState(
    userData?.portfolio || userData?.name || ""
  );
  const [isloading, setisloading] = useState(false);
  const [theme, setTheme] = useState(
    userData?.portfolioSettings?.theme || "light"
  );
  const [selectedColor, setSelectedColor] = useState(
    userData?.portfolioSettings?.themeColor || "emerald"
  );
  const [isPublic, setIsPublic] = useState(
    !userData?.private?.portfolio || false
  );
  const [showContacts, setShowContacts] = useState(
    userData?.portfolioSettings?.showContacts ?? true
  );
  const [AnalyticsTrack, setAnalyticsTrack] = useState(
    userData?.portfolioSettings?.analyticsTrack ?? true
  );
  const handleThemeChange = (value: string) => {
    setTheme(value);
  };

  const SavePortfolioUrl = async () => {
    try {
      setisloading(true);
      const res = await axios.patch("/api/portfolio/portfolio-data", {
        portfolio: portfolioUrl,
      });
      if (res.status === 200) {
        toast({
          title: "Success",
          description:
            res.data.message || "Successfully saved for portfolio link",
        });
        setUserData({ ...userData, portfolio: portfolioUrl });
      } else {
        toast({
          title: "Error saving portfolio",
          description: "There was an error saving your portfolio.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving portfolio:", error);
      toast({
        title: "Error saving portfolio",
        description: "There was an error saving your portfolio.",
        variant: "destructive",
      });
    } finally {
      setisloading(false);
    }
  };

  const SaveAppearance = async () => {
    try {
      setisloading(true);
      const res = await axios.patch("/api/portfolio/portfolio-data", {
        appearance: { theme, themeColor: selectedColor },
      });
      if (res.status === 200) {
        toast({
          title: "Success",
          description:
            res.data.message || "Successfully updated portfolio appearance",
        });
        setUserData({
          ...userData,
          portfolioSettings: {
            ...userData.portfolioSettings,
            theme,
            themeColor: selectedColor,
          },
        });
      } else {
        toast({
          title: "Error saving portfolio",
          description: "There was an error saving your portfolio appearance.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error saving portfolio",
        description: "There was an error saving your portfolio appearance.",
        variant: "destructive",
      });
    } finally {
      setisloading(false);
    }
  };

  const SavePrivacySettings = async () => {
    try {
      setisloading(true);
      const res = await axios.patch("/api/portfolio/portfolio-data", {
        privacy: { showContacts, isPublic, analyticsTrack: AnalyticsTrack },
      });
      if (res.status === 200) {
        toast({
          title: "Success",
          description:
            res.data.message || "Successfully updated portfolio privacy",
        });
        setUserData({
          ...userData,
          portfolioSettings: {
            ...userData.portfolioSettings,
            theme,
            themeColor: selectedColor,
          },
        });
      } else {
        toast({
          title: "Error saving portfolio",
          description: "There was an error saving your portfolio privacy.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error saving portfolio",
        description: "There was an error saving your portfolio privacy.",
        variant: "destructive",
      });
    } finally {
      setisloading(false);
    }
  };

  useEffect(() => {
    if (searchParams.get("themeMode") || searchParams.get("theme")) {
      const themeParam = searchParams.get("themeMode");
      if (themeParam === "dark" || themeParam === "light") {
        setTheme(themeParam);
      }

      const colorParam = searchParams.get("theme");
      if (themeColors[colorParam]) {
        setSelectedColor(colorParam);
      }
      setTab("appearance");
    }
    if (
      userData?.portfolioSettings?.theme ||
      userData?.portfolioSettings?.themeColor
    ) {
      setTheme(userData.portfolioSettings.theme || "light");
      setSelectedColor(userData.portfolioSettings.themeColor || "emerald");
    }
  }, [searchParams, userData]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your portfolio settings and preferences
        </p>
      </div>

      <Tabs
        defaultValue="profile"
        className="space-y-4"
        value={tab}
        onValueChange={setTab}
      >
        <TabsList>
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="h-4 w-4 mr-2" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="privacy">
            <Lock className="h-4 w-4 mr-2" />
            Privacy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio URL</CardTitle>
              <CardDescription>Customize your portfolio URL</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">
                  https://portfolio.app/
                </span>
                <Input
                  onChange={(e) => setportfolioUrl(e.target.value)}
                  className={`max-w-[200px] ${
                    (!userData?.portfolio || !userData?.name) &&
                    "bg-muted animate-pulse"
                  } `}
                  defaultValue={userData?.portfolio || userData?.name}
                />
              </div>
            </CardContent>
            <CardFooter>
              {portfolioUrl !== "" && portfolioUrl !== userData?.portfolio && (
                <Button disabled={isloading} onClick={SavePortfolioUrl}>
                  {isloading ? (
                    <>
                      <Loader />
                      Saving..
                    </>
                  ) : (
                    "Save URL"
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme</CardTitle>
              <CardDescription>
                Customize the appearance of your portfolio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <Label>Theme Mode</Label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div
                    className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all ${
                      theme === "light"
                        ? "border-primary bg-primary/5"
                        : "border-muted"
                    }`}
                    onClick={() => handleThemeChange("light")}
                  >
                    <Sun className="h-8 w-8 mb-2" />
                    <span>Light</span>
                  </div>
                  <div
                    className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all ${
                      theme === "dark"
                        ? "border-primary bg-primary/5"
                        : "border-muted"
                    }`}
                    onClick={() => handleThemeChange("dark")}
                  >
                    <Moon className="h-8 w-8 mb-2" />
                    <span>Dark</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-lg font-semibold">Primary Color</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Choose your preferred theme color
                  </p>
                </div>

                <RadioGroup
                  value={selectedColor}
                  onValueChange={setSelectedColor}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-10 gap-3"
                >
                  {Object.entries(themeColors).map(([colorKey, colorData]) => (
                    <div key={colorKey} className="relative">
                      <RadioGroupItem
                        value={colorKey}
                        id={colorKey}
                        className="sr-only"
                      />
                      <Label
                        htmlFor={colorKey}
                        className={`
                  group relative flex flex-col items-center gap-2 p-3 rounded-lg cursor-pointer
                  transition-all duration-200 ease-in-out
                  border-2 hover:shadow-md
                  ${
                    selectedColor === colorKey
                      ? `${colorData.border} bg-background shadow-lg ring-2 ${colorData.ring} ring-opacity-20`
                      : "border-border hover:border-muted-foreground/50"
                  }
                `}
                      >
                        <div className="relative">
                          <div
                            className={`
                      w-12 h-12 rounded-full ${colorData.bg} 
                      transition-transform duration-200 ease-in-out
                      group-hover:scale-110
                      ${selectedColor === colorKey ? "scale-110" : ""}
                    `}
                          />
                          {selectedColor === colorKey && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Check className="w-5 h-5 text-white drop-shadow-sm" />
                            </div>
                          )}
                        </div>

                        {/* Color Name */}
                        <span
                          className={`
                  text-sm font-medium transition-colors duration-200
                  ${
                    selectedColor === colorKey
                      ? "text-foreground"
                      : "text-muted-foreground group-hover:text-foreground"
                  }
                `}
                        >
                          {colorData.name}
                        </span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                {/* Selected Color Preview */}
                <div className="mt-6 p-4 rounded-lg border bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full ${
                        themeColors[selectedColor as keyof typeof themeColors]
                          .bg
                      }`}
                    />
                    <div>
                      <p className="font-medium">
                        Selected theme:{" "}
                        {
                          themeColors[selectedColor as keyof typeof themeColors]
                            .name
                        }
                      </p>

                      <p className="font-medium">
                        Selected theme Mode :
                        {theme.charAt(0).toUpperCase() + theme.slice(1)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              {(theme !== userData?.portfolioSettings?.theme ||
                selectedColor !== userData?.portfolioSettings?.themeColor) && (
                <Button disabled={isloading} onClick={SaveAppearance}>
                  {isloading ? (
                    <>
                      <Loader />
                      Saving..
                    </>
                  ) : (
                    "Save Appearance"
                  )}
                </Button>
              )}
            </CardFooter>
            <div className="px-6 flex items-center mb-3">
              <p className="mr-2 text-sm">
                You can preview and test the theme in real time on your
                portfolio.
              </p>
              <a
                href={`/p/preview/?username=${
                  userData?.portfolio || userData?.name
                }`}
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                <Button variant="secondary">
                  Test & Preview
                  <ExternalLink size={16} />
                </Button>
              </a>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control who can see your portfolio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="public-portfolio">Public Portfolio</Label>
                  <p className="text-sm text-muted-foreground">
                    Make your portfolio visible to everyone
                  </p>
                </div>
                <Switch
                  id="public-portfolio"
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="show-contact">Show Contact Information</Label>
                  <p className="text-sm text-muted-foreground">
                    Display your contact information on your portfolio
                  </p>
                </div>
                <Switch
                  id="show-contact"
                  checked={showContacts}
                  onCheckedChange={setShowContacts}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="show-analytics">Analytics Tracking</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow tracking of visitor analytics on your portfolio
                  </p>
                </div>
                <Switch
                  id="show-analytics"
                  checked={AnalyticsTrack}
                  onCheckedChange={setAnalyticsTrack}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={SavePrivacySettings}>
                Save Privacy Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
