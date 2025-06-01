"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect} from "react";
import { jwtDecode } from "jwt-decode";

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

  

  const handleLogoClick = () => {
   router.push("/");
  };

  const handleCloseModal = () => {
    // Close the modal when clicked outside or on the close button
    setIsModalOpen(false);
  };

  return (
    <header
      style={{
        flex: 1,
        display: "flex",
        justifyContent: "flex-start",
        paddingLeft: "1rem",
        cursor: "pointer"
      }}
    >
    <div
  className="logo-container flex justify-start w-full pl-4 sm:pl-6 md:pl-8 lg:pl-1 xl:pl-12 cursor-pointer"
  onClick={handleLogoClick}
>
  <Image 
    src="/TFlogo.png" 
    alt="Logo" 
    width={300} 
    height={90} 
    priority 
    className="w-auto max-w-[180px] sm:max-w-[200px] md:max-w-[220px] lg:max-w-[250px] xl:max-w-[300px]"
  />
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
            backgroundColor: "white", 
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999, 
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
            <Image src="/MClogo.svg" alt="Larger Logo" width={500} height={400} priority />
          </div>
        </div>
      )}
    </header>
  );
}
