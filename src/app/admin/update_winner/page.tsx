"use client";

import { useState, useEffect, Suspense } from "react";
import mongoose from 'mongoose';
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/app/components/Header";
import Navbar from "@/app/components/Navbar";

interface Member {
  _id: string;
  id: number;
  handicap: number[];
  name: string;
  sex: string;
}

interface Round {
  _id:  mongoose.Types.ObjectId;
  member:  Member
  front_9?: string;
  back_9?: string;
}

interface Group {
  _id: mongoose.Types.ObjectId;
  date: string;
  time: string;
  rounds: Round[];
}


interface Event {
  _id: string;
  date: string;
  is_tourn: boolean;
  groups: Group[]
  m_total_stroke: Member;
  w_total_stroke: Member;
  m_net_stroke_1: Member;
  m_net_stroke_2: Member;
  m_net_stroke_3: Member;
  m_net_stroke_4: Member;
  m_net_stroke_5: Member;
  w_net_stroke_1: Member;
  w_net_stroke_2: Member;
  m_long_drive: Member;
  w_long_drive: Member;
  close_to_center: Member;
  m_close_pin_2: Member;
  m_close_pin_7: Member;
  m_close_pin_12: Member;
  m_close_pin_16: Member;
  w_close_pin_7: Member;
  w_close_pin_12: Member;
  m_bb: Member;
  w_bb: Member;
  birdies: Member[];
  eagles: Member[];
  albatrosses: Member[];
}

