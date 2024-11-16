import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useDrop } from 'react-dnd';

const CanvasArea = ({ droppedItems, setDroppedItems }) => {
  const canvasRef = useRef(null);
  const [selectedItem, setSelectedItem] = useState(null);

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

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const item = droppedItems.find(
      (item) => x >= item.x && x <= item.x + 50 && y >= item.y && y <= item.y + 50
    );

    if (item) {
      setSelectedItem(item);
    }
  };

  const handleMouseMove = (e) => {
    if (!selectedItem) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setDroppedItems((prevItems) =>
      prevItems.map((item) =>
        item.id === selectedItem.id ? { ...item, x, y } : item
      )
    );
  };

  const handleMouseUp = () => {
    setSelectedItem(null);
  };

  const handleDoubleClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setDroppedItems((prevItems) =>
      prevItems.filter(
        (item) => !(x >= item.x && x <= item.x + 50 && y >= item.y && y <= item.y + 50)
      )
    );
  };

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Load default image
    const defaultImg = new Image();
    defaultImg.src = 'https://cdn.decrypt.co/wp-content/uploads/2023/05/dogecoin-doge-token-digital-rendering-gID_7.jpg'; // Replace with your default image URL
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
    <div
      className="flex-1 flex justify-center items-center bg-gray-200"
      ref={drop}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onDoubleClick={handleDoubleClick}
    >
      <canvas
        ref={canvasRef}
        width={800}
        height={800}
        className="border-2 border-gray-500 rounded-lg shadow-lg"
      ></canvas>
    </div>
  );
};

export default CanvasArea;