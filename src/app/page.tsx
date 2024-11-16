"use client"
import Image from "next/image";
import { useRef, useState } from "react";
import CanvasArea from "./component/CanvasArea";
import CharacterSelector from "./component/CharacterSelector";
import DownloadButton from "./component/DownloadButton";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ImageOf from "@/app/images/image.jpg"
export default function Home() {
  const canvasRef = useRef(null);
  const [droppedItems, setDroppedItems] = useState([]);

  return (
    <DndProvider backend={HTML5Backend}>
    <div className="">
    <div className="flex">
      <CharacterSelector />
      <CanvasArea droppedItems={droppedItems} setDroppedItems={setDroppedItems} />
    </div>
      {/* <div className="flex h-screen">
      <CharacterSelector />
      <div className="flex flex-col mt-20 items-center flex-1">
        <CanvasArea baseImage={ImageOf} ref={canvasRef} />
        <DownloadButton canvasRef={canvasRef} />
      </div>
    </div> */}
    </div>
    </DndProvider>
  );
}
