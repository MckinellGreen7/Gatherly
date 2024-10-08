import React, { useEffect, useState } from 'react';

interface EventImageProps {
  image: string;
}

const EventImage: React.FC<EventImageProps> = ({ image }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (image) {
      setImageUrl(`data:image/jpeg;base64,${image}`); // Adjust MIME type as per your image format
    }
  }, [image]);

  if (!image) {
    return <div>No image available</div>;
  }

  return (
    <div className="w-full h-full">
      <img 
        src={imageUrl || ''} 
        alt="Event" 
        className="w-full h-full object-cover rounded"
      />
    </div>
  );
};

export default EventImage;
