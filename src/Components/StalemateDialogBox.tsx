import { Box, Text, Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";

function StalemateDialogBox({isOpen, onClose}: {isOpen: boolean, onClose: () => void}) {
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
            Stalemate!
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody py={6}>
            <Flex direction="column" align="center">
              <Box fontSize="5xl" mb={2}>
                {/* Chess pieces symbol */}
                <span role="img" style={{ color: "gray.500" }} aria-label="chess pieces">♚♔</span>
              </Box>
              <Text
                fontSize="xl"
                fontWeight="bold"
                textAlign="center"
              >
                It's a draw!
              </Text>
              <Text fontSize="md" mt={2} color="gray.600" textAlign="center">
                The game ended in stalemate. Neither player can make a legal move.
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
  
  export default StalemateDialogBox;