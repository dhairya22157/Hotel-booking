import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';
import { toast } from 'react-hot-toast';

// Set the base URL from .env
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken } = useAuth();

  const [isOwner, setIsOwner] = useState(false);
  const [showHotelReg, setShowHotelReg] = useState(false);
  const [searchedCities, setSearchedCities] = useState([]);
  const [rooms, setRooms] = useState([]); // Added for room management

  const fetchRooms = async () => {
  try {
    const { data } = await axios.get('/api/rooms');
    if (data.success) {
      setRooms(data.rooms);
    } else {
      toast.error(data.message || 'Failed to fetch rooms');
    }
  } catch (error) {
    toast.error(error.message || 'An error occurred while fetching rooms');
  }
};



  // Fetch the user's role and searched cities from the backend
  const fetchUser = async () => {
    try {
      const userId = user?.id;
if (!userId) {
  console.warn('No user ID found. User might not be logged in.');
  return;
}
const { data } = await axios.get('/api/user', {
  headers: { Authorization: `Bearer ${userId}` },
});

      if (data.success) {
        // The backend must return `role = "hotelOwner"` for owners
        setIsOwner(data.role === 'hotelOwner');
        setSearchedCities(data.recentSearchedCities);
      } else {
        console.warn('User fetch unsuccessful, retrying in 5s...');
        setTimeout(fetchUser, 5000);
      }
    } catch (error) {
        toast.error(error.message);
    }
  };

  useEffect(() => {
  if (user) {
    fetchUser();
  }
}, [user]);

useEffect(() => {
  if (isOwner && user) {
    fetchRooms();
  }
}, [isOwner, user]);

  const value = {
    currency,
    navigate,
    user,
    getToken,
    isOwner,
    setIsOwner,
     axios,
    showHotelReg,
    setShowHotelReg,
    searchedCities,
    setSearchedCities,
    rooms,
    setRooms,

    // Function to check if the user is a hotel owner
    checkIfOwner: async () => {
      try {
        const token = await getToken();
        const response = await axios.get('/owner/check', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsOwner(response.data.isOwner);
      } catch (error) {
        console.error('Error checking owner status:', error);
      }
    },

    // Function to toggle hotel registration modal
    toggleHotelReg: () => {
      setShowHotelReg((prev) => !prev);
    },
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);