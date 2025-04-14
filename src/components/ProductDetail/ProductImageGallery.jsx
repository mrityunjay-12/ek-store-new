import { useSwipeable } from "react-swipeable";

export default function ProductImageGallery({
  allImages,
  selectedImage,
  setSelectedIndex,
  selectedIndex,
  showPopup,
  setShowPopup,
}) {
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (selectedIndex < allImages.length - 1)
        setSelectedIndex((prev) => prev + 1);
    },
    onSwipedRight: () => {
      if (selectedIndex > 0) setSelectedIndex((prev) => prev - 1);
    },
    trackMouse: true,
  });

  return (
    <div>
      {/* Main image */}
      <div
        className="w-full h-[400px] sm:h-[500px] bg-white border rounded-md flex items-center justify-center cursor-pointer"
        onClick={() => setShowPopup(true)}
        {...swipeHandlers}
      >
        <img
          src={selectedImage}
          alt="Product"
          className="max-h-full max-w-full object-contain"
        />
      </div>

      {/* Thumbnails */}
      <div className="mt-4 flex gap-3 overflow-hidden">
        {allImages.slice(0, 5).map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`Thumb ${idx}`}
            onClick={() => setSelectedIndex(idx)}
            className={`h-20 w-20 rounded border object-contain cursor-pointer ${
              selectedIndex === idx ? "border-black" : "border-gray-300"
            }`}
          />
        ))}
      </div>

      {/* Popup full viewer */}
      {showPopup && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex flex-col sm:flex-row"
          onClick={() => setShowPopup(false)}
        >
          <div
            className="sm:h-full sm:w-24 w-full sm:overflow-y-auto flex sm:flex-col flex-row gap-2 p-2 bg-black bg-opacity-60"
            onClick={(e) => e.stopPropagation()}
          >
            {allImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Popup Thumb ${idx}`}
                onClick={() => setSelectedIndex(idx)}
                className={`h-16 w-16 object-contain rounded cursor-pointer border ${
                  selectedIndex === idx ? "border-white" : "border-transparent"
                }`}
              />
            ))}
          </div>

          <div
            className="flex-grow flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
            {...swipeHandlers}
          >
            <img
              src={selectedImage}
              alt="Zoom"
              className="max-h-[90%] max-w-[90%] object-contain"
            />
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 p-2 rounded-full text-xl"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
