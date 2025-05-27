import React from 'react'
import HotelCard from './HotelCard'
import Title from './Title'
import { useAppContext } from '../context/AppContext'

const RecommendedHotels = () => {
  const { rooms, searchedCities } = useAppContext();
  const [recommended, setRecommended] = React.useState([]);

  React.useEffect(() => {
    if (searchedCities && searchedCities.length > 0) {
      const filtered = rooms.filter(room =>
        searchedCities.some(city => city.toLowerCase() === room.hotel.city.toLowerCase())
      );
      setRecommended(filtered);
    } else {
      setRecommended([]);
    }
  }, [rooms, searchedCities]);

  return recommended.length > 0 && (
    <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20'>
      <Title title='Recommended Hotels' subTitle='Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences.'/>
      <div className='flex flex-wrap items-center justify-center gap-6 mt-20'>
        {recommended.slice(0, 4).map((room, index) => (
          <HotelCard room={room} index={index} key={room._id || index} />
        ))}
      </div>
    </div>
  );
}

export default RecommendedHotels;