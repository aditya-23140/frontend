"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

function GoogleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width="24px"
      height="24px"
      className="mr-2"
    >
      <path
        fill="#FFC107"
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
      />
      <path
        fill="#FF3D00"
        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
      />
      <path
        fill="#1976D2"
        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.088,5.571l6.19,5.238C39.712,35.434,44,29.861,44,24C44,22.659,43.862,21.35,43.611,20.083z"
      />
    </svg>
  );
}

export default function ProfileForm() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  // 3. Component State
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  // Removed 'emailSent' state, as we are now using passwords
  const [error, setError] = useState<string | null>(null);

  // 4. React Hook Form setup
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "", // Added password default
    },
  });

  // 5. Handle Email + Password Submit
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isLoaded) return;

    setIsLoading(true);
    setError(null);

    try {
      // Start the sign-in process with email and password
      const signInAttempt = await signIn.create({
        identifier: values.email,
        password: values.password, // Send the password
      });

      // If sign in is successful, set the active session
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        // Redirect to the dashboard or main app page
        // UPDATE THIS to your main app page
        router.push("/profile");
      } else {
        // Handle other statuses if needed (e.g., 2FA)
        console.error(JSON.stringify(signInAttempt, null, 2));
        setError("An unexpected error occurred during sign in.");
      }
    } catch (err: any) {
      // Catch Clerk errors (e.g., "Invalid password")
      setError(err.errors?.[0]?.message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  // 6. Handle Google OAuth Submit
  async function onGoogleSignIn() {
    if (!isLoaded) return;

    setIsGoogleLoading(true);
    setError(null);

    try {
      // This will redirect the user to Google
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        // This is the URL the user will be redirected to
        // after a successful Google login.
        // UPDATE THIS to your main app page (e.g., '/dashboard')
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/profile",
      });
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "An unknown error occurred.");
      setIsGoogleLoading(false);
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">loading</div>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-35">
      <CardHeader>
        <CardTitle className="text-2xl">Welcome Back!</CardTitle>
        <CardDescription>
          Sign in with Google or enter your email and password.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {/* Google OAuth Button */}
        <Button
          variant="outline"
          type="button"
          disabled={isGoogleLoading}
          onClick={onGoogleSignIn}
          className="hover:cursor-pointer"
        >
          <GoogleIcon />
          Sign in with Google
        </Button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        {/* Email + Password Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full hover:cursor-pointer"
              disabled={isLoading}
            >
              {isLoading}
              Sign In
            </Button>
          </form>
        </Form>

        {/* Display Errors */}
        {error && (
          <p className="text-sm font-medium text-destructive text-center">
            {error}
          </p>
        )}
        <div className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="text-primary hover:underline">
            Sign Up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
