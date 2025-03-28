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
  const [isEventDropdownOpen, setEventDropdownOpen] = useState(false);
  const [isAdminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const [adminName, setAdminName] = useState<string | null>(null);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownRefevent = useRef<HTMLDivElement>(null);
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
    if (!adminName) {
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
      if (dropdownRefevent.current && !dropdownRefevent.current.contains(event.target as Node)) {
        setEventDropdownOpen(false);
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
        padding: "1rem",
        paddingRight: "12rem",
        backgroundColor: "white",
        position: "relative",
      }}
    >
      {/* Rules Dropdown */}
      <div className="text-black font-bold relative text-[1.2rem]" ref={dropdownRef}>
        <button onClick={() => {setDropdownOpen(!isDropdownOpen);}} className="font-bold p-2 text-[1.2rem]">
          晚宴 & 規則▼
        </button>
        {isDropdownOpen && (
          <div className="text-black absolute top-full left-1/2 -translate-x-1/2 bg-white border rounded shadow-lg flex flex-col w-64">
            <button
              className="text-black p-2 hover:bg-gray-100" // Tailwind hover effect for the dropdown item
              onClick={() => {
                router.push("/rules_and_gathering");
              }}
            >
              月賽規則 & 晚宴
            </button>
            <button
              className="text-black p-2 hover:bg-gray-100" // Tailwind hover effect for the dropdown item
              onClick={() => {
                router.push("/handicap");
              }}
            >
              差點調整詳解
            </button>
          </div>
        )}
      </div>

      {/* Other Menu Items */}
      <button
        className="text-black font-bold relative text-[1.2rem]" // Tailwind hover effect for the dropdown item
        onClick={() => router.push("/list_members")}>
        會員總覽
      </button>

      {/* Events Dropdown */}
      <div className="text-black font-bold relative text-[1.2rem]" ref={dropdownRefevent}>
        <button onClick={() => setEventDropdownOpen(!isEventDropdownOpen)} className="font-bold p-2 text-[1.2rem]">
          賽事 & 球叙 ▼
        </button>
        {isEventDropdownOpen && (
          <div className="text-black absolute top-full left-1/2 -translate-x-1/2 bg-white border rounded shadow-lg flex flex-col w-64">
            <button
              className="text-black p-2 hover:bg-gray-100" // Tailwind hover effect for the dropdown item
              onClick={() => router.push("/current_event")}>
                當前賽事&球叙
            </button>
            <button
              className="text-black p-2 hover:bg-gray-100" // Tailwind hover effect for the dropdown item
              onClick={() => router.push("/past_events")}>
                過往賽事&球叙
            </button>

          </div>
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
            管理員功能 ▼
          </button>
          {isAdminDropdownOpen && (
            <div style={dropdownStyle} className="font-bold text-blue-500 p-2 hover:bg-gray-100">
              <button
                onClick={() => router.push("/admin/create_event")}>
                新增賽事&球叙
              </button>
              <button>
                刪除賽事&球叙
              </button>
              <button
                onClick={() => router.push("/admin/create_member")}>
                新增會員
              </button>
              <button
                onClick={() => router.push("/admin/update_member")}>
                修改會員
              </button>
              <button
                onClick={() => {
                sessionStorage.removeItem("token");
                setAdminName(null);
                window.location.reload();
              }}>
                登出
              </button>
            </div>
          )}
        </div>
      )}

      {/* Admin Login Button on the right */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {adminName ? (
          <span style={{ fontWeight: "bold", color: "#0000FE", fontSize: "1.2rem" }}>
            歡迎, {adminName}
          </span>
        ) : (
          <button
            onClick={handleAdminClick}
            style={{
              background: "#007bff",
              color: "#fff",
              border: "none",
              fontSize: "1.2rem",
              padding: "0.5rem 1rem",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            管理員登入
          </button>
        )}
      </div>
    </nav>
  );
};

// Common styling for navigation links
const navLinkStyle = {
  textDecoration: "none",
  color: "#333",
  fontSize: "1.2rem",
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
  fontSize: "1.2rem",
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
  fontSize: "1.2rem",
  width: "100%",
  transition: "background 0.2s ease",
  hover: {
    backgroundColor: "#f1f1f1",
  },
};

export default Navbar;
