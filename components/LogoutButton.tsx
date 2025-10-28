"use client";

// This component provides the sign-out functionality
import { SignOutButton } from "@clerk/nextjs";
// This hook allows us to redirect the user
// import { useRouter } from 'next/navigation'; // No longer needed
// This is your styled button component
import { Button } from "@/components/ui/button";
// (Optional) A nice icon for the button
import { LogOut } from "lucide-react";

/**
 * A simple logout button that signs the user out
 * and redirects them to the homepage.
 */
export function LogoutButton() {
  // const router = useRouter(); // No longer needed

  // const handleSignOut = () => { // This logic is replaced by redirectUrl
  //   // After sign-out, redirect the user to your login page or homepage
  //   router.push('/');
  // };

  return (
    // The SignOutButton component from Clerk handles all the logic.
    // We use `redirectUrl` to specify where to send the user after sign-out.
    // This fixes the error as `signOutCallback` is not a valid prop here.
    <SignOutButton redirectUrl="/">
      <Button variant="outline" className="text-red-400 hover:cursor-pointer">
        <LogOut className="mr-2 h-4 w-4" />
        Log Out
      </Button>
    </SignOutButton>
  );
}
