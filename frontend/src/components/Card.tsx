import React from 'react';
import EventImage from './EventImage';

interface CardProps {
  eventName: string;
  description: string;
  venue: string;
  time: string;
  price: number;
  category: string;
  image: string;
  minAge: number;
}

const Card: React.FC<CardProps> = ({ eventName, description, venue, time, price, category, image, minAge }) => {
  return (
    <div className='flex justify-center'>
    <div className="card bg-base-100 w-full shadow-xl">
      <figure>
        <div className="w-full h-48 object-cover">
        <EventImage image={image}  />
        </div>
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {eventName}
        </h2>
        {/* <p className='break-words overflow-scroll'>{description}</p> */}
        <p><strong>Venue:</strong> {venue}</p>
        <p><strong>Time:</strong> {new Date(time).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
        <p><strong>Price:</strong> ₹{price}</p>
        <p><strong>Minimum Age:</strong> {minAge}</p>
        <div className="card-actions justify-end">
          <div className="badge badge-outline">{category}</div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Card;
