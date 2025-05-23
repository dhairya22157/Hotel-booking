import React from 'react'
import Title from '../../components/Title'

const AddRoom = () => {
  const [images, setImages] = React.useState({
    1: null,
    2: null,
    3: null,
    4: null,
  })

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
  })

  // Handle file selection
  const handleFileChange = (e, key) => {
    if (e.target.files?.[0]) {
      setImages((prev) => ({
        ...prev,
        [key]: e.target.files[0],
      }))
    }
  }

  return (
    <form className="mb-16">
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
            <option value="" disabled>Select Room Type</option>
            <option value="Single Bed">Single Bed</option>
            <option value="Double Bed">Double Bed</option>
            <option value="Luxury Room">Luxury Room</option>
            <option value="Family Suite">Family Suite</option>
          </select>
        </div>
        <div>
          <p className="text-gray-800 mt-4">Price <span className="text-xs">/night</span></p>
          <input
            type="number"
            value={input.pricePerNight}
            onChange={(e) => setInput({ ...input, pricePerNight: e.target.value })}
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
              onChange={(e) => setInput({
                ...input,
                amenities: {
                  ...input.amenities,
                  [key]: e.target.checked,
                },
              })}
            />
            <p>{key}</p>
          </div>
        ))}
      </div>

      <button className="bg-primary text-white px-8 py-2 rounded mt-6">
        Add Room
      </button>
    </form>
  )
}

export default AddRoom