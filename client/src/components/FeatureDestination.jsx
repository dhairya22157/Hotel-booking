import React from 'react'
import { roomsDummyData } from '../assets/assets'
import HotelCard from './HotelCard'
import Title from './Title'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

const FeatureDestination = () => {
  const { rooms: contextRooms } = useAppContext();
  const navigate = useNavigate();

  // Use dummy data if contextRooms is empty or undefined
  const rooms = contextRooms && contextRooms.length > 0 ? contextRooms : roomsDummyData;

  return rooms.length > 0 && (
    <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20'>
      <Title title='Featured Destinations' subTitle='Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences.'/>
      <div className='flex flex-wrap items-center justify-center gap-6 mt-20'>
        {rooms.slice(0, 4).map((room, index) => (
          <HotelCard room={room} index={index} key={room._id || index} />
        ))}
      </div>
      <button onClick={() => { navigate('/rooms'); window.scrollTo(0, 0); }}
        className='my-16 px-4 py-2 text-sm font-medium border border-gray-300 bg-white rounded hover:bg-gray-50 transition-all cursor-pointer'>
        View all Destinations
      </button>
    </div>
  )
}

export default FeatureDestination