import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Flex,
  Box,
  Text,
  Grid,
  useColorModeValue,
} from '@chakra-ui/react';

type PieceType = 'queen' | 'rook' | 'bishop' | 'knight';

interface PromotionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (piece: number) => void;
  color: 'white' | 'black';
}

function PromotionDialogBox({ isOpen, onClose, onSelect, color }: PromotionDialogProps) {
  // Define piece symbols and their Unicode representations
  const pieceSymbols: Record<PieceType, string> = {
    queen: color === 'white' ? '♕' : '♛',
    rook: color === 'white' ? '♖' : '♜',
    bishop: color === 'white' ? '♗' : '♝',
    knight: color === 'white' ? '♘' : '♞',
  };

  // Define piece names for display
  const pieceNames: Record<PieceType, string> = {
    queen: 'Queen',
    rook: 'Rook',
    bishop: 'Bishop',
    knight: 'Knight',
  };
  const pieceIndex: Record<PieceType, number> = {
    queen: 4,
    rook: 1,
    bishop: 3,
    knight: 2,
  };

  // Colors for pieces
  const pieceColor = color === 'white' ? 'gray.800' : 'gray.800';
  const pieceSymbolColor = color === 'white' ? 'gray.100' : 'gray.800';
  const hoverBgColor = useColorModeValue('gray.200', 'gray.600');

  // Handle piece selection
  const handleSelect = (piece: number) => {
    onSelect(piece);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay
        bg="blackAlpha.600"
        backdropFilter="blur(4px)"
      />
      <ModalContent
        borderWidth="2px"
        borderRadius="lg"
        boxShadow="lg"
        bg="gray.50"
      >
        <ModalHeader
          fontSize="2xl"
          fontWeight="bold"
          textAlign="center"
          borderBottomWidth="1px"
          pb={3}
        >
          Promote Pawn
        </ModalHeader>
        <ModalBody py={6}>
          <Text fontSize="md" mb={4} color="gray.600" textAlign="center">
            Choose a piece to promote your pawn to:
          </Text>
          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            {Object.entries(pieceSymbols).map(([piece, symbol]) => (
              <Flex
                key={piece}
                direction="column"
                align="center"
                justify="center"
                borderWidth="1px"
                borderRadius="md"
                p={4}
                cursor="pointer"
                onClick={() => handleSelect(pieceIndex[piece as PieceType])}
                _hover={{ bg: hoverBgColor }}
                transition="all 0.2s"
              >
                <Box fontSize="5xl" mb={2}>
                  <span
                    role="img"
                    aria-label={piece}
                    style={{ color: color === 'white' ? 'black' : 'black' }}
                  >
                    {symbol}
                  </span>
                </Box>
                <Text color={pieceColor} fontWeight="medium">
                  {pieceNames[piece as PieceType]}
                </Text>
              </Flex>
            ))}
          </Grid>
        </ModalBody>
        <ModalFooter borderTopWidth="1px" pt={3} justifyContent="center">
          <Text fontSize="sm" color="gray.500">
            Select a piece to continue
          </Text>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default PromotionDialogBox;