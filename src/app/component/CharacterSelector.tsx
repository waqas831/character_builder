import React from 'react';
import { useDrag } from 'react-dnd';
import BaseImage from "../../../public/bg.jpg"

const defaultImageUrl = BaseImage // Default image placeholder

const characters = [
  { id: 1, name: 'Shiba Inu', imageUrl: 'https://learnwebcode.github.io/json-example/images/cat-2.jpg' },
  { id: 2, name: 'Dog', imageUrl: 'https://learnwebcode.github.io/json-example/images/dog-1.jpg' },
  { id: 3, name: 'Frog', imageUrl: 'https://learnwebcode.github.io/json-example/images/cat-1.jpg' },
  { id: 20, name: 'Animal 5', imageUrl: 'http://static.hothdwallpaper.net/5194c2137a83e13997.jpg' },
  { id: 22, name: 'Animal 7', imageUrl: 'http://upload.wikimedia.org/wikipedia/commons/0/00/Frog_vivisection.jpg' },
  { id: 29, name: 'Animal 14', imageUrl: 'http://upload.wikimedia.org/wikipedia/commons/4/47/Octopus_shell.jpg' },
  { id: 15, name: 'Donkey', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIn2ZcFxQFBe__wo19VcYqkTgihXILijfDVg&s' },
  { id: 18, name: 'Animal 18', imageUrl: 'http://r.ddmcdn.com/w_830/s_f/o_1/cx_98/cy_0/cw_640/ch_360/APL/uploads/2015/07/cecil-AP463227356214-1000x400.jpg' },
  { id: 21, name: 'Animal 21', imageUrl: 'https://static.boredpanda.com/blog/wp-content/uploads/2016/09/funny-animals-with-front-eyes-fb2__700-png.jpg' },
  { id: 23, name: 'Animal 23', imageUrl: 'http://img-aws.ehowcdn.com/600x350/photos.demandstudios.com/getty/article/106/17/483510755.jpg' },
  { id: 27, name: 'Animal 27', imageUrl: 'http://r.ddmcdn.com/s_f/o_1/cx_297/cy_0/cw_1201/ch_1201/w_720/APL/uploads/2014/08/wild-animal-safari-zebra-5371037.jpg' },
  { id: 30, name: 'Animal 30', imageUrl: 'https://www.drusillas.co.uk/images/whats-on-card/redpanda-profile-400x400-984.jpg' },
  { id: 32, name: 'Animal 32', imageUrl: 'http://animals.sandiegozoo.org/sites/default/files/styles/view_thumbnail/public/2016-11/animals_hero_african_spurred_tortoise.jpg?h=d1cb525d&itok=C1QabUac' },
  { id: 33, name: 'Animal 33', imageUrl: 'https://images.pexels.com/photos/236230/pexels-photo-236230.jpeg?cs=srgb&dl=adorable-animals-cats-236230.jpg&fm=jpg' },
  { id: 34, name: 'Animal 34', imageUrl: 'https://www.telegraph.co.uk/content/dam/news/2017/10/26/TELEMMGLPICT000144715823_trans_NvBQzQNjv4BqqVzuuqpFlyLIwiB6NTmJwfSVWeZ_vEN7c6bHu2jJnT8.jpeg?imwidth=450' },
  { id: 35, name: 'Animal 35', imageUrl: 'https://www.worldatlas.com/r/w728-h425-c728x425/upload/00/fa/69/shutterstock-450936571.jpg' },
  { id: 36, name: 'Image 1', imageUrl: 'https://www.encyclopedia.com/sites/default/files/5/2799991.jpg' },
  { id: 37, name: 'Image 2', imageUrl: 'http://cdn.static-economist.com/sites/default/files/lead_2.jpg' },
  { id: 38, name: 'Image 3', imageUrl: 'https://hounslowurbanfarm.co.uk/wp-content/uploads/2017/03/img-animal-Willow-the-Barn-Owl.jpg' },
  { id: 39, name: 'Image 4', imageUrl: 'http://www.slate.com/content/dam/slate/blogs/wild_things/2015/09/02/150902_WILD_CutePenguins.jpg.CROP.promo-xlarge2.jpg' },
  { id: 40, name: 'Image 5', imageUrl: 'http://animals.sandiegozoo.org/sites/default/files/styles/view_thumbnail/public/2016-09/animals_hero_armadillo_0.jpg?h=d1cb525d&itok=KI0kywiz' },
  { id: 41, name: 'Image 6', imageUrl: 'https://www.fortworthzoo.org/assets/2059/plan_a_visit_banner_gorilla_1500x550.jpg' },
  { id: 42, name: 'Image 7', imageUrl: 'https://secure.i.telegraph.co.uk/multimedia/archive/03095/hybrid-animals-mac_3095333k.jpg' },
  { id: 43, name: 'Image 8', imageUrl: 'https://www.drusillas.co.uk/images/explore-more-card/meerkat1-profile-400x400-536.jpg' },
  { id: 44, name: 'Image 9', imageUrl: 'https://d1o50x50snmhul.cloudfront.net/wp-content/uploads/2017/07/17153147/gettyimages-590483570.jpg' },
  { id: 4, name: 'Penguin', imageUrl: 'https://www.shutterstock.com/image-vector/cryptocurrency-logos-colorful-circle-vector-260nw-2375613293.jpg' },
  { id: 5, name: 'Panda', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVJP-_denGrimWenBGNm8ObekCcSycGSa34g&s' },
  { id: 6, name: 'Fox', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-dSv6DcyAuMyyXo26eo_xMKRqS3jYQHg1nA&s' },
  { id: 7, name: 'Raccoon', imageUrl: 'https://cdn.kwork.com/files/portfolio/t0/03/463d6bb2146578e43f7ee6d739f78a11a99bc93a-1717975305.jpg' },
  { id: 8, name: 'Bear', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQq9PzRc2jDdew91h8YXCvQW4K_51migixq8lA1KyHGgPsfySx16c9XDc_BdcnoGKbeojo&usqp=CAU' },
  { id: 9, name: 'Lion', imageUrl: 'https://coingape.com/wp-content/uploads/2024/03/Shiba-Inu-Logo-e1719038325953.jpg' },
  { id: 10, name: 'Tiger', imageUrl: 'https://imgcdn.stablediffusionweb.com/2024/10/30/bdf1f849-fed8-4a23-bcd7-b9de4120312f.jpg' },
  { id: 11, name: 'Elephant', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvGmspLpwWeiL9laod1iI2uQ4mNiCZWPx5UrRiQ_piKrP7VQTEyUQDBEV1Vh8VX0RgL9M&usqp=CAU' },
  { id: 12, name: 'Giraffe', imageUrl: 'https://imagedelivery.net/4-5JC1r3VHAXpnrwWHBHRQ/4c5cbc7f-d141-4f65-9293-e0d0bcbab600/public' },
  { id: 13, name: 'Zebra', imageUrl: 'https://www.shutterstock.com/image-vector/pepe-cryptocurrency-logo-illustrations-on-260nw-2477855995.jpg' },
  { id: 14, name: 'Horse', imageUrl: 'https://i.pinimg.com/736x/e2/fc/5e/e2fc5e156d7766a312c2a31059ad50f1.jpg' },
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