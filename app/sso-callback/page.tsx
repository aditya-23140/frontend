"use client";
import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallback() {
  /*
    This component handles the entire OAuth redirect flow.
    It will automatically complete the sign-in or sign-up,
    and then redirect the user to the 'redirectUrlComplete'
    you specified in the handleGoogleSignIn function (e.g., "/dashboard").
  */
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Loading...</p>
      <div id="clerk-captcha" className="mb-3"></div>
      <AuthenticateWithRedirectCallback redirectUrl={"/profile"} />
    </div>
  );
}
