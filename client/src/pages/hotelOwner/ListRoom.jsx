import React, { useEffect, useState } from 'react';
import { roomsDummyData } from '../../assets/assets';
import Title from '../../components/Title';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'react-hot-toast';

const ListRoom = () => {
  const [rooms, setRooms,currency] = useState(roomsDummyData);
  const { axios, user } = useAppContext();

  // Fetch rooms of the hotel owner
  const fetchRooms = async () => {
    try {
      const userId = user?.id;
      const { data } = await axios.get('/api/rooms/owner', { headers: { Authorization: `Bearer ${userId}` } });
      if (data.success) {
        setRooms(data.rooms);
      } else {
        toast.error(data.message || 'Failed to fetch rooms');
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred while fetching rooms');
    }
  };

  useEffect(() => {
    if (user) {
      fetchRooms();
    }
  }, [user]);

  // Handle toggle for room active status
  const handleToggle = async (roomId) => {
    try {
      const { data } = await axios.post(
        '/api/rooms/toggle-availability',
        { roomId },
        {
          headers: {
            Authorization: `Bearer ${user?.id}`,
          },
        }
      );
      if (data.success) {
        toast.success(data.message);
        fetchRooms(); // Refresh the room list after toggling
      } else {
        toast.error(data.message || 'Failed to update room status');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update room status');
    }
  };

  return (
    <div>
      <Title
        align="left"
        font="outfit"
        title="Room Listings"
        subTitle="view, edit, or manage all listed rooms. Keep the information up-to-date to provide the best experience for users"
      />
      <p className="text-gray-500 mt-8">All rooms</p>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="bg-gray-500">
            <tr>
              <th className="py-3 px-4 text-gray-800 font-medium text-center">Name</th>
              <th className="py-3 px-4 text-gray-800 font-medium text-center max-sm:hidden">Facility</th>
              <th className="py-3 px-4 text-gray-800 font-medium text-center">{currency} Price/night</th>
              <th className="py-3 px-4 text-gray-800 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room, index) => (
              <tr key={room._id || index} className="border-b border-gray-200">
                <td className="py-3 px-4 text-gray-700 border-t border-gray-300 text-center">{room.roomType}</td>
                <td className="py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden text-center">
                  {room.amenities.join(', ')}
                </td>
                <td className="py-3 px-4 text-gray-700 border-t border-gray-300 text-center">
                  ${room.pricePerNight}
                </td>
                <td className="py-3 px-4 border-t border-gray-300 text-center flex justify-center">
                  <label className="cursor-pointer">
                    <input
                      type="checkbox"
                      checked={room.active}
                      onChange={() => handleToggle(room._id)}
                      className="toggle-checkbox hidden"
                    />
                    <div
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ease-in-out 
                        ${room.active ? 'bg-blue-500' : 'bg-gray-300'}`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ease-in-out
                          ${room.active ? 'transform translate-x-6' : 'transform translate-x-0'}`}
                      ></div>
                    </div>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListRoom;