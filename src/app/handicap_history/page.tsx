'use client';

import { useEffect, useState } from 'react';
import mongoose from 'mongoose';
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import { calculateStrokes, setCalculatedStrokes } from "@/app/lib/database/calculateStrokes"; 

interface Member {
  _id: mongoose.Types.ObjectId;
  id: number;
  handicap: [number]
  name: string;
  sex: string;
  is_new: boolean;
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
  event_id: string;
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

interface Log {
  createdAt: string;
  message: string;
  event?: Event | null;  // Event can be undefined or null
}

export default function LogTournPage() {
  const [logs, setLogs] = useState<Log[]>([]); // Explicitly type the logs as an array of Log
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Error state to show error messages
  const [currentTime, setCurrentTime] = useState("");
  const [selectedDateArray, setSelectedDateArray] = useState<string>("");

  const [MStrokeWinner, setMStrokeWinner] = useState<any[]>([]); // State for rankings
  const [WStrokeWinner, setWStrokeWinner] = useState<any[]>([]); // State for rankings
  const [MNet1Winner, setMNet1Winner] = useState<any[]>([]); // State for rankings
  const [MNet2Winner, setMNet2Winner] = useState<any[]>([]); // State for rankings
  const [MNet3Winner, setMNet3Winner] = useState<any[]>([]); // State for rankings
  const [MNet4Winner, setMNet4Winner] = useState<any[]>([]); // State for rankings
  const [MNet5Winner, setMNet5Winner] = useState<any[]>([]); // State for rankings
  const [WNet1Winner, setWNet1Winner] = useState<any[]>([]); // State for rankings
  const [WNet2Winner, setWNet2Winner] = useState<any[]>([]); // State for rankings
  const [NewstrokeList, setNewStrokeList] = useState<any[]>([]); // State for rankings

  function extractDateFromMessage(message: string): string | null {
    const match = message.match(/\d{4}-\d{2}-\d{2}$/);
    return match ? match[0] : null;
  }

  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleString());
    };

    updateCurrentTime(); // Set time immediately
    const interval = setInterval(updateCurrentTime, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('/api/handicap_history');
        if (!res.ok) {
          throw new Error(`Error fetching logs: ${res.statusText}`);
        }

        const text = await res.text();
        if (!text) {
          setError('No logs found. The response is empty.');
          return;
        }

        let data;
        try {
          data = JSON.parse(text);
        } catch (err) {
          setError('Failed to parse the response as JSON.');
          return;
        }

        if (data.logs && Array.isArray(data.logs)) {
          const logsWithEvents = await Promise.all(
            data.logs.map(async (log: Log) => {
              const date = extractDateFromMessage(log.message); // Ensure this function returns the correct date string
              if (!date) return log;

              try {
                const res = await fetch(`/api/past_event_populate?date=${date}`);
                if (!res.ok) throw new Error('Failed to fetch event');
                const data = await res.json();
              
                // Ensure data is of type Event here before passing it to calculateStrokes
                if (!data || !data.event_id) {
                  throw new Error('Invalid event data');
                }
              
                // Use data as the event
                const result = calculateStrokes([data]); // Passing data as an array
                setCalculatedStrokes(result, {
                  setMStrokeWinner,
                  setWStrokeWinner,
                  setMNet1Winner,
                  setMNet2Winner,
                  setMNet3Winner,
                  setMNet4Winner,
                  setMNet5Winner,
                  setWNet1Winner,
                  setWNet2Winner,
                  setNewStrokeList,
                });
              
                // Return the log along with the event data
                console.log(date);
                return { ...log, event: data };  // Attach event data to log
              } catch (err) {
                console.error(`Error fetching event for ${date}:`, err);
                return log;  // Return log without event if fetching fails
              }
              
            })
          );

          setLogs(logsWithEvents); // Update state with the fetched logs and their events
        } else {
          setError('Invalid data format: logs array not found.');
        }

      } catch (err: any) {
        console.error('❌ Error fetching cron logs:', err);
        setError('An error occurred while fetching the logs.');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []); // Empty dependency array to fetch once when component mounts

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const convertToPST = (date: string): string => {
    const dateObj = new Date(date);
    dateObj.setHours(dateObj.getHours()); // Subtract 8 hours to convert to PST
    return dateObj.toLocaleString(); // Returns a human-readable format
  };

  const handleSelectMenu = (menu: string) => {
    console.log("Selected menu:", menu);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header & Navbar */}
      <div className="bg-white shadow-md relative z-50 w-full">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between border-b border-gray-300 shadow-sm p-4">
          <div className="flex justify-center md:justify-start">
            <Header />
          </div>
          <div className="flex justify-center md:justify-start md:flex-nowrap">
            <Navbar onSelectMenu={handleSelectMenu} />
          </div>
        </div>
      </div>
  
      {/* Main Content */}
      <div className="min-h-screen bg-gray-300 p-8 flex flex-col items-center">
        <div className="max-w-4xl w-full bg-white shadow-lg rounded-xl p-6">
          <h1 className="text-black text-4xl font-extrabold text-center mb-8">
            調桿歷史
          </h1>
          <h2 className="text-black text-xl text-center mb-4">
            現在時間: {currentTime}
          </h2>
  
          <section className="space-y-4">
            {loading ? (
              <p className="text-center text-xl text-gray-600">Loading logs...</p>
            ) : error ? (
              <p className="text-center text-xl text-red-600">{error}</p>
            ) : logs.length > 0 ? (
              logs.map((log, index) => (
                <div
                  key={index}
                  className="bg-gray-100 p-4 rounded-md shadow-md text-black"
                >
                  <p className="font-semibold text-purple-700">調桿生效時日： {convertToPST(log.createdAt)}</p>
                  <p>{log.message}</p>

                  {/* handicap adjustment */}
                    <div className="p-4 border rounded-lg shadow-sm bg-gray-50 mt-4">
                      <h4 className="font-bold text-left text-lg mb-2 text-blue-800">調桿一覽</h4>
                      {/* 總桿調桿 */}
                      <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
                        <h4 className="font-bold text-left text-lg mb-2 text-purple-800">總桿調桿</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                          {MStrokeWinner[0]?.name && (
                              <p className="font-bold text-blue-800">
                                {MStrokeWinner[0]?.name} ({MStrokeWinner[1] || ""}) - 1 = ({MStrokeWinner[2] || ""})
                              </p>
                            )}

                            {WStrokeWinner[0]?.name && (
                              <p className="font-bold text-red-800">
                                {WStrokeWinner[0]?.name} ({WStrokeWinner[1] || ""}) - 1 = ({WStrokeWinner[2] || ""})
                              </p>
                            )}
                        </div>
                      </div>

                      {/* 净桿調桿 */}
                      <div className="p-4 border rounded-lg shadow-sm bg-gray-50 mt-2">
                        <h4 className="font-bold text-left text-lg mb-2 text-purple-800">净桿調桿</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        {MNet1Winner[0]?.name && (
                            <p className="font-bold text-blue-800">
                              {MNet1Winner[0]?.name} ({MNet1Winner[1] || ""}) - {MNet1Winner[2] || ""} - {MNet1Winner[3] || ""} = ({MNet1Winner[4] || ""})
                            </p>
                          )}

                          {MNet2Winner[0]?.name && (
                            <p className="font-bold text-blue-800">
                              {MNet2Winner[0]?.name} ({MNet2Winner[1] || ""}) - {MNet2Winner[2] || ""} - {MNet2Winner[3] || ""} = ({MNet2Winner[4] || ""})
                            </p>
                          )}

                          {MNet3Winner[0]?.name && (
                            <p className="font-bold text-blue-800">
                              {MNet3Winner[0]?.name} ({MNet3Winner[1] || ""}) - {MNet3Winner[2] || ""} - {MNet3Winner[3] || ""} = ({MNet3Winner[4] || ""})
                            </p>
                          )}

                          {MNet4Winner[0]?.name && (
                            <p className="font-bold text-blue-800">
                              {MNet4Winner[0]?.name} ({MNet4Winner[1] || ""}) - {MNet4Winner[2] || ""} - {MNet4Winner[3] || ""} = ({MNet4Winner[4] || ""})
                            </p>
                          )}

                          {MNet5Winner[0]?.name && (
                            <p className="font-bold text-blue-800">
                              {MNet5Winner[0]?.name} ({MNet5Winner[1] || ""}) - {MNet5Winner[2] || ""} - {MNet5Winner[3] || ""} = ({MNet5Winner[4] || ""})
                            </p>
                          )}

                          {WNet1Winner[0]?.name && (
                            <p className="font-bold text-red-800">
                              {WNet1Winner[0]?.name} ({WNet1Winner[1] || ""}) - {WNet1Winner[2] || ""} - {WNet1Winner[3] || ""} = ({WNet1Winner[4] || ""})
                            </p>
                          )}

                          {WNet2Winner[0]?.name && (
                            <p className="font-bold text-red-800">
                              {WNet2Winner[0]?.name} ({WNet2Winner[1] || ""}) - {WNet2Winner[2] || ""} - {WNet2Winner[3] || ""} = ({WNet2Winner[4] || ""})
                            </p>
                          )}
                        </div>

                      </div>

                      {/* 新會員調桿 */}
                      <div className="p-4 border rounded-lg shadow-sm bg-gray-50 mt-2">
                        <h4 className="font-bold text-left text-lg mb-2 text-purple-800">新會員調桿</h4>
                        {NewstrokeList.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            {NewstrokeList.map((item, idx) => {
                              const [member, handicap, value, adjusted] = item.result;
                              return (
                                <div
                                  key={idx}
                                  className={`mt-2 ${
                                    member.sex === 'Male' ? 'font-bold text-blue-800' : 'font-bold text-red-800'
                                  }`}
                                >
                                  {member.name} {member.is_new && '⭐'} ({handicap}) - {value} = ({adjusted})
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-gray-600">無調桿數據</p>
                        )}
                      </div>
                    </div>
                  
                {/* end of show strokes */}  
                </div>
              ))
            ) : (
              <p className="text-center text-xl text-red-600">No logs found.</p>
            )}
          </section>
          
        </div>
      </div>
    </div>
  );  
}
