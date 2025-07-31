
import React from 'react';
import { GeneratedImage } from '../types';
import ImageCard from './ImageCard';

interface ImageGalleryProps {
  images: GeneratedImage[];
  selectedImageIds: Set<string>;
  onSelectImage: (id: string) => void;
  onPreviewImage: (image: GeneratedImage) => void;
  onDeleteImage: (id: string) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, selectedImageIds, onSelectImage, onPreviewImage, onDeleteImage }) => {
  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center h-full border-4 border-dashed border-gray-600 text-gray-500 p-4">
        <p>Generated images will appear here</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((img, index) => (
        <ImageCard 
          key={img.id} 
          image={img}
          index={index}
          isSelected={selectedImageIds.has(img.id)}
          onSelect={onSelectImage}
          onPreview={onPreviewImage}
          onDelete={onDeleteImage}
        />
      ))}
    </div>
  );
};

export default ImageGallery;
