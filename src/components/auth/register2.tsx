"use client";
import RegisterForm from "../register-form";
import Link from "next/link";
import Image from "next/image";

export default function RegisterForm2() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex justify-center gap-2 md:justify-start">
            <Link href="/" className="flex items-center gap-2 font-medium">
              <Image src="/logo.svg" alt="logo" width={40} height={25} />
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs">
              <RegisterForm />
            </div>
          </div>
        </div>

      {/* Right Section: Background Image */}
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/register_background.jpeg"
          alt="A sleek and modern design for registration"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          loading="lazy"
        />
      </div>
    </div>
  );
}
