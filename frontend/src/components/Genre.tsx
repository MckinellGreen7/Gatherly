import { FaMusic, FaCocktail, FaMountain, FaFutbol, FaChalkboardTeacher, FaLaugh, FaUsers, FaHiking, FaTheaterMasks, FaEllipsisH } from 'react-icons/fa';

const EventGenres = () => {
  const genres = [
    { name: 'Music', icon: <FaMusic />},
    { name: 'Parties', icon: <FaCocktail />},
    { name: 'Adventure', icon: <FaMountain />},
    { name: 'Sports', icon: <FaFutbol />},
    { name: 'Workshops', icon: <FaChalkboardTeacher />},
    { name: 'Comedy', icon: <FaLaugh />},
    { name: 'Conference', icon: <FaUsers />},
    { name: 'Trek', icon: <FaHiking />},
    { name: 'Theater', icon: <FaTheaterMasks />},
    { name: 'Other', icon: <FaEllipsisH />},
  ];

  return (
    <div className="container mx-auto my-10">
      <h2 className="text-xl font-bold mb-6">Browse Events by Genre</h2>
      <div className="grid grid-cols-5 gap-6">
        {genres.map((genre, index) => (
          <div key={index} className="text-center p-4 border rounded-lg hover:shadow-lg transition-shadow duration-300">
            <div className="text-5xl mb-3">{genre.icon}</div>
            <h3 className="text-xl font-semibold">{genre.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventGenres;
