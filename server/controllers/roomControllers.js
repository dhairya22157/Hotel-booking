// api to create a new room for a hotel
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import cloudinary from "../configs/cloudinary.js";
export const createRoom = async (req, res) => {
    try {
        const { roomType, pricePerNight, amenities} = req.body;
        const hotel = await Hotel.findOne({ owner: req.user._id });
        if (!hotel) {
            return res.status(404).json({ success: false, message: 'Hotel not found' });
        }
        // upload images to cloudinary
        const uploadImages = req.files.map(async (file) => {
            const result = await cloudinary.uploader.upload(file.path);
            return result.secure_url;
        });
        // wait for all uploads to complete
        const images = await Promise.all(uploadImages);

        await Room.create({
            hotel: hotel._id,
            roomType,
            pricePerNight: +pricePerNight,
            amenities: JSON.parse(amenities),
            images,
        });
        res.json({ success: true, message: 'Room created successfully' });
    } catch (error) {
        console.error('Error creating room:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
} 
// api to get all rooms
export const getRooms = async (req,res)=>{
    try{
        const rooms = await Room.find({isAvailable: true}).populate({
            path: 'hotel',
            populate: {
                path: 'owner',
                select: 'image'
            }
        }).sort({createdAt: -1})
        res.json({success: true, rooms});
    }catch(error){
        console.error('Error fetching rooms:', error);
        res.json({success: false, message: error.message});
    }
} 
// api to get all rooms for a specific hotel
export const getOwnerRooms = async (req,res)=>{
    try{
        const hotel = await Hotel.findOne({owner: req.user._id});
        if(!hotel){
            return res.status(404).json({success: false, message: 'Hotel not found'});
        }
        const rooms = await Room.find({hotel: hotel._id.toString()}).populate("hotel");
        res.json({success: true, rooms});
    }
    catch(error){
        console.error('Error fetching rooms:', error);
        res.json({success: false, message: error.message});
    }
}

// api to toggle availability of a room fot a speicific hotel
export const toggleRoomAvailability = async (req,res)=>{
    try{
        const { roomId } = req.body;
        const room = await Room.findById(roomId);
        if(!room){
            return res.status(404).json({success: false, message: 'Room not found'});
        }
        room.isAvailable = !room.isAvailable;
        await room.save();
        res.json({success: true, message: 'Room availability updated successfully'});
    }catch(error){
        console.error('Error updating room availability:', error);
        res.json({success: false, message: error.message});
    }
}
