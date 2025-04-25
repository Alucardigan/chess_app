import { Button, Text,Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, UseDisclosureProps, useDisclosure, Box, Flex } from "@chakra-ui/react";

function CheckmateDialogBox({isOpen,onClose,winner}:{isOpen : boolean, onClose: () =>void,winner:string}) {
  const crownColor = winner.toLowerCase().includes('white') ? 'gold' : 'gray.800';
  const textColor = winner.toLowerCase().includes('white') ? 'gray.800' : 'gray.800';
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
          Checkmate!
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody py={6}>
          <Flex direction="column" align="center">
            <Box fontSize="5xl" mb={2}>
              {/* Chess crown symbol */}
              <span role="img" style={{ color: crownColor }} aria-label="crown" >♚</span>
            </Box>
            <Text 
              fontSize="xl" 
              fontWeight="bold" 
              textAlign="center"
            >
              {winner} wins the game!
            </Text>
            <Text fontSize="md" mt={2} color="gray.600" textAlign="center">
              Well played! Would you like to play again?
            </Text>
          </Flex>
        </ModalBody>

        <ModalFooter 
          borderTopWidth="1px" 
          pt={3} 
          justifyContent="center"
        >
          <Button 
            colorScheme={'gray'} 
            mr={3} 
            onClick={onClose}
            boxShadow="sm"
          >
            Back to home screen
          </Button>
          
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
  }
export default CheckmateDialogBox