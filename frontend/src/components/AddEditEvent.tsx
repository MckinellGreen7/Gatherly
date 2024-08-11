import React, { useState } from 'react';
import axios from 'axios';

interface Event {
    eventId: string;
    eventName: string;
    description: string;
    venue: string;
    time: string;
    price: number;
    category: string;
    image: File | null;
    minAge: number;
  }

interface AddEditEventProps {
    mode: string;
    event?: Event;
    onSave: () => void;
    isModal: boolean;
    closeModal: () => void;
}

const AddEditEvent: React.FC<AddEditEventProps> = ({mode, event, onSave, isModal, closeModal }) => {
  const [eventData, setEventData] = useState<Event>({
    eventId: event?.eventId || '',
    eventName: event?.eventName || '',
    description: event?.description || '',
    venue: event?.venue || '',
    time: event?.time || '',
    price: event?.price || 0,
    category: event?.category || '',
    image: null,
    minAge: event?.minAge || 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEventData({
      ...eventData,
      [name]: name === 'price' || name === 'minAge' ? Number(value) : value,
    });
  };

  const handleFileChange = (e: any) => {
    setEventData({ ...eventData, image: e.target.files[0] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(eventData)
    try {

      const formData = new FormData();
      formData.append("eventId", eventData.eventId);
      formData.append("eventName", eventData.eventName);
      formData.append("description", eventData.description);
      formData.append("venue", eventData.venue);
      formData.append("time", eventData.time);
      formData.append("price", eventData.price.toString());
      formData.append("category", eventData.category);
      if (eventData.image) {
        formData.append("image", eventData.image);
      }
      formData.append("minAge", eventData.minAge.toString());
      const token = localStorage.getItem('token');
  
      const response = await axios.post(
        'https://backend.khandelwalshriyansh1208.workers.dev/api/v1/event/addEvent',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `${token}`, // Include the authorization token
          },
        }
      );
  
      console.log('Event added successfully:', response.data);
  
      onSave()
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  return (
    <div>
      <div
        id="crud-modal"
        aria-hidden="true"
        className={`${isModal ? 'flex' : 'hidden'} overflow-y-auto overflow-x-hidden fixed items-center justify-center z-50 w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}
      >
        <div className="relative p-4 w-full max-w-lg max-h-full">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {mode==='Add Event' ? 'Add New Event' : 'Edit Event'}
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-toggle="crud-modal"
                onClick={closeModal}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            <form className="p-4 md:p-5" onSubmit={handleSubmit}>
              <div className="grid gap-4 mb-4 grid-cols-2">
                <div className="col-span-2">
                  <label
                    htmlFor="eventName"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Event Name
                  </label>
                  <input
                    type="text"
                    name="eventName"
                    id="eventName"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Type event name"
                    value={eventData.eventName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="venue"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Venue
                  </label>
                  <input
                    type="text"
                    name="venue"
                    id="venue"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Event venue"
                    value={eventData.venue}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="time"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Time
                  </label>
                  <input
                    type="datetime-local"
                    name="time"
                    id="time"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    value={eventData.time}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="price"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Event price"
                    value={eventData.price}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="category"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    value={eventData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select category</option>
                    <option value="Music">Music</option>
                    <option value="Sports">Sports</option>
                    <option value="Conference">Conference</option>
                    <option value="Art">Art</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="description"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Write event description here"
                    value={eventData.description}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-span-2">
                    <label
                    htmlFor="image"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                    Image Upload
                    </label>
                    <input
                    type="file"
                    name="image"
                    id="image"
                    accept=".jpg,.jpeg,.png"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    onChange={handleFileChange}
                    required
                    />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="minAge"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Minimum Age
                  </label>
                  <input
                    type="number"
                    name="minAge"
                    id="minAge"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Minimum age requirement"
                    value={eventData.minAge}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onClick={handleSubmit}
              >
                <svg
                  className="me-1 -ms-1 w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {event ? 'Update Event' : 'Add New Event'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditEvent;

