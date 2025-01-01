"use client";

import React from "react";
import axios from "axios";

interface LogoutButtonProps {
  children?: React.ReactNode;
}

const LogoutButton = ({ children }: LogoutButtonProps) => {
  const onClick = async () => {
    try {
      const response = await axios.post("/api/logout");
      if (response.data.success) {
        // Redirect the user after a successful logout
        window.location.href = "/";
      } else {
        alert(response.data.error || "Logout failed. Please try again.");
      }
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
