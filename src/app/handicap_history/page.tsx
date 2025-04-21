'use client';

import { useEffect, useState } from 'react';
import Header from "../components/Header";
import Navbar from "../components/Navbar";

// Define the shape of the log object
interface Log {
  createdAt: string; // This should be a string if you're working with ISO string format
  message: string;
}

export default function LogTournPage() {
  const [logs, setLogs] = useState<Log[]>([]); // Explicitly type the logs as an array of Log
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Error state to show error messages

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('/api/handicap_history');

        if (!res.ok) {
          throw new Error(`Error fetching logs: ${res.statusText}`);
        }

        const text = await res.text(); // Fetch response as text

        if (!text) {
          setError('No logs found. The response is empty.');
          return;
        }

        // Try parsing manually
        let data;
        try {
          data = JSON.parse(text);
        } catch (err) {
          setError('Failed to parse the response as JSON.');
          return;
        }

        // Ensure that the API response contains the correct shape of logs
        if (data.logs && Array.isArray(data.logs)) {
          setLogs(data.logs); // Set the logs state
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
  }, []);

  const handleSelectMenu = (menu: string) => {
    console.log("Selected menu:", menu);
  };

  const convertToPST = (date: string): string => {
    const dateObj = new Date(date);
    dateObj.setHours(dateObj.getHours()); // Subtract 8 hours to convert to PST
    return dateObj.toLocaleString(); // Returns a human-readable format
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
                  <p className="font-semibold text-purple-700">{convertToPST(log.createdAt)}</p> {/* Use the utility function here */}
                  <p>{log.message}</p>
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
