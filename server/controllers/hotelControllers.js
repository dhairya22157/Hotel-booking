import Hotel from "../models/Hotel.js";
import User from "../models/User.js";

export const registerHotel = async (req, res) => {
    try{
        const { name, address, contact, city } = req.body;
        const owner = req.user._id;
        // check is user already registered
        const hotel = await Hotel.findOne({ owner });
        if(hotel){
            return res.status(400).json({success: false, message: 'You have already registered a hotel'});
        }
       
        await Hotel.create({
            name,
            address,
            contact,
            city,
            owner
        });
        // update user role to hotel owner
        await User.findByIdAndUpdate(owner, { role: 'hotelOwner' });
        res.status(201).json({success: true, message: 'Hotel registered successfully'});

    }
    catch(error){
        console.error('Error registering hotel:', error);
        res.status(500).json({success: false, message: 'Server error'});
    }
}