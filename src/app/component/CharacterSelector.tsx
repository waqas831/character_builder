import React from 'react';
import { useDrag } from 'react-dnd';

const defaultImageUrl = 'https://via.placeholder.com/150'; // Default image placeholder

const characters = [
  { id: 1, name: 'Shiba Inu', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTekAtiR1njyTFSnyzwa2-s3_13RsC4WIad0THmHpDy11AIpKpRud-TLsMLErHKAkyKgl8&usqp=CAU' },
  { id: 2, name: 'Cat', imageUrl: 'https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp' },
  { id: 3, name: 'Frog', imageUrl: 'https://ih1.redbubble.net/image.5001145415.0588/bg,f8f8f8-flat,750x,075,f-pad,750x1000,f8f8f8.u2.jpg' },
  { id: 4, name: 'Penguin', imageUrl: 'https://www.shutterstock.com/image-vector/cryptocurrency-logos-colorful-circle-vector-260nw-2375613293.jpg' },
  { id: 5, name: 'Panda', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVJP-_denGrimWenBGNm8ObekCcSycGSa34g&s' },
  { id: 6, name: 'Fox', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-dSv6DcyAuMyyXo26eo_xMKRqS3jYQHg1nA&s' },
  { id: 7, name: 'Raccoon', imageUrl: 'https://cdn.kwork.com/files/portfolio/t0/03/463d6bb2146578e43f7ee6d739f78a11a99bc93a-1717975305.jpg' },
  { id: 8, name: 'Bear', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQq9PzRc2jDdew91h8YXCvQW4K_51migixq8lA1KyHGgPsfySx16c9XDc_BdcnoGKbeojo&usqp=CAU' },
  { id: 9, name: 'Lion', imageUrl: 'https://coingape.com/wp-content/uploads/2024/03/Shiba-Inu-Logo-e1719038325953.jpg'},
  { id: 10, name: 'Tiger', imageUrl: 'https://imgcdn.stablediffusionweb.com/2024/10/30/bdf1f849-fed8-4a23-bcd7-b9de4120312f.jpg' },
  { id: 11, name: 'Elephant', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvGmspLpwWeiL9laod1iI2uQ4mNiCZWPx5UrRiQ_piKrP7VQTEyUQDBEV1Vh8VX0RgL9M&usqp=CAU' },
  { id: 12, name: 'Giraffe', imageUrl: 'https://imagedelivery.net/4-5JC1r3VHAXpnrwWHBHRQ/4c5cbc7f-d141-4f65-9293-e0d0bcbab600/public'},
  { id: 13, name: 'Zebra', imageUrl: 'https://www.shutterstock.com/image-vector/pepe-cryptocurrency-logo-illustrations-on-260nw-2477855995.jpg'},
{ id: 14, name: 'Horse', imageUrl: 'https://i.pinimg.com/736x/e2/fc/5e/e2fc5e156d7766a312c2a31059ad50f1.jpg'},
{ id: 15, name: 'Donkey', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIn2ZcFxQFBe__wo19VcYqkTgihXILijfDVg&s'}
];

const Character = ({ character }: any) => {
  const [, drag]: any = useDrag(() => ({
    type: 'character',
    item: { id: character.id, imageUrl: character.imageUrl || defaultImageUrl },
  }));

  return (
    <div ref={drag} className="m-2 cursor-pointer transform transition-transform hover:scale-105">
      <img src={character.imageUrl || defaultImageUrl} alt={character.name} className="w-20 h-20 object-contain rounded-lg shadow-lg" />
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