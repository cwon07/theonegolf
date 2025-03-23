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

  const handleDelete = async () => {
    if (!searchId) {
      alert("Please enter a Member ID to delete");
      return;
    }
  
    // Optional: Add confirmation dialog
    if (!confirm("Are you sure you want to delete this member?")) {
      return;
    }
  
    try {
      console.log("deleteID:", searchId);
      const response = await fetch(`/api/update_member?id=${searchId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
  
      if (response.ok) {
        const result = await response.json();
        alert("Member deleted successfully");
        // Reset form/state after successful deletion
        setMember({
          _id: "",
          id: 0,
          name: "",
          sex: "Male",
          eng_name: "",
          handicap: [],
          is_new: false,
        });
        setSearchId(""); // Assuming you have a setSearchId function
        setShowForm(false);
      } else {
        const errorData = await response.json();
        alert(`Failed to delete member: ${errorData.error}`);
      }
  
    } catch (error) {
      console.error("Error deleting member:", error);
      alert("An error occurred while deleting the member");
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
        <h1 className="text-2xl font-bold text-center mb-4">修改會員</h1>
          <div className="block flex items-center space-x-2">
            <input 
              type="text" 
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 flex-grow h-10"
              placeholder="Enter Member ID"
            />
            <button 
             onClick={() =>{
              setShowForm(true);
              handleSearch();
            }}
             className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 h-10">
              搜尋
            </button>
            <button 
            onClick={() =>{
              handleDelete();
            }}
             className="test-right bg-red-500 text-white px-4 py-1 rounded hover:bg-gray-600 h-10">
              刪除
            </button>
          </div>
        {showForm && (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block font-semibold">中文名字:</label>
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
            <label className="block font-semibold">性別:</label>
            <select
                name="sex"
                value={member.sex}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
            >
                <option value="Male">男</option>
                <option value="Female">女</option>
                <option value="Other">其他</option>
            </select>
            </div>

          <div>
            <label className="block font-semibold">英文名字:</label>
            <input
              type="text"
              name="eng_name"
              value={member.eng_name}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block font-semibold">差點:</label>
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
            <label className="block font-semibold">是否是新會員?</label>
            <select
              name="is_new"
              value={member.is_new ? "true" : "false"}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="true">是</option>
              <option value="false">否</option>
            </select>
          </div>

          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
            修改會員
          </button>
        </form>
        )}
      </div>
    </div>
    </div>
  );
}