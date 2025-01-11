"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button"
import Link from "next/link";
import UserButton from "./user-button";

function Header() {
  const isSignedIn = false;

  return (
    <div className="p-5 flex justify-between items-center border shadow-sm">
      <div className="flex flex-row items-center">
        <Image src="/logo.svg" alt="logo" width={40} height={25} />
        <span className="text-blue-800  font-bold text-xl ml-2">SpendSmart</span>
      </div>
      {isSignedIn ? (
        <UserButton />
      ) : (
        <div className="flex gap-3  items-center">
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