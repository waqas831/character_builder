import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useDrop, XYCoord } from 'react-dnd';
import BaseImage from "../../../public/bg.jpg"

interface DroppedItem {
  id: string;
  imageUrl: string;
  x: number;
  y: number;
  width: number;
  height: number;
  borderRadius: number;
  opacity: number;
  rotate: number;
}

interface CanvasAreaProps {
  droppedItems: DroppedItem[];
  setDroppedItems: React.Dispatch<React.SetStateAction<DroppedItem[]>>;
}

const CanvasArea: React.FC<any> = ({ droppedItems, setDroppedItems }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedItem, setSelectedItem] = useState<DroppedItem | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [, drop]: any = useDrop({
    accept: 'character',
    drop: (item: DroppedItem, monitor) => {
      const offset: XYCoord | null = monitor.getClientOffset();
      if (offset && canvasRef.current) {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = offset.x - rect.left;
        const y = offset.y - rect.top;
        setDroppedItems((prevItems: any) => [
          ...prevItems,
          { ...item, x, y, width: 80, height: 80, borderRadius: 0, opacity: 1, rotate: 0 },
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
      (item: any) => x >= item.x && x <= item.x + item.width && y >= item.y && y <= item.y + item.height
    );

    if (item) {
      setSelectedItem(item);
      setIsDragging(true);
    } else {
      setSelectedItem(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !selectedItem) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setDroppedItems((prevItems: any) =>
      prevItems.map((item: any) =>
        item.id === selectedItem.id ? { ...item, x, y } : item
      )
    );
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setDroppedItems((prevItems: any) =>
      prevItems.filter(
        (item: any) => !(x >= item.x && x <= item.x + item.width && y >= item.y && y <= item.y + item.height)
      )
    );
  };

  const handleStyleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedItem) return;

    const { name, value } = e.target;
    setDroppedItems((prevItems: any) =>
      prevItems.map((item: any) =>
        item.id === selectedItem.id ? { ...item, [name]: parseFloat(value) } : item
      )
    );
    setSelectedItem((prevItem) => prevItem ? { ...prevItem, [name]: parseFloat(value) } : null);
  };

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);

    // Load default person-like image
    const defaultImg = new Image();
    defaultImg.src = "https://i.ibb.co/tsj0rsT/bg.png"; // Replace with actual URL
    // defaultImg.crossOrigin = 'anonymous'; // This is important for CORS
    
    defaultImg.onload = () => {
      context.drawImage(defaultImg, 0, 0, canvas.width, canvas.height);

      // Draw dropped items
      droppedItems.forEach((item: any) => {
        const img = new Image();
        img.src = item.imageUrl;
        // img.crossOrigin = 'anonymous'; // This is important for CORS
        img.onload = () => {
          context.save();
          context.globalAlpha = item.opacity;
          context.translate(item.x + item.width / 2, item.y + item.height / 2);
          context.rotate((item.rotate * Math.PI) / 180);
          context.translate(-(item.x + item.width / 2), -(item.y + item.height / 2));
          context.beginPath();
          context.moveTo(item.x + item.borderRadius, item.y);
          context.lineTo(item.x + item.width - item.borderRadius, item.y);
          context.quadraticCurveTo(item.x + item.width, item.y, item.x + item.width, item.y + item.borderRadius);
          context.lineTo(item.x + item.width, item.y + item.height - item.borderRadius);
          context.quadraticCurveTo(item.x + item.width, item.y + item.height, item.x + item.width - item.borderRadius, item.y + item.height);
          context.lineTo(item.x + item.borderRadius, item.y + item.height);
          context.quadraticCurveTo(item.x, item.y + item.height, item.x, item.y + item.height - item.borderRadius);
          context.lineTo(item.x, item.y + item.borderRadius);
          context.quadraticCurveTo(item.x, item.y, item.x + item.borderRadius, item.y);
          context.closePath();
          context.clip();
          context.drawImage(img, item.x, item.y, item.width, item.height);
          context.restore();
        };
      });
    };
  }, [droppedItems]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 bg-gray-100">
      <div
        className="flex-1 flex justify-center items-center bg-gray-200 rounded-lg shadow-lg p-4"
        ref={drop}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onDoubleClick={handleDoubleClick}
      >
        <canvas
          ref={canvasRef}
          width={600}
          height={600}
          className="border-2 border-gray-500 rounded-lg shadow-lg"
        ></canvas>
       
      </div>
      <div>
         {/* download the image of canvas */}
       {/* <button className="mt-4 p-2 bg-blue-500 text-white rounded-lg" onClick={()=>{
          const canvas = canvasRef.current;
          if (!canvas) return;
          const link = document.createElement('a');
          link.download = 'canvas-image.png';
          link.href = canvas.toDataURL();
          link.click();
       }}>
          Download Image
        </button> */}
      </div>
      {selectedItem && (
        <div className="p-4 bg-white rounded-lg shadow-lg w-full md:w-1/3">
          <h3 className="text-lg font-bold mb-4">Edit Item</h3>
          <label className="block mb-2">
            Width:
            <input
              type="number"
              name="width"
              value={selectedItem.width}
              onChange={handleStyleChange}
              className="border p-1 ml-2 rounded"
            />
          </label>
          <label className="block mb-2">
            Height:
            <input
              type="number"
              name="height"
              value={selectedItem.height}
              onChange={handleStyleChange}
              className="border p-1 ml-2 rounded"
            />
          </label>
          <label className="block mb-2">
            Border Radius:
            <input
              type="number"
              name="borderRadius"
              value={selectedItem.borderRadius}
              onChange={handleStyleChange}
              className="border p-1 ml-2 rounded"
            />
          </label>
          <label className="block mb-2">
            Opacity:
            <input
              type="number"
              name="opacity"
              value={selectedItem.opacity}
              onChange={handleStyleChange}
              step="0.1"
              min="0"
              max="1"
              className="border p-1 ml-2 rounded"
            />
          </label>
          <label className="block mb-2">
            Rotate:
            <input
              type="number"
              name="rotate"
              value={selectedItem.rotate}
              onChange={handleStyleChange}
              className="border p-1 ml-2 rounded"
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default CanvasArea;
