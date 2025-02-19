"use client";

import { FC } from "react";

interface NavbarProps {
    onSelectMenu: (menu: string) => void;
}

const Navbar: FC<NavbarProps> = ({ onSelectMenu }) => {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "2rem",
        padding: "1rem 0",
        backgroundColor: "#f8f9fa",
        borderBottom: "2px solid #ddd",
      }}
    >
      <button onClick={() => onSelectMenu("rules")} style={navLinkStyle}>Rules</button>
      <button onClick={() => onSelectMenu("members")} style={navLinkStyle}>Members</button>
      <button onClick={() => onSelectMenu("current-event")} style={navLinkStyle}>Current Event</button>
      <button onClick={() => onSelectMenu("past-event-results")} style={navLinkStyle}>Past Event Results</button>
    </nav>
  );
}

// Common styling for navigation links
const navLinkStyle = {
  textDecoration: "none",
  color: "#333",
  fontSize: "1rem",
  fontWeight: "bold",
  cursor: "pointer",
  padding: "0.5rem 1rem",
  border: "none",
  transition: "color 0.3s ease",
};

export default Navbar;