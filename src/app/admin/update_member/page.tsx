"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header"
import Navbar from "@/app/components/Navbar"

interface Member {
  _id: string;
  id: number;
  handicap: number[]; // Changed from [number] to number[]
  name: string;
  sex: "Male" | "Female" | "Other"; // Matches schema enum
  eng_name?: string; // Optional, as in schema
  is_new: boolean;   // Added from schema
}

export default function AdminDashboard() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [member, setMember] = useState<Member>({
    _id: "",           // Required by interface
    id: 0,             // Fixed: Use a number, not `Number`
    name: "",
    sex: "Male",
    eng_name: "",
    handicap: [],      // Matches number[] (empty array is valid unless schema enforces minlength)
    is_new: false,
  });
  const [handicapInput, setHandicapInput] = useState<string>(member.handicap.join(", "));


  useEffect(() => {
    const token = sessionStorage.getItem("token"); // Get the stored token
    console.log("Retrieved token:", token); // ✅ Debugging log

    if (!token) {
      // If no token, redirect to login page
      router.push("/admin/login");
    }
  }, [router]);

  useEffect(() => {
    setHandicapInput(member.handicap.join(", "));
  }, [member.handicap]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    if (name === "handicap") {
      setHandicapInput(value); // Update raw input as user types
    } else {
      setMember({
        ...member,
        [name]: name === "is_new" ? value === "true" : value,
      });
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
  
    if (name === "handicap") {
      const handicapArray = value
        .split(",")
        .map((item) => parseInt(item.trim(), 10))
        .filter((num) => !isNaN(num));
      setMember({
        ...member,
        handicap: handicapArray,
      });
    }
  };

  const handleSelectMenu = (menu: string) => {
    console.log("Selected menu:", menu);
  };  

  const handleSearch = async () => {
    if (!searchId) {
      alert("Please enter a Member ID to search");
      return;
    }
  
    try {
      console.log("searchID:", searchId)
      const response = await fetch(`/api/update_member?id=${searchId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
  
      if (response.ok) {
        const memberData = await response.json();
        setMember({
          _id: memberData._id || "",
          id: Number(memberData.id),
          name: memberData.name || "",
          sex: memberData.sex || "Male",
          eng_name: memberData.eng_name || "",
          handicap: Array.isArray(memberData.handicap) ? memberData.handicap : [],
          is_new: memberData.is_new ?? false,
        });
        setShowForm(true);
      } else {
        alert("Member not found");
        setShowForm(false);
      }

    } catch (error) {
      console.error("Error searching member:", error);
      alert("An error occurred while searching for the member");
      setShowForm(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Update Member:", member);

    // Convert data into the correct types
    const memberData = {
      id: Number(member.id),
      name: member.name,
      sex: member.sex,
      eng_name: member.eng_name,
      handicap: member.handicap,
      is_new: member.is_new,
    };

    try {
      const response = await fetch("/api/update_member", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(memberData),
      });

      if (response.ok) {
        alert("Member updated successfully!");
        setMember({ _id: "", id: 0, name: "", sex: "Male", eng_name: "", handicap: [], is_new: false });
        setShowForm(false); // Hide form after success
        setSearchId(""); // Clear search input
      } else {
        alert("Failed to update member.");
      }
    } catch (error) {
      console.error("Error updating member:", error);
      alert("An error occurred while creating the member.");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header + Navbar */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto flex items-center justify-between p-4">
          <Header />
          <Navbar onSelectMenu={handleSelectMenu}/>
        </div>
      </div>

      {/* Main Content */}
      <div className="text-black flex flex-col items-center items-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-2xl p-6 bg- shadow-lg rounded-lg bg-white">
        <h1 className="text-2xl font-bold text-center mb-4">Update Member</h1>
          <div className="flex items-center space-x-2">
            <input 
              type="text" 
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 flex-grow"
              placeholder="Enter Member ID"
            />
            <button 
             onClick={() =>{
              setShowForm(true);
              handleSearch();
            }}
             className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">
              Search
            </button>
            <button className="test-right bg-red-500 text-white px-4 py-1 rounded hover:bg-gray-600">
              Delete
            </button>
          </div>
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold">Name:</label>
            <input
              type="text"
              name="name"
              value={member.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Sex:</label>
            <select
                name="sex"
                value={member.sex}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
            >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
            </select>
            </div>

          <div>
            <label className="block font-semibold">English Name:</label>
            <input
              type="text"
              name="eng_name"
              value={member.eng_name}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block font-semibold">Handicap:</label>
              <textarea
                name="handicap"
                value={handicapInput}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full p-2 border rounded-md"
                rows={1}
                placeholder="Enter handicaps, separated by commas (e.g., 15, 20, 25)"
                required
              />
          </div>

          <div>
            <label className="block font-semibold">Is New Member?</label>
            <select
              name="is_new"
              value={member.is_new ? "true" : "false"}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
          </div>

          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
            Update Member
          </button>
        </form>
        )}
      </div>
    </div>
    </div>
  );
}