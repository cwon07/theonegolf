'use client';

import { useEffect, useState } from 'react';
import mongoose from 'mongoose';
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import { calculateStrokes, setCalculatedStrokes } from "@/app/lib/database/calculateStrokes"; 
import { fetchEventWithDetails } from "@/app/lib/database/fetchEventWithDetails";


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
            Cron Job Logs
          </h1>
          <h2 className="text-black text-xl text-center mb-4">
            Current Time: {currentTime}
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
                  <p className="font-semibold text-purple-700">{convertToPST(log.createdAt)}</p>
                  <p>{log.message}</p>
  
                  {/* Display event details */}
                  {log.event && (
                    <div className="mt-4 p-4 bg-gray-200 rounded-md">
                      <h3 className="font-semibold text-lg text-purple-800">Event Details</h3>
                      <p><strong>Event ID:</strong> {log.event.event_id}</p>
                      <p><strong>Date:</strong> {log.event.date}</p>
                      <p><strong>Total Strokes (Men):</strong> {log.event.m_total_stroke?.name}</p>
                      <p><strong>Total Strokes (Women):</strong> {log.event.w_total_stroke?.name}</p>
                      {/* Add other event fields you want to display */}
                      <p><strong>Birdies:</strong> {log.event.birdies?.length}</p>
                      <p><strong>Eagles:</strong> {log.event.eagles?.length}</p>
                      {/* Add more event data here */}
                    </div>
                  )}
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
