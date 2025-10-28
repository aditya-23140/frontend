"use client";

import { useUser } from "@clerk/nextjs";
// REMOVED: import { UserProfile } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { LogoutButton } from "@/components/LogoutButton";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useRef, ChangeEvent } from "react";

// --- Zod Schemas for the new forms ---
const updateNameSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
});

const updateUsernameSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters." }),
});

const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: "Current password is required." }),
    newPassword: z
      .string()
      .min(8, { message: "New password must be at least 8 characters." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords don't match",
    path: ["confirmPassword"], // path of error
  });

// --- Custom Form Components ---

// Component for Updating Name
function UpdateNameForm() {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const form = useForm<z.infer<typeof updateNameSchema>>({
    resolver: zodResolver(updateNameSchema),
    defaultValues: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof updateNameSchema>) {
    if (!user) return;
    setIsLoading(true);
    setMessage(null);
    try {
      await user.update({
        firstName: values.firstName,
        lastName: values.lastName,
      });
      setMessage({ type: "success", text: "Name updated successfully!" });
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.errors?.[0]?.message || "Failed to update name.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Update Name</CardTitle>
        <CardDescription>Change your first and last name.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your first name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="cursor-pointer"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
            {message && (
              <p
                className={`text-sm ${
                  message.type === "success"
                    ? "text-green-600"
                    : "text-destructive"
                }`}
              >
                {message.text}
              </p>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function UpdateUsernameForm() {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const form = useForm<z.infer<typeof updateUsernameSchema>>({
    resolver: zodResolver(updateUsernameSchema),
    defaultValues: {
      username: user?.username ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof updateUsernameSchema>) {
    if (!user) return;
    setIsLoading(true);
    setMessage(null);
    try {
      await user.update({
        username: values.username,
      });
      setMessage({ type: "success", text: "Username updated successfully!" });
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.errors?.[0]?.message || "Failed to update username.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const isUsernameFeatureAvailable = !!user;

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Update Username</CardTitle>
        <CardDescription>Change your public username.</CardDescription>
      </CardHeader>
      <CardContent>
        {isUsernameFeatureAvailable ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Your username" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="cursor-pointer"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Username"}
              </Button>
              {message && (
                <p
                  className={`text-sm ${
                    message.type === "success"
                      ? "text-green-600"
                      : "text-destructive"
                  }`}
                >
                  {message.text}
                </p>
              )}
            </form>
          </Form>
        ) : (
          <p className="text-sm text-muted-foreground">
            Username management is not enabled for your account.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// --- NEW Component for Changing Profile Image ---
const UpdateProfileImageForm = () => {
  const { user } = useUser();
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    setMessage(null);

    try {
      await user.setProfileImage({ file });
      setMessage({ type: "success", text: "Profile image updated!" });
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.errors?.[0]?.message || "Failed to upload image.",
      });
    } finally {
      setIsUploading(false);
      // Reset file input value so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Function to trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Profile Picture</CardTitle>
        <CardDescription>Upload a new profile picture.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-start space-y-4">
        {/* Hidden file input */}
        <Input
          type="file"
          accept="image/*" // Accept only image files
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden" // Hide the default input
          disabled={isUploading}
        />
        {/* Button to trigger the file input */}
        <Button
          className="cursor-pointer"
          onClick={triggerFileInput}
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload New Image"}
        </Button>

        {/* Display success/error message */}
        {message && (
          <p
            className={`text-sm ${
              message.type === "success" ? "text-green-600" : "text-destructive"
            }`}
          >
            {message.text}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

// Component for Changing Password
function ChangePasswordForm() {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof changePasswordSchema>) {
    if (!user) return;
    setIsLoading(true);
    setMessage(null);
    try {
      await user.updatePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      setMessage({ type: "success", text: "Password updated successfully!" });
      form.reset(); // Clear form on success
    } catch (err: any) {
      setMessage({
        type: "error",
        text:
          err.errors?.[0]?.message ||
          "Failed to update password. Check your current password.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Check if password access is available (e.g., user signed up with password)
  const hasPassword = user?.passwordEnabled;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>Update your account password.</CardDescription>
      </CardHeader>
      <CardContent>
        {hasPassword ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="cursor-pointer"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update Password"}
              </Button>
              {message && (
                <p
                  className={`text-sm ${
                    message.type === "success"
                      ? "text-green-600"
                      : "text-destructive"
                  }`}
                >
                  {message.text}
                </p>
              )}
            </form>
          </Form>
        ) : (
          <p className="text-sm text-muted-foreground">
            You signed up using a social provider or passwordless method, so you
            don&apos;t have a password to change.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// --- Main Profile Page Component ---
export default function ProfilePage() {
  const { isLoaded, isSignedIn, user } = useUser();

  // Show loading skeletons while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="container mx-auto max-w-4xl py-12 px-4">
        <Skeleton className="h-10 w-48 mb-6" />
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-60" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-24" />
          </CardContent>
        </Card>
        {/* Skeletons for the custom forms */}
        <Skeleton className="h-[250px] w-full mb-8" />
        <Skeleton className="h-[350px] w-full" />
      </div>
    );
  }

  // Handle case where user is not signed in (though middleware should prevent this)
  if (!isSignedIn) {
    return (
      <div className="container mx-auto max-w-4xl py-12 px-4 text-center">
        <p>You must be signed in to view this page.</p>
      </div>
    );
  }

  // --- Main Profile Page Content ---
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

      {/* User Information Card */}
      <Card className="mb-8 relative">
        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user?.imageUrl} alt={user?.fullName ?? "User"} />
            <AvatarFallback>
              {user?.firstName?.charAt(0)}
              {user?.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl">
              {user?.fullName ??
                user?.username ??
                user?.primaryEmailAddress?.emailAddress.split("@")[0] ??
                "User"}
            </CardTitle>
            <CardDescription className="text-sm">
              {user?.primaryEmailAddress?.emailAddress}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="w-full">
          <div className="absolute right-10 top-10">
            <LogoutButton />
          </div>
        </CardContent>
      </Card>

      {/* Custom Account Management Forms */}
      <h2 className="text-2xl font-semibold mb-4">Manage Account</h2>
      <UpdateNameForm />
      <UpdateUsernameForm />
      <UpdateProfileImageForm />
      <ChangePasswordForm />

      {/* REMOVED: Clerk's UserProfile Component 
        <UserProfile routing="hash" /> 
      */}

      {/* TODO: Add more custom forms here as needed (e.g., email management, 2FA) */}
    </div>
  );
}
