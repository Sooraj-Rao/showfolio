"use client";

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

export default function SettingsPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { loadingUserData, userData, error, setUserData } = useGetUserData();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isPrivateProfile, setIsPrivateProfile] = useState(false);
  const [isPrivatePortfolio, setIsPrivatePortfolio] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (userData) {
      setName(userData?.name || "");
      setEmail(userData?.email || "");
      setIsPrivateProfile(userData?.private?.profile || false);
      setIsPrivatePortfolio(userData?.private?.portfolio || false);
    }
  }, [userData]);

  const isNewChanges =
    userData?.name !== name ||
    userData?.email !== email ||
    userData?.private?.profile !== isPrivateProfile ||
    userData?.private?.portfolio !== isPrivatePortfolio;

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const response = await axios.put("/api/user", {
        name,
        email,
        profile: isPrivateProfile,
        portfolio: isPrivatePortfolio,
      });

      if (!response.data) {
        throw new Error("Failed to update settings");
      }

      setUserData({
        email,
        name,
        private: { portfolio: isPrivatePortfolio, profile: isPrivateProfile },
      });
      toast({
        title: "Settings Updated",
        description: "Your settings have been successfully updated.",
      });
    } catch (error) {
      console.log(error);
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
    setIsDeleting(true);
    try {
      const response = await axios.put("/api/user?operation=disableAcc");

      if (response.statusText !== "OK") {
        throw new Error("Failed to disable account");
      }

      toast({
        title: "Account Disable",
        description: "Your account has been successfully disabled.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to disable account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (loadingUserData) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <form onSubmit={handleSaveChanges}>
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal information.</CardDescription>
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
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Account Privacy</CardTitle>
            <CardDescription>
              Control your account&apos;s privacy settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="privateAccount">Private Account</Label>
                <p className="text-sm text-muted-foreground">
                  Make your profile private by default
                </p>
              </div>
              <Switch
                id="privateAccount"
                checked={isPrivateProfile}
                onCheckedChange={setIsPrivateProfile}
              />
            </div>
            <div className="flex   items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="privatePortfolio">Private Portfolio</Label>
                <p className="text-sm text-muted-foreground">
                  Make your Portfolio private
                </p>
              </div>
              <Switch
                id="privatePortfolio"
                checked={isPrivatePortfolio}
                onCheckedChange={setIsPrivatePortfolio}
              />
            </div>
          </CardContent>
        </Card>
        {isNewChanges && (
          <Button className={` mt-6`} type="submit" disabled={isUpdating}>
            {isUpdating ? "Saving..." : "Save Changes"}
          </Button>
        )}
      </form>

      <Card>
        <CardHeader>
          <CardTitle>Account Management</CardTitle>
          <CardDescription>Manage your account status.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Disable Account</h3>
            <p className="text-sm text-muted-foreground">
              Temporarily disable your account. You can reactivate it anytime.
            </p>
            <Button onClick={handleDisableAccount} variant="outline">
              Disable Account
            </Button>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Delete Account</h3>
            <p className="text-sm text-muted-foreground">
              Permanently delete your account and all associated data. This
              action cannot be undone.
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Account</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Yes, delete my account"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
