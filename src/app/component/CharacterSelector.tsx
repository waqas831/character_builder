import React from 'react';
import { useDrag } from 'react-dnd';
import BaseImage from "../../../public/bg.jpg"
import { characters } from '../constants';

const defaultImageUrl = BaseImage // Default image placeholder

const defaultCharacter = {
  id: 'default',
  name: 'Default Character',
  imageUrl: defaultImageUrl,
};

const Character = ({ character }: any) => {
  const [, drag]: any = useDrag(() => ({
    type: 'character',
    item: { id: character.id, imageUrl: character.imageUrl },
  }));

  return (
    <div ref={drag} className="m-2 cursor-pointer transform transition-transform hover:scale-105">
      <img src={character.imageUrl} alt={character.name} className="w-20 h-20 object-contain rounded-lg shadow-lg" />
      <p className="text-center mt-2 text-sm font-semibold">{character.name}</p>
    </div>
  );
};

const CharacterSelector = () => (
  <div className="flex flex-wrap w-1/4 bg-gray-100 p-4 border-r border-gray-300 overflow-y-auto h-screen">
    {characters?.map((char) => (
      <Character key={char.id} character={char} />
    ))}
  </div>
);

export default CharacterSelector;