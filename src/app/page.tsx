"use client"

import { createUser } from "./lib/actions/user.actions";
import { useState } from "react";
import Header from "./components/Header";
import Navbar from "./components/Navbar";

export default function Home() {
  const [selectedMenu, setSelectedMenu ] = useState<string>("");

  const handleSelectMenu = (menu: string) => {
    setSelectedMenu(menu);
  };

  return (
    <>
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <Navbar onSelectMenu={handleSelectMenu} />


      <div 
        style={{ 
          padding: "1rem", 
          flexGrow: 1, // Ensures the content div grows to fill available space
          display: "flex",
          justifyContent: "center",
          alignItems: "center", 
        }}
      >
      <div
        style={{
          width: "80%", // Adjust the width to your preference
          maxWidth: "900px", // Max width to prevent it from growing too large
          minHeight:"300px",
          maxHeight:"calc(100vh - 120px)", // Fixed height
          padding: "2rem",
          borderRadius: "12px", // Round corners
          border: "2px solid slategray", // Slate grey border
          boxSizing: "border-box", // Ensure padding is inside the border
          backgroundColor: "white",
          overflowY: "auto", // Enables vertical scrolling if content exceeds height
          transition: "all 0.3s ease-in-out", // Smooth transition for responsiveness
        }}
      >
            {selectedMenu === "rules" && (
              <div>
                <h2>Rules</h2>
                <p>Here are the rules for The Monday Club...</p>
              </div>
            )}
            {selectedMenu === "members" && (
              <div>
                <h2>Members</h2>
                <p>Here is the list of all members...</p>
              </div>
            )}
            {selectedMenu === "currentEvent" && (
              <div>
                <h2>Current Event</h2>
                <p>Details about the current event...</p>
              </div>
            )}
            {selectedMenu === "pastEventResults" && (
              <div>
                <h2>Past Event Results</h2>
                <p>Here are the results from past events...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* <main style={{ padding: "2rem" }}>
        <form
          action="/api/createUser"
          method="post"
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <div>
            <label htmlFor="username">Username</label>
            <input id="username" name="username" type="text" required />
          </div>
          <div>
            <label htmlFor="firstName">First Name</label>
            <input id="firstName" name="firstName" type="text" required />
          </div>
          <div>
            <label htmlFor="lastName">Last Name</label>
            <input id="lastName" name="lastName" type="text" required />
          </div>
          <div>
            <label htmlFor="email">Email Address</label>
            <input id="email" name="email" type="email" required />
          </div>
          <button type="submit" style={{ marginTop: "1rem" }}>
            Submit
          </button>
        </form>
      </main> */}
    </>
  );
}