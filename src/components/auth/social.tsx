"use client";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { DEFAULT_LOGIN_DIRECT } from "@/routes";
import { signIn } from "next-auth/react";

export const Social = () => {
  const onClick = (provider: "google" | "facebook") => {
    signIn(provider, {
      callbackUrl: DEFAULT_LOGIN_DIRECT,
    });
  };

  return (
    <div className="flex flex-col items-center w-full gap-x-2">
      <Button
        type="button"
        variant="outline"
        className="w-full m-1"
        onClick={() => onClick("google")}
      >
        <FcGoogle />
        Login with Google
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-full m-1"
        onClick={() => onClick("facebook")}
      >
        <FaFacebook />
        Login with Facebook
      </Button>
    </div>
  );
};
