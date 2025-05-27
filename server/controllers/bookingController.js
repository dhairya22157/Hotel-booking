
import Booking from "../models/Booking.js"
import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import transporter from "../configs/nodemailer.js";

// function to check availability of a room
const checkAvailability = async (room, checkInDate, checkOutDate) => {
  try {
    const bookings = await Booking.find({
      room,
      checkInDate: { $lte: checkOutDate },
      checkOutDate: { $gte: checkInDate },
    });
    return bookings.length === 0;
  } catch (error) {
    console.error('Error checking room availability:', error);
    throw new Error('Server error while checking room availability');
  }
};

// api to check availability of a room
// POST /api/bookings/check-availability
export const checkAvailabilityAPI = async (req, res) => {
  try {
    const { roomId, checkInDate, checkOutDate } = req.body;
    const isAvailable = await checkAvailability(roomId, checkInDate, checkOutDate);
    res.json({ success: true, isAvailable });
  } catch (error) {
    console.error('Error checking room availability:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// api to create new booking
// POST /api/bookings/book
export const createBooking = async (req, res) => {
  try {
    console.log('Booking request body:', req.body);
    console.log('User:', req.user);

    const { roomId, checkInDate, checkOutDate, guests } = req.body;
    if (!roomId || !checkInDate || !checkOutDate || !guests) {
      return res.status(400).json({ success: false, message: 'Missing required booking fields.' });
    }
    if (!req.user || !req.user._id) {
      return res.status(400).json({ success: false, message: 'User not authenticated.' });
    }

    const isAvailable = await checkAvailability(roomId, checkInDate, checkOutDate);
    if (!isAvailable) {
      return res.status(400).json({ success: false, message: 'Room is not available for the selected dates' });
    }

    const roomData = await Room.findById(roomId).populate('hotel');
    if (!roomData) {
      return res.status(400).json({ success: false, message: 'Room not found.' });
    }

    if (new Date(checkInDate) >= new Date(checkOutDate)) {
      return res.status(400).json({ success: false, message: 'Check-out date must be after check-in date.' });
    }

    let totalPrice =
      roomData.pricePerNight *
      ((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24));

    const booking = await Booking.create({
      user: req.user._id,
      room: roomId,
      hotel: roomData.hotel._id,
      guests: +guests,
      checkInDate: new Date(checkInDate),
      checkOutDate: new Date(checkOutDate),
      totalPrice,
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: req.user.email,
      subject: 'Booking Confirmation',
      html:
        `<h1>Booking Confirmation</h1>
          <p>Dear ${req.user.username || req.user.name || req.user.email},</p>
          <p>Thank you for your booking! Here are your details</p>
          <ul>
            <li><strong>Booking ID:</strong> ${booking._id}</li>
            <li><strong>Hotel Name:</strong> ${roomData.hotel.name}</li>
            <li><strong>Location:</strong> ${roomData.hotel.address}</li>
            <li><strong>Check-in Date:</strong> ${new Date(checkInDate).toLocaleDateString()}</li>
            <li><strong>Check-out Date:</strong> ${new Date(checkOutDate).toLocaleDateString()}</li>
            <li><strong>Total Price:</strong> $${totalPrice.toFixed(2) || process.env.CURRENCY}</li>
          </ul>
         <p>Thank you for choosing us!</p>`
    }

    await transporter.sendMail(mailOptions);

    res.status(201).json({ success: true, booking });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// api to get all bookings of a user
// GET /api/bookings/user
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user._id;
    const bookings = await Booking.find({ user: userId })
      .populate('room hotel')
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// api to get all bookings of a hotel
// GET /api/bookings/hotel
export const getHotelBookings = async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ owner: req.user._id });
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found' });
    }
    const bookings = await Booking.find({ hotel: hotel._id })
      .populate('room hotel user')
      .sort({ createdAt: -1 });

    // total bookings
    const totalBookings = bookings.length;
    // total revenue
    const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0);

    res.json({
  success: true,
  dashboard: { totalBookings, totalRevenue, bookings },
});
  } catch (error) {
    console.error('Error fetching hotel bookings:', error);
    res.json({ success: false, message: "failed to fetch info " });
  }
};