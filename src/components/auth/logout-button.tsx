"use client";

import React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface LogoutButtonProps {
  children?: React.ReactNode;
}

const LogoutButton = ({ children }: LogoutButtonProps) => {
  const router = useRouter();
  const onClick = async () => {
    try {
      await axios.post("/api/logout");
      router.push("/");

      // if (response.data.success) {
      //   alert(response.data.error || "Logout failed. Please try again.");
      // }
    } catch (error) {
      console.error("Logout error:", error);
      alert("An error occurred while logging out. Please try again.");
    }
  };

  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  );
};

export default LogoutButton;
