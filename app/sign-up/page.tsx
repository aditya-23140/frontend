"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
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

// ✅ Validation Schema (includes confirm password)
const formSchema = z
  .object({
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
      })
      .regex(/[0-9]/, {
        message: "Password must contain at least one number.",
      })
      .regex(/[^A-Za-z0-9]/, {
        message: "Password must contain at least one special character.",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
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
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8 c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12 c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657 C34.046,6.053,29.268,4,24,4 C12.955,4,4,12.955,4,24 c0,11.045,8.955,20,20,20 c11.045,0,20-8.955,20-20 C44,22.659,43.862,21.35,43.611,20.083z"
      />
      <path
        fill="#FF3D00"
        d="M6.306,14.691l6.571,4.819 C14.655,15.108,18.961,12,24,12 c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657 C34.046,6.053,29.268,4,24,4 C16.318,4,9.656,8.337,6.306,14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24,44 c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238 C29.211,35.091,26.715,36,24,36 c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025 C9.505,39.556,16.227,44,24,44z"
      />
      <path
        fill="#1976D2"
        d="M43.611,20.083H42V20H24v8h11.303 c-0.792,2.237-2.231,4.166-4.088,5.571l6.19,5.238 C39.712,35.434,44,29.861,44,24 C44,22.659,43.862,21.35,43.611,20.083z"
      />
    </svg>
  );
}

export default function SignUpForm() {
  const { isLoaded, signUp } = useSignUp();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingVerification, setPendingVerification] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isLoaded) return;
    setIsLoading(true);
    setError(null);
    try {
      await signUp.create({
        emailAddress: values.email,
        password: values.password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setPendingVerification(true);
    } catch (err: any) {
      console.log(err);
      setError(err.errors?.[0]?.message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  async function onGoogleSignUp() {
    if (!isLoaded) return;
    setIsGoogleLoading(true);
    setError(null);
    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
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
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (pendingVerification) {
    return (
      <Card className="w-full max-w-md mx-auto mt-35">
        <CardHeader>
          <CardTitle className="text-2xl">Check Your Email</CardTitle>
          <CardDescription>
            We&apos;ve sent a verification link to your email. Please check your
            inbox to complete sign up.
          </CardDescription>
          <CardContent>
            <Link
              href="/sign-up/verify"
              className="text-primary hover:underline font-medium"
            >
              Verify
            </Link>
          </CardContent>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-35">
      <CardHeader>
        <CardTitle className="text-2xl">Create Your Account</CardTitle>
        <CardDescription>
          Sign up with Google or use your email and password.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <Button
          variant="outline"
          type="button"
          disabled={isGoogleLoading}
          onClick={onGoogleSignUp}
        >
          {isGoogleLoading ? (
            "Signing up..."
          ) : (
            <>
              <GoogleIcon /> Sign up with Google
            </>
          )}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Clerk CAPTCHA placeholder */}
            <div id="clerk-captcha" className="mb-3" />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing up..." : "Sign Up"}
            </Button>
          </form>
        </Form>

        {error && (
          <p className="text-sm font-medium text-destructive text-center">
            {error}
          </p>
        )}

        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-primary hover:underline">
            Sign In
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
