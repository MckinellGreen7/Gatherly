import React, { useEffect, useState } from 'react';
import Carousel from '../components/Caraousel';
import axios from 'axios';
import Navbar from '../components/Navbar';
import EventGenres from '../components/Genre';

interface Event {
  eventId: string;
  eventName: string;
  description: string;
  venue: string;
  time: string;
  price: number;
  category: string;
  image: string;
  minAge: number;
}

const UserEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [slides, setSlides] = useState<{ image: string; altText: string; link?: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://backend.khandelwalshriyansh1208.workers.dev/api/v1/event/allEvents', {
        headers: {
          Authorization: `${token}`,
        },
      });
  
      const data = response.data as Event[];
      setEvents(data);
  
      const images = data.slice(0, 10).map((event: Event) => ({
        image: event.image,
        altText: event.eventName,
        link: `${event.eventId}`,
      }));
  
      setSlides(images);
    } catch (error) {
      setError('Error fetching events');
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchEvents()
    console.log(events)
  }, [])
  

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-semibold text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <Navbar mode='user'/>
      <div className="">
        <Carousel slides={slides} />
        <EventGenres />
      </div>
    </div>
  );
};

export default UserEvents;
