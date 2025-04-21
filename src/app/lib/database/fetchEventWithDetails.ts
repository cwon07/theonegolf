export async function fetchEventWithDetails(date: string) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'; // fallback for local dev
    const apiUrl = `${baseUrl}/api/past_event_populate?date=${date}`;
    
    try {
      const res = await fetch(apiUrl);
  
      if (!res.ok) {
        throw new Error('Failed to fetch event');
      }
  
      const data = await res.json();
  
      if (!data || !data.event_id) {
        throw new Error('Invalid event data');
      }
  
      return data;  // Return the event data to be used in further processing
    } catch (err) {
      console.error(`Error fetching event for date ${date}:`, err);
      throw err;  // Re-throw error so calling function can handle it
    }
  }
  