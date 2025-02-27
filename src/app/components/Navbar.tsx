"use client";

import { FC, useState } from "react";

interface NavbarProps {
  onSelectMenu: (menu: string) => void;
}

const Navbar: FC<NavbarProps> = ({ onSelectMenu }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "2rem",
        padding: "1rem 0",
        backgroundColor: "#f8f9fa",
        borderBottom: "2px solid #ddd",
        position: "relative",
      }}
    >
      {/* Rules Dropdown */}
      <div className="relative">
        <button onClick={() => setDropdownOpen(!isDropdownOpen)} className="font-bold p-2">
          Rules ▼
        </button>
        {isDropdownOpen && (
          <div className="absolute top-full left-0 bg-white border rounded shadow-lg flex flex-col">
            <button className="p-2 hover:bg-gray-100" onClick={() => onSelectMenu("general-rules")}>
               月賽
            </button>
            <button className="p-2 hover:bg-gray-100" onClick={() => onSelectMenu("competition-rules")}>
              Competition Rules
            </button>
            <button className="p-2 hover:bg-gray-100" onClick={() => onSelectMenu("etiquette")}>
               差點調整
            </button>
          </div>
        )}
      </div>

      {/* Other Menu Items */}
      <button onClick={() => onSelectMenu("members")} style={navLinkStyle}>Members</button>
      <button onClick={() => onSelectMenu("current-event")} style={navLinkStyle}>Current Event</button>
      <button onClick={() => onSelectMenu("past-event-results")} style={navLinkStyle}>Past Event Results</button>
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
  position: "absolute",
  top: "100%",
  left: 0,
  background: "white",
  border: "1px solid #ddd",
  borderRadius: "5px",
  boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
  zIndex: 10,
  display: "flex",
  flexDirection: "column" as const,
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