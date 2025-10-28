"use client";
import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function VerifyEmailPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setIsVerifying(true);
    setError(null);

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        setSuccess(true);

        // Redirect after short delay
        setTimeout(() => {
          router.push("/profile"); // or your dashboard page
        }, 2000);
      } else {
        setError("Invalid or expired code. Please try again.");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "An unknown error occurred.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Verify Your Email
          </CardTitle>
        </CardHeader>
        <CardContent>
          {success ? (
            <p className="text-green-600 text-center">
              Verification successful! Redirecting you now...
            </p>
          ) : (
            <form onSubmit={handleVerify} className="flex flex-col gap-4">
              <p className="text-sm text-center text-muted-foreground">
                Enter the 6-digit code sent to your email.
              </p>
              <Input
                placeholder="Enter verification code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                className="text-center text-lg tracking-widest"
              />
              {error && (
                <p className="text-destructive text-center text-sm">{error}</p>
              )}
              <Button
                type="submit"
                className="w-full hover:cursor-pointer"
                disabled={isVerifying || code.length !== 6}
              >
                {isVerifying ? "Verifying..." : "Verify Email"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
