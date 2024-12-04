import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useDrop } from 'react-dnd';

interface DroppedItem {
  id: string;
  imageUrl: string; // Original image with background
  partType: 'head' | 'body' | 'leftArm' | 'rightArm' | 'legs';
}

const CanvasArea: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedParts, setSelectedParts] = useState<DroppedItem[]>([]);
  const [finalCharacter, setFinalCharacter] = useState<DroppedItem[] | null>(null);

  const [, drop] :any= useDrop({
    accept: 'character',
    drop: (item: DroppedItem) => {
      setSelectedParts((prevParts) =>
        prevParts.find((part) => part.partType === item.partType)
          ? prevParts.map((part) =>
              part.partType === item.partType ? { ...item } : part
            )
          : [...prevParts, item]
      );
    },
  });

  const assembleCharacter = () => {
    const positions:any = {
      head: { x: 260, y: 50, width: 80, height: 80 },
    };

    const assembled = selectedParts
      .filter((part) => part.partType === 'head') // Only include the head
      .map((part) => ({
        ...part,
        ...positions[part.partType],
      }));
    setFinalCharacter(assembled);
  };

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);

    const itemsToDraw = finalCharacter || selectedParts;

    itemsToDraw.forEach((item:any) => {
      if (item.partType === 'head') {
        const img = new Image();
        img.src = item.imageUrl;
        img.onload = () => {
          // Crop the face part dynamically
          const cropX = 100; // Adjust crop starting x-coordinate
          const cropY = 50; // Adjust crop starting y-coordinate
          const cropWidth = 200; // Adjust width for face cropping
          const cropHeight = 200; // Adjust height for face cropping

          const targetWidth = 80;
          const targetHeight = 80;

          context.drawImage(
            img,
            cropX,
            cropY,
            cropWidth,
            cropHeight,
            item?.x,
            item?.y,
            targetWidth,
            targetHeight
          );
        };
      }
    });
  }, [selectedParts, finalCharacter]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-100">
      <div
        className="flex-1 flex justify-center items-center bg-gray-200 rounded-lg shadow-lg p-4"
        ref={drop}
      >
        <canvas
          ref={canvasRef}
          width={600}
          height={600}
          className="border-2 border-gray-500 rounded-lg shadow-lg"
        ></canvas>
      </div>
      <div className="flex gap-4 justify-center">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow"
          onClick={assembleCharacter}
        >
          Assemble Character (Show Face Only)
        </button>
      </div>
    </div>
  );
};

export default CanvasArea;
