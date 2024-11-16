import React from 'react';
import { useDrag } from 'react-dnd';

const characters = [
  { id: 1, name: 'Shiba Inu', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png' },
  { id: 2, name: 'Cat', imageUrl: 'https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp' },
  { id: 3, name: 'Frog', imageUrl: 'https://static.gettyimages.com/display-sets/creative-landing/images/GettyImages-2162612535.jpg' },
  // Add more characters as needed
];

const Character = ({ character }:any) => {
  const [, drag]:any = useDrag(() => ({
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