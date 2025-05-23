import React from 'react';
import { roomsDummyData } from '../../assets/assets';
import Title from '../../components/Title';

const ListRoom = () => {
  // This component will list all the rooms added by the hotel owner
  // You can fetch the rooms from the backend and display them here
  // You can also add functionality to edit or delete rooms from this page
  // For now, let's just create a basic structure for this page
  const [rooms, setRooms] = React.useState(roomsDummyData);

  const handleToggle = (index) => {
    const updatedRooms = [...rooms];
    updatedRooms[index].active = !updatedRooms[index].active;
    setRooms(updatedRooms);
  };

  return (
    <div>
      <Title align="left" font="outfit" title="Room Listings" subTitle="view, edit, or manage all listed rooms. Keep the information up-to-date to provide the best experience for users" />
      <p className="text-gray-500 mt-8">All rooms</p>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="bg-gray-500">
            <tr>
              <th className="py-3 px-4 text-gray-800 font-medium text-center">Name</th>
              <th className="py-3 px-4 text-gray-800 font-medium text-center max-sm:hidden">Facility</th>
              <th className="py-3 px-4 text-gray-800 font-medium text-center">Price/night</th>
              <th className="py-3 px-4 text-gray-800 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-3 px-4 text-gray-700 border-t border-gray-300 text-center">{room.roomType}</td>
                <td className="py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden text-center">{room.amenities.join(', ')}</td>
                <td className="py-3 px-4 text-gray-700 border-t border-gray-300 text-center">${room.pricePerNight}</td>
                <td className="py-3 px-4 border-t border-gray-300 text-center flex justify-center">
                  <label className="cursor-pointer">
                    <input
                      type="checkbox"
                      checked={room.active}
                      onChange={() => handleToggle(index)}
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