// Separate component for content that uses useSearchParams
function EventContent() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId");
  const router = useRouter();

  const [event, setEvent] = useState<Event | null>(null);
  const [eventData, setEventData] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    m_total_stroke: "", // as a string or number, depending on how you're handling it
    w_total_stroke: "",
    m_net_stroke_1: "",
    m_net_stroke_2: "",
    m_net_stroke_3: "",
    m_net_stroke_4: "",
    m_net_stroke_5: "",
    w_net_stroke_1: "",
    w_net_stroke_2: "",
    m_long_drive: "",
    w_long_drive: "",
    close_to_center: "",
    m_close_pin_2: "",
    m_close_pin_7: "",
    m_close_pin_12: "",
    m_close_pin_16: "",
    w_close_pin_7: "",
    w_close_pin_12: "",
    m_bb: "",
    w_bb: "",
    birdies: "",
    eagles: "",
    albatrosses: "",
  });

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    console.log("Retrieved token:", token);

    if (!token) {
      router.push("/admin/login");
      return;
    }

    if (!eventId) {
      setError("No group ID provided");
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/update_winner?eventId=${eventId}`);
        const data = await response.json();
        if (response.ok) {
          setEvent(data);
          setEventData({ ...data });
    
          const birdiesString =
            data.birdies && data.birdies.length > 0
            ? (data.birdies as { id: number }[]).map((birdies) => birdies.id).join(', ')
            : '';
            const eaglesString =
            data.eagles && data.eagles.length > 0
            ? (data.eagles as { id: number }[]).map((eagles) => eagles.id).join(', ')
            : '';
            const albatrossesString =
            data.albatrosses && data.albatrosses.length > 0
            ? (data.albatrosses as { id: number }[]).map((albatrosses) => albatrosses.id).join(', ')
            : '';
    
          setFormData((prev) => ({
            ...prev,
            birdies: birdiesString,
            eagles: eaglesString,
            albatrosses: albatrossesString,
          }));
        } else {
          setError(data.error || "Failed to fetch group");
        }
      } catch (error) {
        setError("Error fetching group");
        console.error("Error fetching group:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId, router]);

  const handleSave = async () => {
    if (!eventData) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/update_winner?eventId=${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        router.push("/current_event");
      } else {
        const errorData = await response.json();
        alert(`保存失敗: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("保存失敗: 網絡錯誤");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>

  if (error) return <div>Error: {error}</div>;

  if (!event || !eventData) return <div>No group data found</div>;

  return (
    <div className="text-black min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">賽事結果更新</h1>
        <div className="space-y-6">
          {/* Date */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">日期: {event.date}</label>
          </div>

          {/* Total Stroke */}
          <div>
            <label className="block font-semibold text-blue-700 mb-1">總桿獎 (男):</label>
            <input
              type="number"
              name="m_total_stroke"
              value={formData.m_total_stroke}
              onChange={(e) => setFormData({ ...formData, m_total_stroke: e.target.value })}
              className="w-full p-2 border rounded-md bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder={
                event.m_total_stroke?.id
                  ? `(${event.m_total_stroke.id}) ${event.m_total_stroke.name}`
                  : "輸入會員編號"
              }
            />
          </div>
          <div>
            <label className="block font-semibold text-pink-700 mb-1">總桿獎 (女):</label>
            <input
              type="number"
              name="w_total_stroke"
              value={formData.w_total_stroke}
              onChange={(e) => setFormData({ ...formData, w_total_stroke: e.target.value })}
              className="w-full p-2 border rounded-md bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder={
                event.w_total_stroke?.id
                  ? `(${event.w_total_stroke.id}) ${event.w_total_stroke.name}`
                  : "輸入會員編號"
              }
            />
          </div>

          {/* Net Stroke */}
          <div>
            <label className="block font-semibold text-blue-700 mb-1">淨桿獎第一名 (男):</label>
            <input
              type="number"
              name="m_net_stroke_1"
              value={formData.m_net_stroke_1}
              onChange={(e) => setFormData({ ...formData, m_net_stroke_1: e.target.value })}
              className="w-full p-2 border rounded-md bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder={
                event.m_net_stroke_1?.id
                  ? `(${event.m_net_stroke_1.id}) ${event.m_net_stroke_1.name}`
                  : "輸入會員編號"
              }
            />
          </div>
          <div>
            <label className="block font-semibold text-blue-700 mb-1">淨桿獎第二名 (男):</label>
            <input
              type="number"
              name="m_net_stroke_2"
              value={formData.m_net_stroke_2}
              onChange={(e) => setFormData({ ...formData, m_net_stroke_2: e.target.value })}
              className="w-full p-2 border rounded-md bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder={
                event.m_net_stroke_2?.id
                  ? `(${event.m_net_stroke_2.id}) ${event.m_net_stroke_2.name}`
                  : "輸入會員編號"
              }
            />
          </div>
          <div>
            <label className="block font-semibold text-blue-700 mb-1">淨桿獎第三名 (男):</label>
            <input
              type="number"
              name="m_net_stroke_3"
              value={formData.m_net_stroke_3}
              onChange={(e) => setFormData({ ...formData, m_net_stroke_3: e.target.value })}
              className="w-full p-2 border rounded-md bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder={
                event.m_net_stroke_3?.id
                  ? `(${event.m_net_stroke_3.id}) ${event.m_net_stroke_3.name}`
                  : "輸入會員編號"
              }
            />
          </div>
          <div>
            <label className="block font-semibold text-blue-700 mb-1">淨桿獎第四名 (男):</label>
            <input
              type="number"
              name="m_net_stroke_4"
              value={formData.m_net_stroke_4}
              onChange={(e) => setFormData({ ...formData, m_net_stroke_4: e.target.value })}
              className="w-full p-2 border rounded-md bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder={
                event.m_net_stroke_4?.id
                  ? `(${event.m_net_stroke_4.id}) ${event.m_net_stroke_4.name}`
                  : "輸入會員編號"
              }
            />
          </div>
          <div>
            <label className="block font-semibold text-blue-700 mb-1">淨桿獎第五名 (男):</label>
            <input
              type="number"
              name="m_net_stroke_5"
              value={formData.m_net_stroke_5}
              onChange={(e) => setFormData({ ...formData, m_net_stroke_5: e.target.value })}
              className="w-full p-2 border rounded-md bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder={
                event.m_net_stroke_5?.id
                  ? `(${event.m_net_stroke_5.id}) ${event.m_net_stroke_5.name}`
                  : "輸入會員編號"
              }
            />
          </div>
          <div>
            <label className="block font-semibold text-pink-700 mb-1">淨桿獎第一名 (女):</label>
            <input
              type="number"
              name="w_net_stroke_1"
              value={formData.w_net_stroke_1}
              onChange={(e) => setFormData({ ...formData, w_net_stroke_1: e.target.value })}
              className="w-full p-2 border rounded-md bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder={
                event.w_net_stroke_1?.id
                  ? `(${event.w_net_stroke_1.id}) ${event.w_net_stroke_1.name}`
                  : "輸入會員編號"
              }
            />
          </div>
          <div>
            <label className="block font-semibold text-pink-700 mb-1">淨桿獎第二名 (女):</label>
            <input
              type="number"
              name="w_net_stroke_2"
              value={formData.w_net_stroke_2}
              onChange={(e) => setFormData({ ...formData, w_net_stroke_2: e.target.value })}
              className="w-full p-2 border rounded-md bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder={
                event.w_net_stroke_2?.id
                  ? `(${event.w_net_stroke_2.id}) ${event.w_net_stroke_2.name}`
                  : "輸入會員編號"
              }
            />
          </div>

          {/* Long Drive */}
          <div>
            <label className="block font-semibold text-blue-700 mb-1">遠桿獎 (男):</label>
            <input
              type="number"
              name="m_long_drive"
              value={formData.m_long_drive}
              onChange={(e) => setFormData({ ...formData, m_long_drive: e.target.value })}
              className="w-full p-2 border rounded-md bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder={
                event.m_long_drive?.id
                  ? `(${event.m_long_drive.id}) ${event.m_long_drive.name}`
                  : "輸入會員編號"
              }
            />
          </div>
          <div>
            <label className="block font-semibold text-pink-700 mb-1">遠桿獎 (女):</label>
            <input
              type="number"
              name="w_long_drive"
              value={formData.w_long_drive}
              onChange={(e) => setFormData({ ...formData, w_long_drive: e.target.value })}
              className="w-full p-2 border rounded-md bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder={
                event.w_long_drive?.id
                  ? `(${event.w_long_drive.id}) ${event.w_long_drive.name}`
                  : "輸入會員編號"
              }
            />
          </div>

          {/* Close to Center */}
          <div>
            <label className="block font-semibold text-green-700 mb-1"><span className="text-purple-700">近中獎</span> (長青):</label>
            <input
              type="number"
              name="close_to_center"
              value={formData.close_to_center}
              onChange={(e) => setFormData({ ...formData, close_to_center: e.target.value })}
              className="w-full p-2 border rounded-md bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder={
                event.close_to_center?.id
                  ? `(${event.close_to_center.id}) ${event.close_to_center.name}`
                  : "輸入會員編號"
              }
            />
          </div>

          {/* Close to Pin */}
          <div>
            <label className="block font-semibold text-blue-700 mb-1">近洞獎 (男) - 2洞:</label>
            <input
              type="number"
              name="m_close_pin_2"
              value={formData.m_close_pin_2}
              onChange={(e) => setFormData({ ...formData, m_close_pin_2: e.target.value })}
              className="w-full p-2 border rounded-md bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder={
                event.m_close_pin_2?.id
                  ? `(${event.m_close_pin_2.id}) ${event.m_close_pin_2.name}`
                  : "輸入會員編號"
              }
            />
          </div>
          <div>
            <label className="block font-semibold text-blue-700 mb-1">近洞獎 (男) - 7洞:</label>
            <input
              type="number"
              name="m_close_pin_7"
              value={formData.m_close_pin_7}
              onChange={(e) => setFormData({ ...formData, m_close_pin_7: e.target.value })}
              className="w-full p-2 border rounded-md bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder={
                event.m_close_pin_7?.id
                  ? `(${event.m_close_pin_7.id}) ${event.m_close_pin_7.name}`
                  : "輸入會員編號"
              }
            />
          </div>
          <div>
            <label className="block font-semibold text-blue-700 mb-1">近洞獎 (男) - 12洞:</label>
            <input
              type="number"
              name="m_close_pin_12"
              value={formData.m_close_pin_12}
              onChange={(e) => setFormData({ ...formData, m_close_pin_12: e.target.value })}
              className="w-full p-2 border rounded-md bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder={
                event.m_close_pin_12?.id
                  ? `(${event.m_close_pin_12.id}) ${event.m_close_pin_12.name}`
                  : "輸入會員編號"
              }
            />
          </div>
          <div>
            <label className="block font-semibold text-blue-700 mb-1">近洞獎 (男) - 16洞:</label>
            <input
              type="number"
              name="m_close_pin_16"
              value={formData.m_close_pin_16}
              onChange={(e) => setFormData({ ...formData, m_close_pin_16: e.target.value })}
              className="w-full p-2 border rounded-md bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder={
                event.m_close_pin_16?.id
                  ? `(${event.m_close_pin_16.id}) ${event.m_close_pin_16.name}`
                  : "輸入會員編號"
              }
            />
          </div>
          <div>
            <label className="block font-semibold text-pink-700 mb-1">近洞獎 (女) - 7洞:</label>
            <input
              type="number"
              name="w_close_pin_7"
              value={formData.w_close_pin_7}
              onChange={(e) => setFormData({ ...formData, w_close_pin_7: e.target.value })}
              className="w-full p-2 border rounded-md bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder={
                event.w_close_pin_7?.id
                  ? `(${event.w_close_pin_7.id}) ${event.w_close_pin_7.name}`
                  : "輸入會員編號"
              }
            />
          </div>
          <div>
            <label className="block font-semibold text-pink-700 mb-1">近洞獎 (女) - 12洞:</label>
            <input
              type="number"
              name="w_close_pin_12"
              value={formData.w_close_pin_12}
              onChange={(e) => setFormData({ ...formData, w_close_pin_12: e.target.value })}
              className="w-full p-2 border rounded-md bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder={
                event.w_close_pin_12?.id
                  ? `(${event.w_close_pin_12.id}) ${event.w_close_pin_12.name}`
                  : "輸入會員編號"
              }
            />
          </div>

          {/* Best Ball */}
          <div>
            <label className="block font-semibold text-blue-700 mb-1">BB獎 (男) - 12洞:</label>
            <input
              type="number"
              name="m_bb"
              value={formData.m_bb}
              onChange={(e) => setFormData({ ...formData, m_bb: e.target.value })}
              className="w-full p-2 border rounded-md bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder={
                event.m_bb?.id
                  ? `(${event.m_bb.id}) ${event.m_bb.name}`
                  : "輸入會員編號"
              }
            />
          </div>
          <div>
            <label className="block font-semibold text-pink-700 mb-1">BB獎 (女) - 12洞:</label>
            <input
              type="number"
              name="w_bb"
              value={formData.w_bb}
              onChange={(e) => setFormData({ ...formData, w_bb: e.target.value })}
              className="w-full p-2 border rounded-md bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder={
                event.w_bb?.id
                  ? `(${event.w_bb.id}) ${event.w_bb.name}`
                  : "輸入會員編號"
              }
            />
          </div>

          {/* Special Scores */}
          <div>
            <label className="block font-semibold text-purple-700 mb-1">小鳥獎:</label>
            <input
              type="text" // We are treating it as a string for now
              name="birdies"
              value={formData.birdies}
              onChange={(e) => setFormData({ ...formData, birdies: e.target.value })}
              className="w-full p-2 border rounded-md bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder= "輸入會員編號 (數字, 用逗號分隔)"              
            />
          </div>
          <div>
            <label className="block font-semibold text-purple-700 mb-1">老鷹獎:</label>
            <input
              type="text" // We are treating it as a string for now
              name="eagles"
              value={formData.eagles}
              onChange={(e) => setFormData({ ...formData, eagles: e.target.value })}
              className="w-full p-2 border rounded-md bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder= "輸入會員編號 (數字, 用逗號分隔)"              

            />
          </div>
          <div>
            <label className="block font-semibold text-purple-700 mb-1">信天翁獎:</label>
            <input
              type="text" // We are treating it as a string for now
              name="albatrosses"
              value={formData.albatrosses}
              onChange={(e) => setFormData({ ...formData, albatrosses: e.target.value })}
              className="w-full p-2 border rounded-md bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder= "輸入會員編號 (數字, 用逗號分隔)"              

            />
          </div>

          {/* Save Button */}
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSave}
              disabled={loading}
              className={`px-6 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "儲存中..." : "儲存"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function UpdateWinnerPage() {
  const handleSelectMenu = (menu: string) => {
    console.log("Selected menu:", menu);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white shadow-md">
        <div className="container mx-auto flex items-center justify-between p-4">
          <Header />
          <Navbar onSelectMenu={handleSelectMenu} />
        </div>
      </div>
      <Suspense fallback={<div>Loading winner data...</div>}>
        <EventContent />
      </Suspense>
    </div>
  );
}
