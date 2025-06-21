"use client";

import { useState } from "react";
import { Bell, Lock, Moon, Palette, Save, Sun, User } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useGetUserData from "@/app/hooks/use-getUserData";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const [theme, setTheme] = useState("light");
  const { toast } = useToast();
  const { userData, setUserData } = useGetUserData();
  const [portfolioUrl, setportfolioUrl] = useState(
    userData?.portfolio || userData?.name || ""
  );
  const [isPublic, setIsPublic] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [browserNotifications, setBrowserNotifications] = useState(false);
  const handleThemeChange = (value: string) => {
    setTheme(value);
    // In a real app, you would apply the theme here
    if (value === "dark") {
      document.documentElement.classList.add("dark");
    } else if (value === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      // System theme would be handled with media queries
    }
  };

  const SavePortfolioUrl = async () => {
    try {
      const res = await axios.patch("/api/portfolio/portfolio-data", {
        portfolio: portfolioUrl,
      });
      if (res.status === 200) {
        toast({
          title: "Success",
          description: "Template selection was Successfull",
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
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your portfolio settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
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
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
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
                  className="max-w-[200px]"
                  defaultValue={userData?.portfolio || userData?.name}
                />
              </div>
            </CardContent>
            <CardFooter>
              {portfolioUrl !== "" && portfolioUrl !== userData?.portfolio && (
                <Button onClick={SavePortfolioUrl}>Save URL</Button>
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
                  <div
                    className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all ${
                      theme === "system"
                        ? "border-primary bg-primary/5"
                        : "border-muted"
                    }`}
                    onClick={() => handleThemeChange("system")}
                  >
                    <div className="flex h-8 w-8 mb-2">
                      <Sun className="h-8 w-8 -mr-2" />
                      <Moon className="h-8 w-8" />
                    </div>
                    <span>System</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Primary Color</Label>
                <RadioGroup
                  defaultValue="blue"
                  className="flex flex-wrap gap-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="blue"
                      id="blue"
                      className="bg-blue-500 border-blue-500"
                    />
                    <Label htmlFor="blue">Blue</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="green"
                      id="green"
                      className="bg-green-500 border-green-500"
                    />
                    <Label htmlFor="green">Green</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="purple"
                      id="purple"
                      className="bg-purple-500 border-purple-500"
                    />
                    <Label htmlFor="purple">Purple</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="orange"
                      id="orange"
                      className="bg-orange-500 border-orange-500"
                    />
                    <Label htmlFor="orange">Orange</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="red"
                      id="red"
                      className="bg-red-500 border-red-500"
                    />
                    <Label htmlFor="red">Red</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Font Size</Label>
                <Select defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue placeholder="Select font size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Appearance</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Layout</CardTitle>
              <CardDescription>
                Customize the layout of your portfolio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Layout Style</Label>
                <RadioGroup
                  defaultValue="modern"
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <div className="border rounded-lg p-4 cursor-pointer [&:has([data-state=checked])]:border-primary">
                    <RadioGroupItem
                      value="modern"
                      id="modern"
                      className="sr-only"
                    />
                    <Label
                      htmlFor="modern"
                      className="flex flex-col items-center gap-2 cursor-pointer"
                    >
                      <div className="w-full h-20 bg-muted rounded-md flex flex-col items-center justify-center">
                        <div className="w-3/4 h-2 bg-primary/40 rounded-full mb-2"></div>
                        <div className="w-1/2 h-2 bg-primary/40 rounded-full"></div>
                      </div>
                      <span>Modern</span>
                    </Label>
                  </div>
                  <div className="border rounded-lg p-4 cursor-pointer [&:has([data-state=checked])]:border-primary">
                    <RadioGroupItem
                      value="classic"
                      id="classic"
                      className="sr-only"
                    />
                    <Label
                      htmlFor="classic"
                      className="flex flex-col items-center gap-2 cursor-pointer"
                    >
                      <div className="w-full h-20 bg-muted rounded-md flex flex-col items-center justify-center">
                        <div className="w-3/4 h-2 bg-primary/40 rounded-full mb-2"></div>
                        <div className="w-3/4 h-2 bg-primary/40 rounded-full mb-2"></div>
                        <div className="w-3/4 h-2 bg-primary/40 rounded-full"></div>
                      </div>
                      <span>Classic</span>
                    </Label>
                  </div>
                  <div className="border rounded-lg p-4 cursor-pointer [&:has([data-state=checked])]:border-primary">
                    <RadioGroupItem
                      value="minimal"
                      id="minimal"
                      className="sr-only"
                    />
                    <Label
                      htmlFor="minimal"
                      className="flex flex-col items-center gap-2 cursor-pointer"
                    >
                      <div className="w-full h-20 bg-muted rounded-md flex flex-col items-center justify-center">
                        <div className="w-1/2 h-2 bg-primary/40 rounded-full mb-2"></div>
                        <div className="w-1/3 h-2 bg-primary/40 rounded-full"></div>
                      </div>
                      <span>Minimal</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Layout</Button>
            </CardFooter>
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
                  <Label htmlFor="search-engines">Search Engine Indexing</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow search engines to index your portfolio
                  </p>
                </div>
                <Switch id="search-engines" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="show-contact">Show Contact Information</Label>
                  <p className="text-sm text-muted-foreground">
                    Display your contact information on your portfolio
                  </p>
                </div>
                <Switch id="show-contact" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="show-analytics">Analytics Tracking</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow tracking of visitor analytics on your portfolio
                  </p>
                </div>
                <Switch id="show-analytics" defaultChecked />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Privacy Settings</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Access Control</CardTitle>
              <CardDescription>
                Control who can access your portfolio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isPublic && (
                <div className="space-y-2">
                  <Label htmlFor="password">Portfolio Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Set a password for your portfolio"
                  />
                  <p className="text-sm text-muted-foreground">
                    Visitors will need this password to view your portfolio
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label>Access Level</Label>
                <RadioGroup defaultValue="public" disabled={isPublic}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="public" id="public" />
                    <Label htmlFor="public">Public</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="password" id="password" />
                    <Label htmlFor="password">Password Protected</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="invite" id="invite" />
                    <Label htmlFor="invite">Invite Only</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter>
              <Button disabled={isPublic}>Save Access Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Control how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">
                    Email Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="browser-notifications">
                    Browser Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications in your browser
                  </p>
                </div>
                <Switch
                  id="browser-notifications"
                  checked={browserNotifications}
                  onCheckedChange={setBrowserNotifications}
                />
              </div>

              <div className="space-y-2">
                <Label>Notification Types</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-views" className="cursor-pointer">
                      Portfolio Views
                    </Label>
                    <Switch
                      id="notify-views"
                      defaultChecked
                      disabled={!emailNotifications && !browserNotifications}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-likes" className="cursor-pointer">
                      Likes and Reactions
                    </Label>
                    <Switch
                      id="notify-likes"
                      defaultChecked
                      disabled={!emailNotifications && !browserNotifications}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-comments" className="cursor-pointer">
                      Comments
                    </Label>
                    <Switch
                      id="notify-comments"
                      defaultChecked
                      disabled={!emailNotifications && !browserNotifications}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-messages" className="cursor-pointer">
                      Direct Messages
                    </Label>
                    <Switch
                      id="notify-messages"
                      defaultChecked
                      disabled={!emailNotifications && !browserNotifications}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Notification Frequency</Label>
                <RadioGroup
                  defaultValue="realtime"
                  disabled={!emailNotifications && !browserNotifications}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="realtime" id="realtime" />
                    <Label htmlFor="realtime">Real-time</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="daily" id="daily" />
                    <Label htmlFor="daily">Daily Digest</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="weekly" id="weekly" />
                    <Label htmlFor="weekly">Weekly Digest</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Notification Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
