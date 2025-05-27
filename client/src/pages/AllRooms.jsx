import React, { useMemo } from 'react';
import { assets, facilityIcons } from '../assets/assets';
import StarRating from '../components/StarRating';
import { useAppContext } from '../context/AppContext';
import { useLocation } from 'react-router-dom';

const CheckBox = ({ label, selected, onChange }) => (
  <label className='flex gap-3 items-center cursor-pointer mt-2 text-sm'>
    <input
      type="checkbox"
      checked={selected}
      onChange={e => onChange(e.target.checked, label)}
    />
    <span className='font-light select-none'>{label}</span>
  </label>
);

const RadioButton = ({ label, selected, onChange }) => (
  <label className='flex gap-3 items-center cursor-pointer mt-2 text-sm'>
    <input
      type="radio"
      name='sortOption'
      checked={selected}
      onChange={() => onChange(label)}
    />
    <span className='font-light select-none'>{label}</span>
  </label>
);

const AllRooms = () => {
  const { rooms = [], navigate, currency = "$" } = useAppContext();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const destination = params.get('destination') || '';

  const [openFilters, setOpenFilters] = React.useState(false);
  const [selectedRoomTypes, setSelectedRoomTypes] = React.useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = React.useState([]);
  const [selectedSortOption, setSelectedSortOption] = React.useState('');

  const roomTypes = [
    "Single Bed",
    "Double Bed",
    "Luxury Room",
    "Family suite",
  ];
  const priceRanges = [
    "0 to 500",
    "500 to 1000",
    "1000 to 2000",
    "2000 to 3000",
  ];
  const sortOptions = [
    "Price: Low to High",
    "Price: High to Low",
    "Newest first"
  ];

  // Filter functions
  const matchesRoomType = (room) =>
    selectedRoomTypes.length === 0 || selectedRoomTypes.includes(room.roomType);

  const matchesPriceRange = (room) =>
    selectedPriceRanges.length === 0 ||
    selectedPriceRanges.some(range => {
      const cleanRange = range.replace(currency, '').trim();
      const [min, max] = cleanRange.split(' to ').map(Number);
      const price = room.pricePerNight;
      return price >= min && price <= max;
    });

  // Filter by destination from URL
  const matchesDestination = (room) => {
    if (!destination) return true;
    return room.hotel.city.toLowerCase().includes(destination.toLowerCase());
  };

  // Sort function
  const sortRooms = (a, b) => {
    if (selectedSortOption === "Price: Low to High") {
      return a.pricePerNight - b.pricePerNight;
    }
    if (selectedSortOption === "Price: High to Low") {
      return b.pricePerNight - a.pricePerNight;
    }
    if (selectedSortOption === "Newest first") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  };

  // Filter and sort rooms
  const filteredRooms = useMemo(() => {
    return rooms
      .filter(room =>
        matchesDestination(room) &&
        matchesRoomType(room) &&
        matchesPriceRange(room)
      )
      .sort(sortRooms);
  }, [rooms, selectedRoomTypes, selectedPriceRanges, selectedSortOption, destination]);

  // Clear all filters
  const clearFilters = () => {
    setSelectedRoomTypes([]);
    setSelectedPriceRanges([]);
    setSelectedSortOption('');
    // No need to clear destination, as it's from the URL
  };

  // Checkbox handlers
  const handleCheckBoxChange = (checked, label) => {
    setSelectedRoomTypes(prev =>
      checked ? [...prev, label] : prev.filter(item => item !== label)
    );
  };

  const handlePriceRangeChange = (checked, label) => {
    setSelectedPriceRanges(prev =>
      checked ? [...prev, label] : prev.filter(item => item !== label)
    );
  };

  // Radio handler
  const handleRadioChange = (label) => {
    setSelectedSortOption(label);
  };

  return (
    <div className="px-4 md:px-16 lg:px-24 xl:px-32 pt-20 flex flex-col lg:flex-row gap-8">
      {/* Left Section: Rooms */}
      <div className="flex flex-col w-full lg:w-3/4">
        {/* Heading and Description */}
        <div className="flex flex-col items-start text-left mb-10">
          <h1 className="font-playfair text-4xl md:text-[40px]">Hostel Rooms</h1>
          <p className="text-sm md:text-base text-gray-500/90 mt-2">
            Take advantage of our limited-time offers and special
          </p>
        </div>

        {/* Mapping Room Cards */}
        {filteredRooms.map((room) => (
          <div
            key={room._id}
            className="flex flex-col md:flex-row items-center md:items-start py-10 gap-6 border-b border-gray-300 last:pb-30 last:border-0"
          >
            {/* Room Image */}
            <img
              onClick={() => { navigate(`/rooms/${room._id}`); window.scrollTo(0, 0); }}
              src={room.images[0]}
              alt="hotel-img"
              title="view room details"
              className="max-h-60 w-full md:w-1/2 rounded-xl shadow-lg object-cover cursor-pointer"
            />

            {/* Room Details */}
            <div className="md:w-1/2 flex flex-col gap-2">
              <p className="text-gray-500">{room.hotel.city}</p>
              <p
                onClick={() => { navigate(`/rooms/${room._id}`); window.scrollTo(0, 0); }}
                className="text-gray-800 text-3xl font-playfair cursor-pointer"
              >
                {room.hotel.name}
              </p>

              {/* Rating and Reviews */}
              <div className="flex items-center gap-2">
                <StarRating />
                <p className="ml-2">200+ reviews</p>
              </div>

              {/* Address */}
              <div className="flex items-center gap-1 text-gray-500 mt-2 text-sm">
                <img src={assets.locationIcon} alt="location-icon" />
                <span>{room.hotel.address}</span>
              </div>

              {/* Room Amenities */}
              <div className="flex flex-wrap items-center mt-3 mb-6 gap-4">
                {room.amenities.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F5F5]/70"
                  >
                    <img src={facilityIcons[item]} alt={item} className="w-5 h-5" />
                    <p className="text-xs">{item}</p>
                  </div>
                ))}
              </div>

              {/* Price per night */}
              <div>
                <p className="text-xl font-medium text-gray-700">${room.pricePerNight} /night</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right Section: Filters */}
      <div className='bg-white w-80 border border-gray-300 text-gray-600 max-lg:mb-8 min-lg:mt-16'>
        <div className={`flex items-center justify-between px-5 py-2.5 border-b border-gray-300`}>
          <p className='text-base font-medium text-gray-800'>Filters</p>
          <div className='text-xs cursor-pointer flex items-center justify-between px-4 py-2'>
            <span onClick={() => setOpenFilters(!openFilters)} className='lg:hidden'>
              {openFilters ? 'HIDE' : 'SHOW'}
            </span>
            <span className='hidden lg:block' onClick={clearFilters}>CLEAR</span>
          </div>
        </div>
        <div className={`${openFilters ? 'h-auto' : 'h-0 lg:h-auto'} overflow-hidden transition-all duration-700`}>
          <div className='px-5 pt-5'>
            <p className='font-medium text-gray-800 pb-2'>Popular filters</p>
            {roomTypes.map((room, index) => (
              <CheckBox
                key={index}
                label={room}
                selected={selectedRoomTypes.includes(room)}
                onChange={handleCheckBoxChange}
              />
            ))}
          </div>
          <div className='px-5 pt-5'>
            <p className='font-medium text-gray-800 pb-2'>Price range</p>
            {priceRanges.map((range, index) => (
              <CheckBox
                key={index}
                label={`${currency} ${range}`}
                selected={selectedPriceRanges.includes(`${currency} ${range}`)}
                onChange={handlePriceRangeChange}
              />
            ))}
          </div>
          <div className='px-5 pt-5 pb-7'>
            <p className='font-medium text-gray-800 pb-2'>Sort By</p>
            {sortOptions.map((option, index) => (
              <RadioButton
                key={index}
                label={option}
                selected={selectedSortOption === option}
                onChange={handleRadioChange}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllRooms;