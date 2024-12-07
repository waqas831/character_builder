import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useDrop, XYCoord } from 'react-dnd';

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
  zIndex: number;
  tolerance: number;
  colorKey: string;
}

interface CanvasAreaProps {
  droppedItems: DroppedItem[];
  setDroppedItems: any;
}

const CanvasArea: React.FC<CanvasAreaProps> = ({ droppedItems, setDroppedItems }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());
  const [selectedItem, setSelectedItem] = useState<DroppedItem | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  const [, drop] :any= useDrop({
    accept: 'character',
    drop: (item: DroppedItem, monitor) => {
      const offset: XYCoord | null = monitor.getClientOffset();
      if (offset && canvasRef.current) {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = offset.x - rect.left;
        const y = offset.y - rect.top;

        setDroppedItems((prevItems: DroppedItem[]) => [
          ...prevItems,
          {
            ...item,
            x,
            y,
            width: 80,
            height: 80,
            borderRadius: 0,
            opacity: 1,
            rotate: 0,
            zIndex: prevItems.length,
            tolerance: 30,
            colorKey: '#FFFFFF'
          },
        ]);
      }
    },
  });

  const isPointInImage = (x: number, y: number, item: DroppedItem) => {
    const centerX = item.x + item.width / 2;
    const centerY = item.y + item.height / 2;
    const angle = -item.rotate * Math.PI / 180;

    const dx = x - centerX;
    const dy = y - centerY;
    const rotatedX = dx * Math.cos(angle) - dy * Math.sin(angle) + centerX;
    const rotatedY = dx * Math.sin(angle) + dy * Math.cos(angle) + centerY;

    return rotatedX >= item.x &&
           rotatedX <= item.x + item.width &&
           rotatedY >= item.y &&
           rotatedY <= item.y + item.height;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const item = droppedItems.find(
      (item) => x >= item.x && x <= item.x + item.width && y >= item.y && y <= item.y + item.height
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

  const loadImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      if (imageCache.current.has(url)) {
        resolve(imageCache.current.get(url)!);
        return;
      }

      const img = new Image();
      img.crossOrigin = "anonymous";

      const handleError = () => {
        if (img.crossOrigin) {
          img.crossOrigin = "";
          img.src = url;
        } else {
          const proxyUrl = `https://cors-anywhere.herokuapp.com/${url}`;
          img.crossOrigin = "anonymous";
          img.src = proxyUrl;

          img.onerror = () => {
            reject(new Error(`Failed to load image after all attempts: ${url}`));
          };
        }
      };

      img.onload = () => {
        imageCache.current.set(url, img);
        resolve(img);
      };

      img.onerror = handleError;
      img.src = url;
    });
  };

  const processImage = async (imageUrl: string, tolerance: number, colorKey: string): Promise<HTMLCanvasElement> => {
    try {
      const img = await loadImage(imageUrl);
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = img.width;
      tempCanvas.height = img.height;
      const ctx = tempCanvas.getContext('2d');
      if (!ctx) throw new Error('Could not get context');

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
      const data = imageData.data;

      const keyColor = colorKey.match(/^#([0-9a-f]{6})$/i)?.[1];
      const keyR = keyColor ? parseInt(keyColor.substr(0, 2), 16) : 255;
      const keyG = keyColor ? parseInt(keyColor.substr(2, 2), 16) : 255;
      const keyB = keyColor ? parseInt(keyColor.substr(4, 2), 16) : 255;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const colorDiff = Math.sqrt(
          Math.pow(r - keyR, 2) +
          Math.pow(g - keyG, 2) +
          Math.pow(b - keyB, 2)
        );

        const alpha = colorDiff > tolerance ? 255 : 0;
        data[i + 3] = alpha;
      }

      ctx.putImageData(imageData, 0, 0);
      return tempCanvas;
    } catch (error) {
      console.error(`Error processing image ${imageUrl}:`, error);
      return createFallbackCanvas();
    }
  };

  const createFallbackCanvas = (): HTMLCanvasElement => {
    const fallbackCanvas = document.createElement('canvas');
    fallbackCanvas.width = 100;
    fallbackCanvas.height = 100;
    const ctx = fallbackCanvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#FF0000';
      ctx.fillRect(0, 0, 100, 100);
    }
    return fallbackCanvas;
  };

  const drawCanvas = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    setLoadingError(null);
    context.clearRect(0, 0, canvas.width, canvas.height);

    try {
      const sortedItems = [...droppedItems].sort((a, b) => a.zIndex - b.zIndex);
      const processedImages = new Map<string, HTMLCanvasElement>();

      await Promise.all(sortedItems.map(async item => {
        const processed = await processImage(item.imageUrl, item.tolerance || 30, item.colorKey || '#FFFFFF');
        processedImages.set(item.id, processed);
      }));

      for (const item of sortedItems) {
        const processedCanvas = processedImages.get(item.id);
        if (!processedCanvas) continue;

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) continue;

        tempCtx.save();

        const centerX = item.x + item.width / 2;
        const centerY = item.y + item.height / 2;

        tempCtx.translate(centerX, centerY);
        tempCtx.rotate((item.rotate * Math.PI) / 180);
        tempCtx.translate(-centerX, -centerY);
        tempCtx.globalAlpha = item.opacity;

        tempCtx.drawImage(processedCanvas, item.x, item.y, item.width, item.height);

        tempCtx.restore();
        context.drawImage(tempCanvas, 0, 0);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setLoadingError(errorMessage);
      console.error('Error processing images:', error);
    }
  }, [droppedItems]);

  const roundedRect = (ctx: CanvasRenderingContext2D, item: DroppedItem) => {
    ctx.moveTo(item.x + item.borderRadius, item.y);
    ctx.lineTo(item.x + item.width - item.borderRadius, item.y);
    ctx.quadraticCurveTo(item.x + item.width, item.y, item.x + item.width, item.y + item.borderRadius);
    ctx.lineTo(item.x + item.width, item.y + item.height - item.borderRadius);
    ctx.quadraticCurveTo(item.x + item.width, item.y + item.height, item.x + item.width - item.borderRadius, item.y + item.height);
    ctx.lineTo(item.x + item.borderRadius, item.y + item.height);
    ctx.quadraticCurveTo(item.x, item.y + item.height, item.x, item.y + item.height - item.borderRadius);
    ctx.lineTo(item.x, item.y + item.borderRadius);
    ctx.quadraticCurveTo(item.x, item.y, item.x + item.borderRadius, item.y);
    ctx.closePath();
  };

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 bg-gray-100">
      <div className="flex-1 flex flex-col justify-center items-center bg-gray-200 rounded-lg shadow-lg p-4">
        {loadingError && (
          <div className="text-red-500 mb-2">
            Error: {loadingError}
          </div>
        )}
        <div
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
          />
        </div>
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
          <label className="block mb-2">
            Background Tolerance:
            <input
              type="range"
              name="tolerance"
              value={selectedItem.tolerance || 30}
              onChange={handleStyleChange}
              min="0"
              max="255"
              className="w-full"
            />
          </label>
          <label className="block mb-2">
            Background Color:
            <input
              type="color"
              name="colorKey"
              value={selectedItem.colorKey || '#FFFFFF'}
              onChange={handleStyleChange}
              className="ml-2"
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default CanvasArea;
