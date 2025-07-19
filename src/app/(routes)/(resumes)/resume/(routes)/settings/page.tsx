"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import useGetUserData from "@/app/hooks/use-getUserData";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import axios from "axios";

interface ConfirmationDialogProps {
  title: string;
  description: string;
  confirmText: string;
  onConfirm: () => void;
  isLoading: boolean;
  children: React.ReactNode;
  variant?: "default" | "destructive";
}

function ConfirmationDialog({
  title,
  description,
  confirmText,
  onConfirm,
  isLoading,
  children,
  variant = "default",
}: ConfirmationDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className={
              variant === "destructive" ? "bg-red-600 hover:bg-red-700" : ""
            }
          >
            {isLoading ? "Processing..." : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function SettingsPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { loadingUserData, userData, error, setUserData } = useGetUserData();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isPrivateProfile, setIsPrivateProfile] = useState(false);
  const [isPrivateResumes, setisPrivateResumes] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDisabling, setIsDisabling] = useState(false);
  const [isUpdatingPrivacy, setIsUpdatingPrivacy] = useState("");
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showPortfolioDialog, setShowPortfolioDialog] = useState(false);
  const [tempPrivateProfile, setTempPrivateProfile] = useState(false);
  const [tempPrivatePortfolio, setTempPrivatePortfolio] = useState(false);

  useEffect(() => {
    if (userData) {
      setName(userData?.name || "");
      setEmail(userData?.email || "");
      setIsPrivateProfile(userData?.private?.profile || false);
      setisPrivateResumes(userData?.private?.resumes || false);
    }
  }, [userData]);

  const isNewChanges =
    userData?.name !== name ||
    userData?.email !== email ||
    userData?.private?.profile !== isPrivateProfile ||
    userData?.private?.resumes !== isPrivateResumes;

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const response = await axios.put("/api/user", {
        name,
        email,
        profile: isPrivateProfile,
        resumes: isPrivateResumes,
      });

      if (!response.data) {
        throw new Error("Failed to update settings");
      }

      setUserData({
        ...userData,
        email,
        name,
        private: { resumes: isPrivateResumes, profile: isPrivateProfile },
      });
      toast({
        title: "Settings Updated",
        description: "Your settings have been successfully updated.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const response = await axios.delete("/api/user");

      if (response.statusText !== "OK") {
        throw new Error("Failed to delete account");
      }

      toast({
        title: "Account Deleted",
        description: "Your account has been successfully deleted.",
      });
      router.push("/");
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDisableAccount = async () => {
    setIsDisabling(true);
    try {
      const response = await axios.put("/api/user?operation=disableAcc");

      if (response.status !== 200) {
        throw new Error("Failed to disable account");
      }

      setUserData({
        ...userData,
        isActive: false,
      });

      toast({
        title: "Account Disabled",
        description: "Your account has been successfully disabled.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to disable account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDisabling(false);
    }
  };

  const handleEnableAccount = async () => {
    setIsDisabling(true);
    try {
      const response = await axios.put("/api/user?operation=enableAcc");

      if (response.status !== 200) {
        throw new Error("Failed to enable account");
      }

      setUserData({
        ...userData,
        isActive: true,
      });

      toast({
        title: "Account Enabled",
        description: "Your account has been successfully enabled.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to enable account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDisabling(false);
    }
  };

  const handlePrivateProfileToggle = async (checked: boolean) => {
    if (checked === isPrivateProfile) {
      setShowProfileDialog(false);
      return;
    }

    setIsUpdatingPrivacy("profile");
    try {
      const response = await axios.put("/api/user", {
        name,
        email,
        profile: checked,
        portfolio: isPrivateResumes,
      });

      if (!response.data) {
        throw new Error("Failed to update privacy settings");
      }

      setIsPrivateProfile(checked);
      setUserData({
        ...userData,
        private: { ...userData.private, profile: checked },
      });

      toast({
        title: "Privacy Updated",
        description: `Profile is now ${checked ? "private" : "public"}.`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update privacy settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingPrivacy("");
      setShowProfileDialog(false);
    }
  };

  const handlePrivateResumeToggle = async (checked: boolean) => {
    if (checked === isPrivateResumes) {
      setShowPortfolioDialog(false);
      return;
    }

    setIsUpdatingPrivacy("resume");
    try {
      const response = await axios.put("/api/user", {
        name,
        email,
        profile: isPrivateProfile,
        resumes: checked,
      });

      if (!response.data) {
        throw new Error("Failed to update privacy settings");
      }

      setisPrivateResumes(checked);
      setUserData({
        ...userData,
        private: { ...userData.private, resumes: checked },
      });

      toast({
        title: "Privacy Updated",
        description: `Resumes are now ${checked ? "private" : "public"}.`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update privacy settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingPrivacy("");
      setShowPortfolioDialog(false);
    }
  };

  if (loadingUserData) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
      </div>
      <form onSubmit={handleSaveChanges}>
        <div className=" grid sm:grid-cols-2 grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  disabled
                  readOnly
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  // onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Privacy</CardTitle>
              <CardDescription>
                Control your account&apos;s privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="privateAccount">Private Profile</Label>
                  <p className="text-sm text-muted-foreground">
                    Make your profile access private
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {isUpdatingPrivacy == "profile" && (
                    <span className="text-sm text-muted-foreground">
                      Updating...
                    </span>
                  )}
                  <Switch
                    id="privateAccount"
                    checked={isPrivateProfile}
                    disabled={isUpdatingPrivacy !== ""}
                    onCheckedChange={(checked) => {
                      if (!isUpdatingPrivacy) {
                        setTempPrivateProfile(checked);
                        setShowProfileDialog(true);
                      }
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="privatePortfolio">Private Resumes</Label>
                  <p className="text-sm text-muted-foreground">
                    Make all your resumes private
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {isUpdatingPrivacy == "resume" && (
                    <span className="text-sm text-muted-foreground">
                      Updating...
                    </span>
                  )}
                  <Switch
                    id="privatePortfolio"
                    checked={isPrivateResumes}
                    disabled={isUpdatingPrivacy !== ""}
                    onCheckedChange={(checked) => {
                      if (!isUpdatingPrivacy) {
                        setTempPrivatePortfolio(checked);
                        setShowPortfolioDialog(true);
                      }
                    }}
                  />
                </div>
              </div>
            </CardContent>

            <AlertDialog
              open={showProfileDialog}
              onOpenChange={setShowProfileDialog}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Make Profile {tempPrivateProfile ? "Private" : "Public"}?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to make your profile{" "}
                    {tempPrivateProfile ? "private" : "public"}? This will{" "}
                    {tempPrivateProfile ? "restrict" : "allow"} access to your
                    profile information.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isUpdatingPrivacy !== ""}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() =>
                      handlePrivateProfileToggle(tempPrivateProfile)
                    }
                    disabled={isUpdatingPrivacy !== ""}
                  >
                    {isUpdatingPrivacy
                      ? "Processing..."
                      : `Make ${tempPrivateProfile ? "Private" : "Public"}`}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog
              open={showPortfolioDialog}
              onOpenChange={setShowPortfolioDialog}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Make Resumes {tempPrivatePortfolio ? "Private" : "Public"}?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to make your resumes{" "}
                    {tempPrivatePortfolio ? "private" : "public"}? This will{" "}
                    {tempPrivatePortfolio ? "restrict" : "allow"} access to all
                    your resumes.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isUpdatingPrivacy !== ""}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() =>
                      handlePrivateResumeToggle(tempPrivatePortfolio)
                    }
                    disabled={isUpdatingPrivacy !== ""}
                  >
                    {isUpdatingPrivacy
                      ? "Processing..."
                      : `Make ${tempPrivatePortfolio ? "Private" : "Public"}`}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </Card>
        </div>
        {isNewChanges && (
          <div className=" w-full  flex justify-end mt-6">
            <Button className=" w-fit  " type="submit" disabled={isUpdating}>
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </form>

      <Card>
        <CardHeader>
          <CardTitle>Account Management</CardTitle>
          <CardDescription>Manage your account status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 flex flex-col sm:flex-row justify-between">
            <div>
              <h3 className="font-semibold">
                {userData?.isActive ? "Disable Account" : "Enable Account"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {userData?.isActive
                  ? "Temporarily disable your account. You can reactivate it anytime."
                  : "Reactivate your disabled account to regain full access."}
              </p>
            </div>
            {userData?.isActive ? (
              <ConfirmationDialog
                title="Disable Account?"
                description="Are you sure you want to disable your account? You won't be able to access your account until you enable it again. This action is reversible."
                confirmText="Disable Account"
                onConfirm={handleDisableAccount}
                isLoading={isDisabling}
                variant="destructive"
              >
                <Button variant="secondary" disabled={isDisabling}>
                  {isDisabling ? "Disabling..." : "Disable Account"}
                </Button>
              </ConfirmationDialog>
            ) : (
              <Button
                onClick={handleEnableAccount}
                variant="outline"
                disabled={isDisabling}
              >
                {isDisabling ? "Enabling..." : "Enable Account"}
              </Button>
            )}
          </div>

          <div className="space-y-2 flex justify-between flex-col sm:flex-row ">
            <div>
              <h3 className="font-semibold">Delete Account</h3>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data. This
                action cannot be undone.
              </p>
            </div>
            <ConfirmationDialog
              title="Delete Account Permanently?"
              description="This action cannot be undone. This will permanently delete your account and remove all your data from our servers including resumes, profile information, and settings."
              confirmText="Yes, delete my account"
              onConfirm={handleDeleteAccount}
              isLoading={isDeleting}
              variant="destructive"
            >
              <Button
                variant="destructive"
                className="bg-red-800 hover:bg-red-900"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Account"}
              </Button>
            </ConfirmationDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
