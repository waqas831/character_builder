import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useDrop, XYCoord } from 'react-dnd';

interface DroppedItem {
  id: string;
  imageUrl: string;
  x: number;
  y: number;
}

interface CanvasAreaProps {
  droppedItems: DroppedItem[];
  setDroppedItems: React.Dispatch<React.SetStateAction<DroppedItem[]>>;
}

const CanvasArea: React.FC<any> = ({ droppedItems, setDroppedItems }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedItem, setSelectedItem] = useState<DroppedItem | null>(null);

  const [, drop]:any = useDrop({
    accept: 'character',
    drop: (item: DroppedItem, monitor) => {
      const offset: XYCoord | null = monitor.getClientOffset();
      if (offset && canvasRef.current) {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = offset.x - rect.left;
        const y = offset.y - rect.top;

        setDroppedItems((prevItems:any) => [
          ...prevItems,
          { ...item, x, y },
        ]);
      }
    },
  });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const item = droppedItems.find(
      (item:any) => x >= item.x && x <= item.x + 50 && y >= item.y && y <= item.y + 50
    );

    if (item) {
      setSelectedItem(item);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedItem) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setDroppedItems((prevItems:any) =>
      prevItems.map((item:any) =>
        item.id === selectedItem.id ? { ...item, x, y } : item
      )
    );
  };

  const handleMouseUp = () => {
    setSelectedItem(null);
  };

  const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setDroppedItems((prevItems:any) =>
      prevItems.filter(
        (item:any) => !(x >= item.x && x <= item.x + 50 && y >= item.y && y <= item.y + 50)
      )
    );
  };

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);

    // Load default image
    const defaultImg = new Image();
    defaultImg.src = 'https://cdn.decrypt.co/wp-content/uploads/2023/05/dogecoin-doge-token-digital-rendering-gID_7.jpg';
    defaultImg.onload = () => {
      context.drawImage(defaultImg, 0, 0, canvas.width, canvas.height);

      // Draw dropped items
      droppedItems.forEach((item:any) => {
        const img = new Image();
        img.src = item.imageUrl;
        img.onload = () => {
          context.drawImage(img, item.x, item.y, 50, 50);
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
