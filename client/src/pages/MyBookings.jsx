import React from 'react';
import Title from '../components/Title';
import { assets, userBookingsDummyData } from '../assets/assets';

const MyBookings = () => {
  const [bookings, setBookings] = React.useState(userBookingsDummyData);

  return (
    <div className="py-28 md:py-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32">
      <Title
        title="My Bookings"
        subtitle="Manage your bookings and stay updated with your travel plans."
        align="left"
      />

      <div className="max-w-6xl w-full text-gray-800">
        <div className="hidden md:grid md:grid-cols-[3fr_2fr+1fr] w-full border-border-gray-300 font-medium text-base py-3">
          <div className="w-1/3">Hotels</div>
          <div className="w-1/3">Date & Timings</div>
          <div className="w-1/3">Payment</div>
        </div>

        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="grid grid-cols-[3fr_2fr+1fr] w-full border-border-gray-300 font-medium text-base py-3 border-b last:border-0"
          >
            <div className="flex gap-4 items-center">
              {/* Image Section */}
              <img
                src={booking.room.images[0]}
                alt="hotel-img"
                className="w-44 rounded shadow object-cover"
              />

              {/* Booking Details */}
              <div className="flex flex-col gap-1.5">
                <p className="text-2xl font-playfair">
                  {booking.room.hotel.name}
                  <span className="font-inter text-sm"> {booking.room.roomType}</span>
                </p>
                <div className="flex items-center gap-1 text-gray-500 text-sm ">
                  <img
                    src={assets.locationIcon}
                    alt="location-icon"
                    className="w-5 h-5 object-contain" // Smaller icon size
                  />
                  <span>{booking.room.hotel.address}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500 text-sm ">
                  <img
                    src={assets.guestsIcon}
                    alt="guests-icon"
                    className="w-5 h-5 object-contain" // Smaller icon size
                  />
                  <span>Guests: {booking.guests}</span>
                </div>
                <p className="text-base">Total: ${booking.totalPrice}</p>
              </div>
            </div>

            <div className="flex flex-row md:items-center md:gap-12 mt-3 gap-8">
              <div>
                <p>Check-In:</p>
                <p className="text-gray-500 text-sm">
                  {new Date(booking.checkInDate).toDateString()}
                </p>
              </div>
              <div>
                <p>Check-Out:</p>
                <p className="text-gray-500 text-sm">
                  {new Date(booking.checkOutDate).toDateString()}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-start justify-center pt-3">
              <div className="flex items-center gap-2">
                <div
                  className={`h-3 w-3 rounded-full ${
                    booking.isPaid ? 'bg-green-500' : 'bg-red-500'
                  }`}
                ></div>
                <p
                  className={`text-sm ${
                    booking.isPaid ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {booking.isPaid ? 'Paid' : 'Not Paid'}
                </p>
              </div>
              {!booking.isPaid && (
                <button className="px-4 py-1.5 mt-4 text-xs border border-gray-400 rounded-full hover:bg-gray-50 transition-all cursor-pointer">
                  Pay Now
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
