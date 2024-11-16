import React, { useRef, useEffect, useCallback } from 'react';
import { useDrop } from 'react-dnd';

const CanvasArea = ({ droppedItems, setDroppedItems }) => {
  const canvasRef = useRef(null);

  const [, drop] = useDrop({
    accept: 'character',
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = offset.x - rect.left;
      const y = offset.y - rect.top;
      setDroppedItems((prevItems) => [
        ...prevItems,
        { ...item, x, y },
      ]);
    },
  });

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Load default image
    const defaultImg = new Image();
    defaultImg.src = 'https://static.gettyimages.com/display-sets/creative-landing/images/GettyImages-2162612535.jpg'; // Replace with your default image URL
    defaultImg.onload = () => {
      context.drawImage(defaultImg, 0, 0, canvas.width, canvas.height); // Adjust position and size as needed

      // Draw dropped items after the default image has loaded
      droppedItems.forEach((item) => {
        const img = new Image();
        img.src = item.imageUrl;
        img.onload = () => {
          context.drawImage(img, item.x, item.y, 50, 50); // Adjust size as needed
        };
      });
    };
  }, [droppedItems]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  return (
    <div className="flex-1 flex justify-center items-center bg-gray-200" ref={drop}>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="border-2 border-gray-500 rounded-lg shadow-lg"
      ></canvas>
    </div>
  );
};

export default CanvasArea;