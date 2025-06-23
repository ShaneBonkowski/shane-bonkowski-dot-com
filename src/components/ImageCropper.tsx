"use client";

import React, { useRef, useState, useEffect } from "react";
import NextImage from "next/image"; // need to rename so that it doesnt override the Image() namespace

interface ImageCropperProps {
  src: string;
  cropX?: number; // X position in px on the img to start crop. Optional - will auto-detect if not provided
  cropY?: number; // Y position in px on the img to start crop. Optional - will auto-detect if not provided
  cropWidth?: number; // Width of crop area in px.. how far RIGHT to go from cropX. Optional - will auto-detect if not provided
  cropHeight?: number; // Height of crop area in px.. how far DOWN to go from cropY. Optional - will auto-detect if not provided
  outputWidth?: number; // Desired output width in px (leave undefined to use cropWidth or auto-detected width)
  outputHeight?: number; // Desired output height in px  (leave undefined to use cropHeight or auto-detected height)
  autoCrop?: boolean; // Enable auto-cropping based on transparent pixels
  padding?: number; // Add padding px around detected area for autoCrop
  alt?: string;
  className?: string;
  draggable?: boolean;
}

/**
 * ImageCropper component crops an image from a given URL and renders it at a specified size.
 * It uses a canvas to perform the cropping operation and returns the cropped image as a data URL.
 * @param {ImageCropperProps} props - The properties for the ImageCropper component.
 * @returns {JSX.Element} The rendered ImageCropper component.
 */
const ImageCropper: React.FC<ImageCropperProps> = ({
  src,
  cropX,
  cropY,
  cropWidth,
  cropHeight,
  outputWidth,
  outputHeight,
  autoCrop = false,
  padding = 0,
  alt = "Cropped image",
  className = "",
  draggable = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  useEffect(() => {
    // Initialize the image and canvas
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = src;

    // When the image loads, perform the cropping
    image.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      let finalCropX: number;
      let finalCropY: number;
      let finalCropWidth: number;
      let finalCropHeight: number;

      // Function to detect non-transparent bounds... Useful for cropping
      // just to what is visible on a mostly transparent image.
      const detectBounds = (imageData: ImageData) => {
        const { data, width, height } = imageData;
        let minX = width,
          minY = height,
          maxX = 0,
          maxY = 0;

        // Scan all pixels to find bounds of non-transparent content
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const alpha = data[(y * width + x) * 4 + 3]; // Alpha channel

            if (alpha > 0) {
              // Non-transparent pixel found
              minX = Math.min(minX, x);
              minY = Math.min(minY, y);
              maxX = Math.max(maxX, x);
              maxY = Math.max(maxY, y);
            }
          }
        }

        // Add padding and ensure bounds are valid
        minX = Math.max(0, minX - padding);
        minY = Math.max(0, minY - padding);
        maxX = Math.min(width - 1, maxX + padding);
        maxY = Math.min(height - 1, maxY + padding);

        return {
          x: minX,
          y: minY,
          width: maxX - minX + 1,
          height: maxY - minY + 1,
        };
      };

      // Crop the image based on provided or detected bounds
      if (autoCrop) {
        // Create temporary canvas to analyze the image
        const tempCanvas = document.createElement("canvas");
        const tempCtx = tempCanvas.getContext("2d");
        tempCanvas.width = image.width;
        tempCanvas.height = image.height;

        // Draw full image to temp canvas
        tempCtx?.drawImage(image, 0, 0);

        // Get image data and detect bounds
        const imageData = tempCtx?.getImageData(
          0,
          0,
          image.width,
          image.height
        );
        if (imageData) {
          const bounds = detectBounds(imageData);
          finalCropX = bounds.x;
          finalCropY = bounds.y;
          finalCropWidth = bounds.width;
          finalCropHeight = bounds.height;
        } else {
          console.error("Failed to get image data for auto-cropping.");
          return;
        }
      } else {
        // Use provided crop values
        finalCropX = cropX ?? 0;
        finalCropY = cropY ?? 0;
        finalCropWidth = cropWidth ?? image.width;
        finalCropHeight = cropHeight ?? image.height;
      }

      // Set output dimensions
      const finalOutputWidth = outputWidth ?? finalCropWidth;
      const finalOutputHeight = outputHeight ?? finalCropHeight;

      // Set canvas size and draw cropped image
      canvas.width = finalOutputWidth;
      canvas.height = finalOutputHeight;

      ctx.drawImage(
        image,
        finalCropX,
        finalCropY,
        finalCropWidth,
        finalCropHeight,
        0,
        0,
        finalOutputWidth,
        finalOutputHeight
      );

      const croppedDataUrl = canvas.toDataURL("image/webp", 0.9);
      setCroppedImage(croppedDataUrl);
    };

    image.onerror = () => {
      console.error("Failed to load image:", src);
    };
  }, [
    src,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    outputWidth,
    outputHeight,
    autoCrop,
    padding,
  ]);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{ display: "none" }}
        id="leftover-image-cropper-canvas-tool"
      />
      {croppedImage && (
        <NextImage
          src={croppedImage}
          alt={alt}
          width={outputWidth ?? cropWidth ?? 100}
          height={outputHeight ?? cropHeight ?? 100}
          unoptimized
          className={className}
          draggable={draggable}
        />
      )}
    </>
  );
};

export default ImageCropper;
