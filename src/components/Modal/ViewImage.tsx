import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Image,
  Link,
  Button,
} from '@chakra-ui/react';

interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}

export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl,
}: ModalViewImageProps): JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay>
        <ModalContent background="#353431" maxW={800} maxH={1000}>
          <ModalBody p={0}>
            <Image src={imgUrl} objectPosition="center" w="100%" maxH={780} objectFit="cover" />
          </ModalBody>
          <ModalFooter>
            <Link float="left" href={imgUrl} target="_blank">Abrir original</Link>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  )
}
