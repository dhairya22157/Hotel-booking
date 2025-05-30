import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { assets } from '../assets/assets';
import StarRating from '../components/StarRating';
import { facilityIcons } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const RoomDetails = () => {
  const { id } = useParams();
  const { rooms, axios, navigate, user } = useAppContext();
  const [room, setRoom] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState(1);
  const [isAvailable, setIsAvailable] = useState(false);

  // Check room availability
  const checkAvailability = async () => {
    try {
      if (!checkInDate || !checkOutDate) {
        toast.error("Please select both check-in and check-out dates");
        return;
      }
      if (checkInDate >= checkOutDate) {
        toast.error("Check-out date must be greater than check-in date");
        return;
      }
      const { data } = await axios.post('/api/bookings/check-availability', {
        roomId: id,
        checkInDate,
        checkOutDate,
      });
      if (data.success) {
        setIsAvailable(true);
        toast.success("Room is available for booking");
      } else {
        setIsAvailable(false);
        toast.error("Room is not available for booking");
      }
    } catch (error) {
      console.error("Error checking availability:", error);
      toast.error(error.message || "An error occurred while checking availability");
    }
  };

  // On submit handler function to check availability and book the room
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAvailable) {
      return checkAvailability();
    }
    try {
      const { data } = await axios.post(
        '/api/bookings/book',
        {
          roomId: id,
          checkInDate,
          checkOutDate,
          guests:Number(guests),
          PaymentMethod: "pay at hotel"
        },
        {
          headers: {
            Authorization: `Bearer ${user?.id}`,
          }
        }
      );
      if (data.success) {
        toast.success(data.message || "Room booked successfully");
        navigate('/my-bookings');
        window.scrollTo(0, 0);
      } else {
        toast.error(data.message || "Failed to book room");
      }
    } catch (error) {
      console.error("Error booking room:", error);
      toast.error(error.message || "An error occurred while booking the room");
    }
  };

  useEffect(() => {
    const foundRoom = rooms.find(room => room._id === id);
    if (foundRoom) {
      setRoom(foundRoom);
      setMainImage(foundRoom.images[0]);
    }
  }, [rooms, id]);

  return room && (
    <div className='py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32'>
      {/* room details */}
      <div className='flex flex-col md:flex-row gap-2 items-start md:items-center'>
        <h1 className='text-3xl md:text-4xl font-playfair'>
          {room.hotel.name} <span className='font-inter text-sm'>{room.roomType}</span>
        </h1>
        <p className='text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full'>20% OFF</p>
      </div>
      {/* room rating */}
      <div className='flex items-center gap-2 mt-2'>
        <StarRating />
        <p className='ml-2'>200+ reviews</p>
      </div>
      {/* room address */}
      <div className='flex items-center gap-1 text-gray-500 mt-2 '>
        <img src={assets.locationIcon} alt="location-icon" />
        <span>{room.hotel.address}</span>
      </div>
      {/* room images */}
      <div className='flex flex-col lg:flex-row mt-6 gap-6'>
        <div className='lg:w-1/2 w-full'>
          <img src={mainImage} alt="room" className='w-full rounded-xl shadow-lg object-cover ' />
        </div>
        <div className='grid grid-cols-2 lg:w-1/2 w-full gap-4'>
          {room?.images.length > 1 && room.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt="room"
              className={`w-full rounded-xl shadow-lg object-cover  cursor-pointer ${mainImage === image ? 'border-2 border-orange-500' : ''} ${index !== 0 ? 'mt-4' : ''}`}
              onClick={() => setMainImage(image)}
            />
          ))}
        </div>
      </div>
      {/* room highlights */}
      <div className='flex flex-col md:flex-row md:justify-between mt-10'>
        <div className='flex flex-col'>
          <h1 className='text-3xl md:text-4xl font-playfair'>Experience Luxury like never before</h1>
          <div className='flex items-center gap-1 text-gray-500 mt-2 '>
            {room.amenities.map((item, index) => (
              <div key={index} className='flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F5F5]/70'>
                <img src={facilityIcons[item]} alt={item} className='w-5 h-5' />
                <p className='text-xs'>{item}</p>
              </div>
            ))}
          </div>
        </div>
        {/* room price */}
        <p className='text-2xl font-medium'>${room.pricePerNight} / Night</p>
      </div>
      {/* checking checkout form */}
      <form onSubmit={handleSubmit} className='flex flex-col md:flex-row gap-4 mt-10'>
        <div className='flex flex-col gap-2 w-full md:w-1/2'>
          <div className='flex flex-col'>
            <label htmlFor="checkin" className='text-sm font-inter'>Check-in</label>
            <input
              onChange={(e) => setCheckInDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              type="date"
              id='checkin'
              className='w-full border border-gray-300 rounded-lg px-4 py-2 mt-2 focus:outline-none focus:border-orange-500'
              required
            />
          </div>
          <div className='w-px h-15 bg-gray-300/70 max-md:hidden'></div>
          <div className='flex flex-col'>
            <label htmlFor="checkout" className='text-sm font-inter'>Check-out</label>
            <input
              onChange={(e) => setCheckOutDate(e.target.value)}
              min={checkInDate}
              disabled={!checkInDate}
              type="date"
              placeholder='check-out'
              id='checkout'
              className='w-full border border-gray-300 rounded-lg px-4 py-2 mt-2 focus:outline-none focus:border-orange-500'
              required
            />
          </div>
          <div className='w-px h-15 bg-gray-300/70 max-md:hidden'></div>
          <div className='flex flex-col'>
            <label htmlFor="guests" className='text-sm font-inter'>Guests</label>
            <input
              onChange={(e) => setGuests(Number(e.target.value))}
              value={guests}
              type="number"
              placeholder='1'
              id='guests'
              className='w-full border border-gray-300 rounded-lg px-4 py-2 mt-2 focus:outline-none focus:border-orange-500'
              required
              min={1}
            />
          </div>
        </div>
        <button type='submit' className='bg-orange-500 text-white px-4 py-2 rounded-lg mt-6'>
          {isAvailable ? "Book now" : "Check availability"}
        </button>
      </form>

      {/* common specifications */}
      <div className='mt-25 space-y-4'>
        {room?.CommonData?.map((item, index) => (
          <div key={index} className="flex items-start gap-2">
            <img src={item.icon} alt={`${item.title}-icon`} className="w-6.5" />
            <div>
              <p>{item.title}</p>
              <p className="text-gray-500">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className='max-w-3xl border-y border-gray-300 my-15 py-10 text-gray-500'>
        <p>
          Guests will be allocated on the ground floor according to availability. You get a comfortable Two bedroom apartment has a true city feeling. The price quoted is for two guest, at the guest slot please mark the number of guests to get the exact price for groups. The Guests will be allocated ground floor according to availability. You get the comfortable two bedroom apartment that has a true city feeling.
        </p>
      </div>
      {/* hosted by */}
      <div className='flex flex-col items-start gap-4 mt-10'>
        <div className='flex gap-4'>
          <img src={room.hotel.owner.image} alt="host" className='h-14 w-14 md:h-18 md:w-18 rounded-full' />
        </div>
        <div>
          <p className='text-lg md:text-xl'>Hosted by {room.hotel.name}</p>
          <div className='flex items-center mt-1'>
            <StarRating />
            <p className='ml-2'>200+ reviews</p>
          </div>
        </div>
        <button className='px-6 py-2.5 mt-4 rounded text-white bg-primary hover:bg-primary-dull transition-all cursor-pointer'>contact now</button>
      </div>
    </div>
  );
};

export default RoomDetails;