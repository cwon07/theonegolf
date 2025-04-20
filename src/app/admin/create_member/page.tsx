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
      <div className="text-black min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-4">新增會員</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold">會員序號 (ID):</label>
            <input
              type="number"
              name="id"
              value={member.id}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              placeholder="必須與現有會員無重複。例如： 4"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">中文名字:</label>
            <input
              type="text"
              name="name"
              value={member.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              placeholder="例如： 隔壁王大明"
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
              placeholder="例如： DaMing Wang"

            />
          </div>

          <div>
            <label className="block font-semibold">差點:</label>
            <input
              type="number"
              name="handicap"
              value={member.handicap}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              placeholder="例如： 16"
              min="-18"
              max="45"
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
            新增會員
          </button>
        </form>
      </div>
    </div>
    </div>
  );
}