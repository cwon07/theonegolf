'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";  
import Link from "next/link";
import Header from "@/app/components/Header";
import Navbar from "@/app/components/Navbar";

export default function AdminRegister() {
  const [user, setUser] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const router = useRouter();  
  const [selectedMenu, setSelectedMenu] = useState<string>("");

  const handleSelectMenu = (menu: string) => {
    setSelectedMenu(menu);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      //const res = await fetch("/api/auth/register", {
      //  method: "POST",
      //  headers: { "Content-Type": "application/json" },
      //  body: JSON.stringify(user),
      //});

      //const data = await res.json();
      
      //if (!res.ok) {
      //  setMessage(data.error || "Something went wrong");
      //  return;
      //}

      //setMessage("Registration successful! 🎉");
      setMessage("Registration is temporarily disabled!");
      //setUser({ username: "", firstName: "", lastName: "", email: "", password: "" });

      // Redirect to login page after successful registration
      //router.push("/admin/login");  
    } catch (error) {
      setMessage("Error registering. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
    {/* Header & Navbar */}
    <div className="bg-white shadow-md relative z-50">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Header />
        <Navbar onSelectMenu={handleSelectMenu} />
      </div>
    </div>

    <div className="text-black min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Admin Registration</h1>

        {message && <p className="text-center text-red-500">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold">Username:</label>
            <input
              type="text"
              name="username"
              value={user.username}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">First Name:</label>
            <input
              type="text"
              name="firstName"
              value={user.firstName}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={user.lastName}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Email:</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Password:</label>
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
          >
            Register
          </button>
        </form>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link href="/admin/login" className="text-blue-500 underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
    </div>
  );
}
