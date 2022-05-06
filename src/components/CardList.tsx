import { SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  // MODAL USEDISCLOSURE
  const { onOpen, isOpen, onClose } = useDisclosure()
  
  // SELECTED IMAGE URL STATE
  const [ imgSrc, setImgSrc ] = useState('');

  // FUNCTION HANDLE VIEW IMAGE
  function handleViewImage(url: string) {
    onOpen();

    setImgSrc(url);
  }

  return (
    <>
      {/* CARD GRID */}
      <SimpleGrid columns={3} spacing={10}>
        {cards.map(card => {
          return (
           <Card key={card.id} data={card} viewImage={handleViewImage} />
          )
        })}
      </SimpleGrid>
      {/* MODALVIEWIMAGE */}
      { imgSrc && <ModalViewImage isOpen={isOpen} onClose={onClose} imgUrl={imgSrc} /> }
    </>
  );
}
