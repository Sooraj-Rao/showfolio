import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";

export function ImageSlider({ images, onImagesChange }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [newImageUrl, setNewImageUrl] = useState("");

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const addImage = () => {
    if (newImageUrl) {
      onImagesChange([...images, newImageUrl]);
      setNewImageUrl("");
    }
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
    if (currentIndex >= newImages.length) {
      setCurrentIndex(Math.max(0, newImages.length - 1));
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative h-64">
        {images.length > 0 ? (
          <>
            <img
              src={images[currentIndex]}
              alt={`Slide ${currentIndex}`}
              className="w-full h-full object-cover"
            />
            <Button
              className="absolute top-1/2 left-2 transform -translate-y-1/2"
              onClick={goToPrevious}
            >
              <ChevronLeft />
            </Button>
            <Button
              className="absolute top-1/2 right-2 transform -translate-y-1/2"
              onClick={goToNext}
            >
              <ChevronRight />
            </Button>
            <Button
              className="absolute top-2 right-2"
              onClick={() => removeImage(currentIndex)}
            >
              <X />
            </Button>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            No images
          </div>
        )}
      </div>
      <div className="flex space-x-2">
        <Input
          type="text"
          placeholder="Enter image URL"
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
        />
        <Button onClick={addImage}>
          <Plus className="mr-2" /> Add Image
        </Button>
      </div>
    </div>
  );
}
