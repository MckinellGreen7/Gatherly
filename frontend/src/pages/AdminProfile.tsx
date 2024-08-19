import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const AdminProfile = () => {
  const [profile, setProfile] = useState<{ name: string; email: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }

    axios
      .get('https://backend.khandelwalshriyansh1208.workers.dev/api/v1/admin/profile', {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then((response) => {
        setProfile({
          name: response.data.name,
          email: response.data.email,
        });
      })
      .catch(() => {
        // Handle unauthorized or other errors
        navigate('/signin');
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/signin');
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
        <Navbar mode='admin' />
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Admin Profile</h1>
      <p className="mb-2">Name: {profile.name}</p>
      <p className="mb-4">Email: {profile.email}</p>
      <button
        type="button"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
    </div>
  );
};

export default AdminProfile;
