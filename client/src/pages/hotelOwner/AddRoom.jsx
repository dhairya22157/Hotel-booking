import React from 'react'
import Title from '../../components/Title'
import { useAppContext } from '../../context/AppContext'
import { toast } from 'react-hot-toast'

const AddRoom = () => {
  const { axios,user } = useAppContext();
  const [images, setImages] = React.useState({
    1: null,
    2: null,
    3: null,
    4: null,
  });

  const [input, setInput] = React.useState({
    roomType: '',
    pricePerNight: 0,
    amenities: {
      'Free WiFi': false,
      'Free Breakfast': false,
      'Room Service': false,
      'Mountain View': false,
      'Pool Access': false,
    },
  });

  const handleFileChange = (e, key) => {
    if (e.target.files?.[0]) {
      setImages((prev) => ({
        ...prev,
        [key]: e.target.files[0],
      }));
    }
  };

  const [loading, setLoading] = React.useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (
      !input.roomType ||
      !input.pricePerNight ||
      !input.amenities ||
      !Object.values(images).some((image) => image)
    ) {
      toast.error('Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('roomType', input.roomType);
      formData.append('pricePerNight', input.pricePerNight);
      const amenities = Object.keys(input.amenities).filter(
        (key) => input.amenities[key]
      );
      formData.append('amenities', JSON.stringify(amenities));
      Object.keys(images).forEach((key) => {
        if (images[key]) {
          formData.append('images', images[key]);
        }
      });
const userId = user?.id;
const { data } = await axios.post('/api/rooms', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
    Authorization: `Bearer ${userId}`,
  },
});
      if (data.success) {
        toast.success(data.message);
        setInput({
          roomType: '',
          pricePerNight: 0,
          amenities: {
            'Free WiFi': false,
            'Free Breakfast': false,
            'Room Service': false,
            'Mountain View': false,
            'Pool Access': false,
          },
        });
        setImages({
          1: null,
          2: null,
          3: null,
          4: null,
        });
      } else {
        toast.error(data.message || 'Failed to add room');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || 'Failed to add room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="mb-16">
      <Title
        align="left"
        font="outfit"
        title="Add room"
        subTitle="Fill in the details carefully and accurate room details, pricing, 
        and amenities, to enhance the user booking experiences"
      />

      <p className="text-gray-800 mt-10">Images</p>
      <div className="grid grid-cols-2 sm:flex gap-4 my-2 flex-wrap">
        {Object.keys(images).map((key, index) => (
          <div
            key={index}
            className="w-1/12 h-12 border border-gray-300 rounded-lg flex items-center justify-center cursor-pointer"
            onClick={() => document.getElementById(`image-input-${key}`).click()}
          >
            {images[key] ? (
              <img
                src={URL.createObjectURL(images[key])}
                alt={`image-${index}`}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <p className="text-gray-500">Upload Image {index + 1}</p>
            )}
            <input
              id={`image-input-${key}`}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, key)}
              className="hidden"
            />
          </div>
        ))}
      </div>

      <div className="w-full flex max-sm:flex-col sm:gap-4 mt-4">
        <div className="flex-1 max-w-48">
          <p className="text-gray-800 mt-4">Room Type</p>
          <select
            value={input.roomType}
            onChange={(e) => setInput({ ...input, roomType: e.target.value })}
            className="border opacity-70 border-gray-300 mt-1 rounded p-2 w-full"
          >
            <option value="" disabled>
              Select Room Type
            </option>
            <option value="Single Bed">Single Bed</option>
            <option value="Double Bed">Double Bed</option>
            <option value="Luxury Room">Luxury Room</option>
            <option value="Family Suite">Family Suite</option>
          </select>
        </div>
        <div>
          <p className="text-gray-800 mt-4">
            Price <span className="text-xs">/night</span>
          </p>
          <input
            type="number"
            value={input.pricePerNight}
            onChange={(e) =>
              setInput({ ...input, pricePerNight: e.target.value })
            }
            className="border opacity-70 border-gray-300 mt-1 rounded p-2 w-full"
            placeholder="0"
          />
        </div>
      </div>

      <p className="text-gray-800 mt-4">Amenities</p>
      <div className="flex flex-col flex-wrap mt-1 gap-4 max-w-sm">
        {Object.keys(input.amenities).map((key, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={input.amenities[key]}
              onChange={(e) =>
                setInput({
                  ...input,
                  amenities: {
                    ...input.amenities,
                    [key]: e.target.checked,
                  },
                })
              }
            />
            <p>{key}</p>
          </div>
        ))}
      </div>

      <button
        className="bg-primary text-white px-8 py-2 rounded mt-6"
        disabled={loading}
      >
        {loading ? 'Adding...' : 'Add Room'}
      </button>
    </form>
  );
};

export default AddRoom;