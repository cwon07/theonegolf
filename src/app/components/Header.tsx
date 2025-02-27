"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const router = useRouter();

  const handleAdminLoginClick = () => {
    router.push('/admin/login');
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
      }}
    >
    <div 
        style={{ flex: 1, display: "flex", justifyContent: "center", cursor: "pointer" }}
        onClick={handleLogoClick} // Trigger onClick event here
      >
    <Image src="/Monday_Club_Logo.png" alt="Logo" width={150} height={150} />
  </div>

      {/* Admin Login Button on the right */}
      <button
        onClick={handleAdminLoginClick}
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
            <Image src="/Monday_Club_Logo.png" alt="Larger Logo" width={500} height={500} />
          </div>
        </div>
      )}
    </header>
  );
}
