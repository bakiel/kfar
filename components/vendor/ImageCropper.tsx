'use client';

import React, { useState, useRef, useEffect } from 'react';

interface ImageCropperProps {
  image: string;
  aspectRatio: number;
  onCropComplete: (croppedImage: string) => void;
  onCancel: () => void;
}

export default function ImageCropper({ image, aspectRatio, onCropComplete, onCancel }: ImageCropperProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 100, height: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (imageRef.current && imageLoaded) {
      drawCanvas();
    }
  }, [crop, imageLoaded]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match crop area
    canvas.width = crop.width;
    canvas.height = crop.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw cropped portion of image
    ctx.drawImage(
      image,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      crop.width,
      crop.height
    );
  };

  const handleImageLoad = () => {
    const image = imageRef.current;
    if (!image) return;

    // Calculate initial crop based on aspect ratio
    const imgAspect = image.width / image.height;
    let width, height, x, y;

    if (imgAspect > aspectRatio) {
      // Image is wider than desired ratio
      height = image.height;
      width = height * aspectRatio;
      x = (image.width - width) / 2;
      y = 0;
    } else {
      // Image is taller than desired ratio
      width = image.width;
      height = width / aspectRatio;
      x = 0;
      y = (image.height - height) / 2;
    }

    setCrop({ x, y, width, height });
    setImageLoaded(true);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - rect.left - crop.x,
      y: e.clientY - rect.top - crop.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !imageRef.current) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const image = imageRef.current;
    
    let newX = e.clientX - rect.left - dragStart.x;
    let newY = e.clientY - rect.top - dragStart.y;

    // Constrain crop area within image bounds
    newX = Math.max(0, Math.min(newX, image.width - crop.width));
    newY = Math.max(0, Math.min(newY, image.height - crop.height));

    setCrop({ ...crop, x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCrop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Get cropped image as data URL
    const croppedImage = canvas.toDataURL('image/jpeg', 0.9);
    onCropComplete(croppedImage);
  };

  const handleZoom = (factor: number) => {
    if (!imageRef.current) return;
    const image = imageRef.current;

    const newWidth = crop.width * factor;
    const newHeight = newWidth / aspectRatio;

    // Ensure crop doesn't exceed image bounds
    if (newWidth > image.width || newHeight > image.height) return;
    if (newWidth < 50 || newHeight < 50) return; // Minimum size

    // Center the crop after zoom
    const newX = crop.x - (newWidth - crop.width) / 2;
    const newY = crop.y - (newHeight - crop.height) / 2;

    setCrop({
      x: Math.max(0, Math.min(newX, image.width - newWidth)),
      y: Math.max(0, Math.min(newY, image.height - newHeight)),
      width: newWidth,
      height: newHeight
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Crop Image</h3>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-4 text-center">
            Drag the crop area to adjust. Use zoom controls to resize.
          </p>
          
          {/* Zoom Controls */}
          <div className="flex justify-center gap-3 mb-4">
            <button
              onClick={() => handleZoom(0.9)}
              className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <i className="fas fa-search-minus mr-2"></i>
              Zoom Out
            </button>
            <button
              onClick={() => handleZoom(1.1)}
              className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <i className="fas fa-search-plus mr-2"></i>
              Zoom In
            </button>
          </div>

          {/* Cropper Area */}
          <div className="relative inline-block mx-auto">
            <div
              className="relative overflow-hidden bg-gray-100"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            >
              <img
                ref={imageRef}
                src={image}
                alt="Source"
                onLoad={handleImageLoad}
                className="max-w-full max-h-[400px] opacity-30"
              />
              
              {imageLoaded && (
                <>
                  {/* Crop overlay */}
                  <div
                    className="absolute border-2 border-[#478c0b] bg-transparent"
                    style={{
                      left: crop.x,
                      top: crop.y,
                      width: crop.width,
                      height: crop.height,
                      boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)'
                    }}
                    onMouseDown={handleMouseDown}
                  >
                    {/* Corner handles */}
                    <div className="absolute -top-2 -left-2 w-4 h-4 bg-white border-2 border-[#478c0b] rounded-full"></div>
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-white border-2 border-[#478c0b] rounded-full"></div>
                    <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-white border-2 border-[#478c0b] rounded-full"></div>
                    <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border-2 border-[#478c0b] rounded-full"></div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="mt-4 text-center">
            <p className="text-sm font-semibold mb-2">Preview:</p>
            <div className="inline-block border-2 border-gray-300 rounded-lg overflow-hidden">
              <canvas
                ref={canvasRef}
                className="max-w-[200px] max-h-[200px]"
                style={{ width: '200px', height: `${200 / aspectRatio}px` }}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-6 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCrop}
            className="px-6 py-2 bg-[#478c0b] text-white rounded-lg hover:bg-[#3a7209] transition-colors"
          >
            Apply Crop
          </button>
        </div>
      </div>
    </div>
  );
}