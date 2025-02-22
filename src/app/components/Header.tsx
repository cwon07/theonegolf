"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  const handleAdminLoginClick = () => {
    router.push('/admin/login');
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
        style={{ 
          display: 'flex', 
          alignItems: 'center' 
        }}>
      
      {/* Logo on the left */}
        <Image src="/logo.svg" alt="Logo" width={50} height={50} />
      </div>

      {/* Centered Title */}
        <h1
          onClick={() => router.push('/')} 
          style={{ 
            cursor: "pointer", 
            margin: "0 auto", 
            fontSize: "1.5rem", 
            textAlign: "center", 
            flexGrow: 1, 
          }}
        >
          The Monday Club
        </h1>

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
    </header>
  );
}
