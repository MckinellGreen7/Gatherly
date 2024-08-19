import Card from '../components/Card';
import Navbar from '../components/Navbar';
import { useState, useEffect } from 'react';
import axios from 'axios';
import AddEditEvent from '../components/AddEditEvent';

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

const AdminEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);


    const fetchAdminEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get(
          'https://backend.khandelwalshriyansh1208.workers.dev/api/v1/event/adminEvents',
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        setEvents(response.data.events);
      } catch (error: any) {
        setError(error.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

useEffect(() => {
    fetchAdminEvents();
}, []);

  const onSave = () => {
    setIsModalOpen(false);
    fetchAdminEvents()
  };

  const addEvent = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div role="status">
          <svg
            aria-hidden="true"
            className="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <Navbar mode='admin'/>
      <div className="p-4">
        <div className="lg:px-24 px-24">
          <h1 className="text-2xl font-bold mb-4">Your Events</h1>
          {events.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <Card
                  key={event.eventId}
                  eventName={event.eventName}
                  description={event.description}
                  venue={event.venue}
                  time={event.time}
                  price={event.price}
                  category={event.category}
                  image={event.image}
                  minAge={event.minAge}
                />
              ))}
            </div>
          ) : (
            <p>No events found</p>
          )}
        </div>
      </div>

      <button
        type="button"
        className="fixed bottom-10 right-10 text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-lg px-6 py-4 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        onClick={addEvent}
      >
        Add Event
      </button>

      {/* Render AddEditEvent component when the modal is open */}
      {isModalOpen && <AddEditEvent mode="Add Event" onSave={onSave} isModal={isModalOpen} closeModal={closeModal}/>}
    </div>
  );
};

export default AdminEvents;
