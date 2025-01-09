import React, { useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";

const UserButton = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useCurrentUser();

  const onProfile = () =>{
    console.log("profile clicked")
  }

  const onLogout = ()=>{
    console.log("logout clicked")
  }

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* User Avatar/Button */}
      <button
        onClick={toggleMenu}
        style={{
          display: "flex",
          alignItems: "center",
          padding: "8px 12px",
          borderRadius: "20px",
          border: "1px solid #ccc",
          background: "#fff",
          cursor: "pointer",
        }}
      >
        <img
          src={user.avatar || "https://via.placeholder.com/40"}
          alt="User Avatar"
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            marginRight: "8px",
          }}
        />
        <span>{user.name || "User"}</span>
      </button>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            marginTop: "8px",
            background: "#fff",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            overflow: "hidden",
            zIndex: 1000,
          }}
        >
          <button
            onClick={onProfile}
            style={{
              padding: "8px 16px",
              display: "block",
              width: "100%",
              textAlign: "left",
              background: "none",
              border: "none",
              cursor: "pointer",
              borderBottom: "1px solid #eee",
            }}
          >
            View Profile
          </button>
          <button
            onClick={onLogout}
            style={{
              padding: "8px 16px",
              display: "block",
              width: "100%",
              textAlign: "left",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserButton;
