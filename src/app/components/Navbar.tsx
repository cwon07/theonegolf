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
  const [isMemDropdownOpen, setMemDropdownOpen] = useState(false);
  const [isEventDropdownOpen, setEventDropdownOpen] = useState(false);
  const [isAdminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const [adminName, setAdminName] = useState<string | null>(null);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const eventDropdownRef = useRef<HTMLDivElement>(null);
  const adminDropdownRef = useRef<HTMLDivElement>(null);
  const memDropdownRef = useRef<HTMLDivElement>(null);

  // Check if admin is logged in
  useEffect(() => {
    if (typeof window !== "undefined") {
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
    }
  }, []);

  const handleAdminClick = () => {
    if (!adminName) {
      router.push("/admin/login");
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (eventDropdownRef.current && !eventDropdownRef.current.contains(event.target as Node)) {
        setEventDropdownOpen(false);
      }
      if (adminDropdownRef.current && !adminDropdownRef.current.contains(event.target as Node)) {
        setAdminDropdownOpen(false);
      }
      if (memDropdownRef.current && !memDropdownRef.current.contains(event.target as Node)) {
        setMemDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="flex flex-col sm:flex-row justify-between items-center p-6 bg-white">
      {/* Left-side Menu Items */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center w-full sm:w-auto">
        {/* Rules Dropdown */}
        <div className="relative text-black font-bold text-[1.2rem] w-full sm:w-auto" ref={dropdownRef}>
          <button onClick={() => setDropdownOpen(!isDropdownOpen)} className="p-2 w-full sm:w-auto">
            晚宴 & 規則 ▼
          </button>
          {isDropdownOpen && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white border rounded shadow-lg flex flex-col items-center w-64 z-50">
              <span
                className="p-2 w-full hover:bg-gray-100 text-center cursor-pointer"
                onClick={() => router.push("/rules_and_gathering")}>
                月賽規則 & 晚宴
              </span>
              <span
                className="p-2 w-full hover:bg-gray-100 text-center cursor-pointer"
                onClick={() => router.push("/handicap")}>
                差點調整詳解
              </span>
            </div>
          )}
        </div>

        <div className="relative text-black font-bold text-[1.2rem] w-full sm:w-auto" ref={memDropdownRef}>
          <button onClick={() => setMemDropdownOpen(!isMemDropdownOpen)} className="p-2 w-full sm:w-auto">
            會員 & 調桿 ▼
          </button>
          {isMemDropdownOpen && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white border rounded shadow-lg flex flex-col items-center w-64 z-50">
              <span 
                className="p-2 w-full hover:bg-gray-100 text-center cursor-pointer"
                onClick={() => router.push("/list_members")}>
                會員總覽
              </span>
              <span
                className="p-2 w-full hover:bg-gray-100 text-center cursor-pointer"
                onClick={() => router.push("/handicap_history")}>
                調桿歷史
              </span>
            </div>
          )}
        </div>

        {/* Events Dropdown */}
        <div className="relative text-black font-bold text-[1.2rem] w-full sm:w-auto" ref={eventDropdownRef}>
          <button onClick={() => setEventDropdownOpen(!isEventDropdownOpen)} className="p-2 w-full sm:w-auto">
            賽事 & 球叙 ▼
          </button>
          {isEventDropdownOpen && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white border rounded shadow-lg flex flex-col items-center w-64 z-50">
              <span
                className="p-2 w-full hover:bg-gray-100 text-center cursor-pointer"
                onClick={() => router.push("/current_event")}>
                當前賽事&球叙
              </span>
              <span
                className="p-2 w-full hover:bg-gray-100 text-center cursor-pointer"
                onClick={() => router.push("/past_events")}>
                過往賽事&球叙
              </span>
            </div>
          )}
        </div>
      </div>


  {/* Right-side Admin Options */}
  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center w-full sm:w-auto mt-4 sm:mt-0">
    {/* Admin Dropdown (Only if Admin is Logged In) */}
    {adminName && (
      <div className="relative w-full sm:w-auto" ref={adminDropdownRef}>
        <button
          onClick={() => setAdminDropdownOpen(!isAdminDropdownOpen)}
          className="text-[1.2rem] font-bold text-blue-600 p-2 w-full sm:w-auto"
        >
          管理員功能 ▼
        </button>
        {isAdminDropdownOpen && (
          <div className="absolute top-full left-0 bg-white border rounded shadow-lg text-blue-600 font-bold text-[1.2rem] flex flex-col w-64 z-50">
            <button className="p-2 hover:bg-gray-100" onClick={() => router.push("/admin/create_event")}>新增賽事&球叙</button>
            <button className="p-2 hover:bg-gray-100" onClick={() => router.push("/admin/delete_event")}>刪除賽事&球叙</button>
            <button className="p-2 hover:bg-gray-100" onClick={() => router.push("/admin/create_member")}>新增會員</button>
            <button className="p-2 hover:bg-gray-100" onClick={() => router.push("/admin/update_member")}>修改會員</button>
            <button
              className="p-2 hover:bg-gray-200 text-red-500 font-bold text-[1.2rem]"
              onClick={() => {
                sessionStorage.removeItem("token");
                setAdminName(null);
                window.location.reload();
              }}
            >
              登出
            </button>
          </div>
        )}
      </div>
    )}

    {/* Admin Login Button (Only if Not Logged In) */}
    {!adminName && (
      <div className="ml-4 sm:ml-6">
      <button
        onClick={handleAdminClick}
        className="bg-blue-500 text-white border-none text-[1.2rem] px-4 py-2 sm:w-auto rounded cursor-pointer"
      >
        管理員登入
      </button>
      </div>
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

export default Navbar;
