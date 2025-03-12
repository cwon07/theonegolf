"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header"
import Navbar from "@/app/components/Navbar"

export default function AdminDashboard() {
  const router = useRouter();
  const [member, setMember] = useState({
    id: "",
    name: "",
    sex: "Male",
    eng_name: "",
    handicap: "",
    is_new: false,
  });

  useEffect(() => {
    const token = sessionStorage.getItem("token"); // Get the stored token
    console.log("Retrieved token:", token); // ✅ Debugging log

    if (!token) {
      // If no token, redirect to login page
      router.push("/admin/login");
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    setMember({
      ...member,
      [name]: name === "is_new" ? value === "true" : value  // Convert "true"/"false" to boolean
    });
  };

  const handleSelectMenu = (menu: string) => {
    console.log("Selected menu:", menu);
  };  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating Member:", member);

    // Convert data into the correct types
    const memberData = {
      id: parseInt(member.id, 10),
      name: member.name,
      sex: member.sex,
      eng_name: member.eng_name,
      handicap: parseInt(member.handicap, 10),
      is_new: member.is_new,
    };

    try {
      const response = await fetch("/api/create_member", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(memberData),
      });

      if (response.ok) {
        alert("Member created successfully!");
        setMember({ id: "", name: "", sex: "Male", eng_name: "", handicap: "", is_new: false }); // Reset form
      } else {
        alert("Failed to create member.");
      }
    } catch (error) {
      console.error("Error creating member:", error);
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
      <div className="flex flex-col items-center items-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-2xl p-6 bg- shadow-lg rounded-lg bg-white">
        <h1 className="text-2xl font-bold text-center mb-4">Create New Member</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold">ID:</label>
            <input
              type="number"
              name="id"
              value={member.id}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

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
            <input
              type="number"
              name="handicap"
              value={member.handicap}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              min="-18"
              max="45"
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
            Create Member
          </button>
        </form>
      </div>
    </div>
    </div>
  );
}