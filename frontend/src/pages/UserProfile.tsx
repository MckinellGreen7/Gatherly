import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventImage from '../components/EventImage';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  name: string;
  age: number;
  email: string;
  password: string;
  events: Event[];
}

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
}

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found in local storage');
        setLoading(false);
        navigate('/signup');
        return;
      }

      try {
        const response = await axios.get<User>('https://backend.khandelwalshriyansh1208.workers.dev/api/v1/user/profile', {
          headers: {
            Authorization: `${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/signup');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar mode="user" />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {user ? (
          <>
            <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">User Profile</h1>
              <p className="text-gray-600"><strong>Name:</strong> {user.name}</p>
              <p className="text-gray-600"><strong>Age:</strong> {user.age}</p>
              <p className="text-gray-600"><strong>Email:</strong> {user.email}</p>
              <button
                onClick={handleLogout}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
            <h1 className='text-3xl font-bold pb-4'>Your Past Events</h1>
            {user.events.length > 0 ? (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {user.events.map((event) => (
                    <div key={event.eventId} className="bg-white shadow-md rounded-lg overflow-hidden">
                      {event.image && (
                        <div className="w-full h-48 object-cover">
                          <EventImage image={event.image} />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900">{event.eventName}</h3>
                        <p className="text-gray-700"><strong>Description:</strong> {event.description}</p>
                        <p className="text-gray-700"><strong>Venue:</strong> {event.venue}</p>
                        <p className="text-gray-700"><strong>Time:</strong> {new Date(event.time).toLocaleString()}</p>
                        <p className="text-gray-700"><strong>Price:</strong> ₹{event.price}</p>
                        <p className="text-gray-700"><strong>Minimum Age:</strong> {event.minAge}</p>
                        <p className="text-gray-700"><strong>Category:</strong> {event.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-600">No events to show.</p>
            )}
          </>
        ) : (
          <div>No user data found.</div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
