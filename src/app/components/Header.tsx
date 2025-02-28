"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect} from "react";
import { jwtDecode } from "jwt-decode"; // Install this package with `npm install jwt-decode`

interface DecodedToken {
  id: string;
  username: string;
  email: string;
  exp: number;
}


export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [adminName, setAdminName] = useState<string | null>(null);
  const router = useRouter();

  const checkAdminStatus = () => {
    const token = sessionStorage.getItem("token"); // Get the stored token

    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);

        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          sessionStorage.removeItem("token"); // Remove expired token
          setAdminName(null);
        } else {
          setAdminName(decoded.username); // Set admin name
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        setAdminName(null);
      }
    }
  }
  
  // Run checkAdminStatus when the component mounts
  useEffect(() => {
    checkAdminStatus();
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

  const handleLogoClick = () => {
    // Open the modal to show the larger logo
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    // Close the modal when clicked outside or on the close button
    setIsModalOpen(false);
  };

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1rem",
        borderBottom: "2px solid #ddd",
        width: "100%",
      }}
    >
    <div 
        style={{ flex: 1, display: "flex", justifyContent: "center", cursor: "pointer" }}
        onClick={handleLogoClick} // Trigger onClick event here
      >
    <Image src="/Monday_Club_Logo.png" alt="Logo" width={150} height={150} priority/>
  </div>

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

      {/* Modal for the Larger Logo */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark background
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999, // Ensure it's on top of other elements
          }}
          onClick={handleCloseModal} // Close modal if clicked outside
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "2rem",
              borderRadius: "12px",
              cursor: "auto", // Prevent closing when clicking on the image
            }}
            onClick={(e) => e.stopPropagation()} // Prevent modal from closing when image is clicked
          >
            <Image src="/Monday_Club_Logo.png" alt="Larger Logo" width={500} height={500} priority />
          </div>
        </div>
      )}
    </header>
  );
}
