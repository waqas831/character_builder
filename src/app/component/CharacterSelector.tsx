import React from 'react';
import { useDrag } from 'react-dnd';

const characters = [
  { id: 1, name: 'Shiba Inu', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png' },
  { id: 2, name: 'Cat', imageUrl: 'https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp' },
  { id: 3, name: 'Frog', imageUrl: 'https://static.gettyimages.com/display-sets/creative-landing/images/GettyImages-2162612535.jpg' },
  // Add more characters as needed
];

const Character = ({ character }) => {
  const [, drag] = useDrag(() => ({
    type: 'character',
    item: { id: character.id, imageUrl: character.imageUrl },
  }));

  return (
    <div ref={drag} className="m-2 cursor-pointer">
      <img src={character.imageUrl} alt={character.name} className="w-20 h-20 object-contain" />
    </div>
  );
};

const CharacterSelector = () => (
  <div className="flex flex-wrap w-1/4 bg-gray-100 p-4 border-r">
    {characters.map((char) => (
      <Character key={char.id} character={char} />
    ))}
  </div>
);

export default CharacterSelector;