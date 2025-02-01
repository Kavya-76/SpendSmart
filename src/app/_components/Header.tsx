"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import UserButton from "./user-button";
import { useTheme } from "next-themes";

function Header() {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isSignedIn = false;

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <div className="p-5 flex justify-between items-center border shadow-sm">
      {/* Logo Section */}
      <div className="flex flex-row items-center">
        {mounted ? (
          <Image
            src={
              currentTheme === "dark"
                ? "/SpendSmart Logo White.jpg"
                : "/SpendSmart Logo Black.jpg"
            }
            alt="logo"
            width={40}
            height={25}
          />
        ) : (
          <Image
            src="/SpendSmart Logo Black.jpg"
            alt="logo"
            width={40}
            height={25}
          />
        )}
        <span className="text-primary font-bold text-xl ml-2">
          SpendSmart
        </span>
      </div>

      {/* Authentication Section */}
      {isSignedIn ? (
        <UserButton />
      ) : (
        <div className="flex gap-3 items-center">
          <Link href={"/dashboard"}>
            <Button variant="outline" className="rounded-full">
              Dashboard
            </Button>
          </Link>
          <Link href={"/auth/register"}>
            <Button className="rounded-full">Get Started</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Header;
