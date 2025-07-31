
import React from 'react';
import { GeneratedImage } from '../types';
import DownloadIcon from './icons/DownloadIcon';
import TrashIcon from './icons/TrashIcon';

interface ImageCardProps {
  image: GeneratedImage;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onPreview: (image: GeneratedImage) => void;
  onDelete: (id: string) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, isSelected, onSelect, onPreview, onDelete }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `${image.prompt.replace(/\s+/g, '_').slice(0, 20)}.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSelectClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent preview from opening when clicking checkbox
    onSelect(image.id);
  };

  return (
    <div
      className={`bg-gray-800 border-2 p-2 group relative overflow-hidden shadow-[4px_4px_0_0_#000] cursor-pointer transition-all duration-200 ${isSelected ? 'border-cyan-400 scale-105' : 'border-black'}`}
      onClick={() => onPreview(image)}
    >
      <img src={image.url} alt={image.prompt} className="w-full h-auto aspect-square object-contain bg-gray-900 pixelated" />
      
      {/* Selection Checkbox */}
      <div 
        onClick={handleSelectClick}
        className="absolute top-2 right-2 w-6 h-6 bg-gray-900 bg-opacity-70 border-2 border-white flex items-center justify-center z-10 hover:bg-cyan-600"
      >
        {isSelected && <div className="w-3 h-3 bg-cyan-400"></div>}
      </div>

      <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
        <p className="text-white text-xs break-words">{image.prompt}</p>
        <div className="self-end flex items-center gap-2">
           <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(image.id);
            }}
            className="bg-red-500 text-white p-2 border-2 border-black hover:bg-red-600 active:translate-y-px"
            aria-label="Delete Image"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDownload();
            }}
            className="bg-cyan-500 text-white p-2 border-2 border-black hover:bg-cyan-600 active:translate-y-px"
            aria-label="Download Image"
          >
            <DownloadIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
