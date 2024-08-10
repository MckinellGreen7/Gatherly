import React, { useState, useEffect } from 'react';
import EventImage from '../components/EventImage';

interface EventData {
  eventId: string;
  eventName: string;
  description: string;
  image: string | null; // Assuming image is stored as Base64 string
  // Add other fields as needed
}

interface EventDetailProps {
  eventId: string;
}

const EventDetail: React.FC<EventDetailProps> = ({ eventId }) => {
  const [eventData, setEventData] = useState<EventData | null>(null);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const response = await fetch(`http://127.0.0.1:8787/api/v1/event/f4cd2bef-e622-43ba-8139-02b245cac933`, {
          headers: {
            Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mn0.70Qup0gWyU-6DyEOQBZZjNax86LHGzOOD4wRuVmxqU0"
          }
        }); // Adjust endpoint as per your server setup
        if (response.ok) {
          const eventData: EventData = await response.json();
          setEventData(eventData);
        } else {
          console.error('Failed to fetch event data');
        }
      } catch (error) {
        console.error('Error fetching event data:', error);
      }
    }

    fetchEvent();
  }, [eventId]);

  if (!eventData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{eventData.eventName}</h2>
      <p>{eventData.description}</p>
      <EventImage image={eventData.image || ""} />
      {/* Other event details */}
    </div>
  );
};

export default EventDetail;
