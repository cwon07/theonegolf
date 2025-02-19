"use client";

import Image from "next/image";
import Link from "next/link";

export default function Header() {
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
      {/* Logo on the left */}
      <Link href="/" style={{ display: "flex", alignItems: "center" }}>
        <Image src="/logo.svg" alt="Logo" width={50} height={50} />
      </Link>

      {/* Centered Title */}
      <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
        <h1 style={{ margin: 0, fontSize: "1.5rem", textAlign: "center", flexGrow: 1 }}>
            The Monday Club
        </h1>
      </Link>

      {/* Admin Login Button on the right */}
      <button
        style={{
          background: "#007bff",
          color: "#fff",
          border: "none",
          padding: "0.5rem 1rem",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        onClick={() => alert("Admin Login Clicked")}
      >
        Admin Login
      </button>
    </header>
  );
}
