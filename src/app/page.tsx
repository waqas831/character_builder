"use client"
import { useRef, useState } from "react";
import CanvasArea from "./component/CanvasArea";
import CharacterSelector from "./component/CharacterSelector";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export default function Home() {
  const [droppedItems, setDroppedItems] = useState<any>([]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex">
        <CharacterSelector />
        <CanvasArea />
      </div>
    </DndProvider>
  );
}
