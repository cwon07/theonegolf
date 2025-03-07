"use client";

import { FC, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface NavbarProps {
  onSelectMenu: (menu: string) => void;
}

interface DecodedToken {
  id: string;
  username: string;
  email: string;
  exp: number;
}

const Navbar: FC<NavbarProps> = ({ onSelectMenu }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isAdminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const [adminName, setAdminName] = useState<string | null>(null);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const adminDropdownRef = useRef<HTMLDivElement>(null);
  

  // Check if admin is logged in
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setAdminName(decoded.username);
        } else {
          sessionStorage.removeItem("token");
          setAdminName(null);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        setAdminName(null);
      }
    }
  }, []);

  const handleAdminClick  = () => {
    if (adminName) {
      // Navigate to the admin dashboard if logged in
      router.push("/admin/dashboard");
    } else {
      // Redirect to login page if not logged in
      router.push("/admin/login");
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (adminDropdownRef.current && !adminDropdownRef.current.contains(event.target as Node)) {
        setAdminDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "2rem",
        padding: "1rem 0",
        backgroundColor: "white",
        position: "relative",
      }}
    >
      {/* Rules Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button onClick={() => setDropdownOpen(!isDropdownOpen)} className="font-bold p-2">
          Rules ▼
        </button>
        {isDropdownOpen && (
          <div className="absolute top-full left-0 bg-white border rounded shadow-lg flex flex-col">
            <button
              className="p-2 hover:bg-gray-100" // Tailwind hover effect for the dropdown item
              onClick={() => onSelectMenu("general-rules")}
            >
              月賽
            </button>
            <button
              className="p-2 hover:bg-gray-100" // Tailwind hover effect for the dropdown item
              onClick={() => onSelectMenu("competition-rules")}
            >
              Competition Rules
            </button>
            <button
              className="p-2 hover:bg-gray-100" // Tailwind hover effect for the dropdown item
              onClick={() => onSelectMenu("etiquette")}
            >
              差點調整
            </button>
          </div>
        )}
      </div>

      {/* Other Menu Items */}
      <button onClick={() => onSelectMenu("members")} style={navLinkStyle}>
        Members
      </button>
      <button onClick={() => onSelectMenu("event-results")} style={navLinkStyle}>
        Event Results
      </button>

      {/* Admin Login Button on the right */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {adminName ? (
          <span style={{ fontWeight: "bold", color: "#0000FE" }}>
            Welcome, {adminName}
          </span>
        ) : (
          <button
            onClick={handleAdminClick}
            style={{
              background: "#007bff",
              color: "#fff",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Admin Login
          </button>
        )}
      </div>

      {/* Admin Dropdown (Only if Admin is Logged In) */}
      {adminName && (
        <div style={{ position: "relative" }} ref={adminDropdownRef}>
          <button
            onClick={() => setAdminDropdownOpen(!isAdminDropdownOpen)}
            style={{ ...navLinkStyle, color: "#0000FE" }}
            aria-expanded={isAdminDropdownOpen}
          >
            Admin Only Actions ▼
          </button>
          {isAdminDropdownOpen && (
            <div style={dropdownStyle}>
              <button
                className="p-2 hover:bg-gray-100" // Tailwind hover effect for the dropdown item
                onClick={() => router.push("/admin/dashboard")}
              >
                Create Golf Event
              </button>
              <button
                className="p-2 hover:bg-gray-100" // Tailwind hover effect for the dropdown item
                onClick={() => {
                  sessionStorage.removeItem("token");
                  setAdminName(null);
                  window.location.reload();
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

// Common styling for navigation links
const navLinkStyle = {
  textDecoration: "none",
  color: "#333",
  fontSize: "1rem",
  fontWeight: "bold",
  cursor: "pointer",
  padding: "0.5rem 1rem",
  border: "none",
  background: "none",
  transition: "color 0.3s ease",
};

// Dropdown menu styling
const dropdownStyle = {
  position: "absolute" as const,
  top: "100%",
  left: 0,
  background: "white",
  color: "#0000FE",
  border: "1px solid #ddd",
  borderRadius: "5px",
  boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
  zIndex: 10,
  display: "flex",
  flexDirection: "column" as const,
  minWidth: "200px",
};

// Dropdown item styling
const dropdownItemStyle = {
  textAlign: "left" as const,
  padding: "0.5rem 1rem",
  cursor: "pointer",
  border: "none",
  background: "white",
  color: "#333",
  fontSize: "1rem",
  width: "100%",
  transition: "background 0.2s ease",
  hover: {
    backgroundColor: "#f1f1f1",
  },
};

export default Navbar;
