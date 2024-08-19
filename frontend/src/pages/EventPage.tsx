import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast'; // Import the toast function
import EventImage from '../components/EventImage';
import Navbar from '../components/Navbar';

interface Event {
  eventId: string;
  eventName: string;
  description: string;
  venue: string;
  time: string;
  price: number;
  category: string;
  image?: string;
  contact?: string;
  minAge: number;
  attendees: { userId: string }[];
  organizerId: number;
}

const EventPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();

  const [event, setEvent] = useState<Event | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [attendeesCount, setAttendeesCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get(`https://backend.khandelwalshriyansh1208.workers.dev/api/v1/event/${eventId}`, {
      headers: {
        Authorization: token || '',
      },
    })
      .then(response => {
        const eventData = response.data;
        setEvent(eventData);
        const attendees = eventData.attendees || [];
        setAttendeesCount(attendees.length);

        const userId = localStorage.getItem('userId');
        const enrolled = attendees.some((attendee: { userId: string }) => attendee.userId === userId);
        setIsEnrolled(enrolled);
      })
      .catch(error => {
        console.error('Error fetching event data:', error);
      });
  }, [eventId]);

  const handleEnroll = () => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.post(`https://backend.khandelwalshriyansh1208.workers.dev/api/v1/event/enroll`, { eventId }, {
        headers: {
          Authorization: token,
        },
      })
        .then(() => {
          setIsEnrolled(true);
          setAttendeesCount(prevCount => prevCount + 1);

          // Display success toast notification
          toast.success('Successfully enrolled in the event! 😊');
        })
        .catch(error => {
          console.error('Error enrolling:', error);
          toast.error('Failed to enroll. Please try again.');
        });
    }
  };

  const handleUnroll = () => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.post(`https://backend.khandelwalshriyansh1208.workers.dev/api/v1/event/unroll`, { eventId }, {
        headers: {
          Authorization: token,
        },
      })
        .then(() => {
          setIsEnrolled(false);
          setAttendeesCount(prevCount => prevCount - 1);

          // Display unroll toast notification
          toast.success('Successfully unrolled from the event. 😢');
        })
        .catch(error => {
          console.error('Error unrolling:', error);
          toast.error('Failed to unroll. Please try again.');
        });
    }
  };

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar mode='user' />
      <div className="container mx-auto p-4 max-w-5xl">
        {/* Toaster component for toast notifications */}
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            className: 'text-lg p-2', // Custom classes for larger text and padding
            style: {
              fontSize: '1.125rem', // Larger font size
              padding: '16px',
              width: '28rem' // Increase the width of the toast
            },
          }}
        />

        {/* Event Name */}
        <h1 className="text-4xl font-bold text-center mb-8">{event.eventName}</h1>

        {/* Main Content Area */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Event Image */}
          {event.image && (
            <div className="md:w-1/2">
              <div className="w-full h-full object-cover rounded-lg shadow-lg">
                <EventImage image={event.image} />
              </div>
            </div>
          )}

          {/* Event Details */}
          <div className="md:w-1/2 space-y-4">
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <p className="text-xl font-semibold"><strong>Time:</strong> {new Date(event.time).toLocaleString()}</p>
              <p className="text-xl font-semibold"><strong>Venue:</strong> {event.venue}</p>
              <p className="text-xl font-semibold"><strong>Price:</strong> ₹{event.price}</p>
              <p className="text-xl font-semibold"><strong>Category:</strong> {event.category}</p>
              <p className="text-xl font-semibold"><strong>Minimum Age:</strong> {event.minAge}+</p>
              <p className="text-xl font-semibold"><strong>Attendees:</strong> {attendeesCount}</p>
            </div>

            {/* Event Description */}
            <div className="mt-4">
              <h2 className="text-2xl font-semibold mb-4">About the Event</h2>
              <p className="text-lg text-gray-700">{event.description}</p>
            </div>

            {/* Enroll/Unroll Button */}
            <button
              className={`w-full py-3 text-xl rounded-lg text-white ${isEnrolled ? 'bg-red-500' : 'bg-green-500'} transition duration-300 ease-in-out transform hover:scale-105`}
              onClick={isEnrolled ? handleUnroll : handleEnroll}
            >
              {isEnrolled ? 'Unroll' : 'Enroll'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventPage;
