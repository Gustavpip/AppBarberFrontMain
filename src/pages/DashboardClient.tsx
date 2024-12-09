import {
  Box,
  Image,
  IconButton,
  Slide,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import { ReactNode, useState } from 'react';
import barberTheme from '../theme';
import { Link, useNavigate, useParams } from 'react-router-dom';

export const DashboardClient = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string>('');
  const { isOpen: isOpenModal, onClose } = useDisclosure();

  const { token, hashIdClient } = useParams();

  const navigate = useNavigate();

  const toggleMenuSchedule = () => setIsOpen(!isOpen);

  const handleSelect = (item: string) => {
    setSelectedItem(item);
    setIsOpen(false);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/barbeiros', { replace: true });
  };

  return (
    <>
      <Box width="100%" minHeight="100vh" display="flex" flexDirection="column">
        <Box
          as="header"
          padding="16px"
          borderBottom={`1px solid ${barberTheme.colors.primary.gray}`}
        >
          <Box
            as="nav"
            className="navbar"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box className="logo">
              <Link to={`/agendar/${token}`}>
                <Image
                  display={{
                    base: isOpen ? 'none' : 'block',
                    sm: isOpen ? 'none' : 'block',
                    md: 'block',
                  }}
                  height="40px"
                  width="22"
                  src="/logo.png"
                  alt="Logo"
                />
              </Link>
            </Box>
            <Box zIndex={101}>
              <IconButton
                icon={
                  isOpen ? (
                    <CloseIcon color="white" boxSize="12px" />
                  ) : (
                    <HamburgerIcon />
                  )
                }
                background="transparent"
                color={isOpen ? 'black' : 'white'}
                aria-label="Menu"
                onClick={toggleMenuSchedule}
                _hover={{ bg: 'transparent' }}
                _active={{ bg: 'transparent' }}
                zIndex={3}
              />
            </Box>
          </Box>
        </Box>

        <Box
          flex="1" /* Permite que este conteúdo preencha o restante do espaço disponível */
          backgroundColor={barberTheme.colors.primary.black}
          overflow="hidden" /* Evita rolagem desnecessária */
        >
          <Slide direction="right" in={isOpen} style={{ zIndex: 100 }}>
            <Box
              position="fixed"
              top="0"
              right="0"
              height="100vh"
              width="90%"
              maxWidth="400px"
              bg="#18181D"
              borderLeft={`1px solid ${barberTheme.colors.primary.gray}`}
              borderBottom={`1px solid ${barberTheme.colors.primary.gray}`}
              borderTop={`1px solid ${barberTheme.colors.primary.gray}`}
              color="white"
              boxShadow="md"
              p="4"
            >
              <Text fontWeight={barberTheme.fontWeights.bold} color="white">
                Menu
              </Text>

              <Box
                mt="32px"
                as="ul"
                borderBottom={`1px solid ${barberTheme.colors.primary.gray}`}
              >
                <Text
                  as="li"
                  display="flex"
                  alignItems="center"
                  height="44px"
                  mt="16px"
                  mb="16px"
                  width="310px"
                  borderRadius="12px"
                  color="white"
                  padding="0 16px"
                  cursor="pointer"
                  backgroundColor={
                    selectedItem === 'perfil'
                      ? barberTheme.colors.primary.orange
                      : 'perfil'
                  }
                  onClick={() => handleSelect('perfil')}
                >
                  <Image
                    src="/whiteuser.svg"
                    boxSize="20px"
                    marginRight="8px"
                  />{' '}
                  <Link
                    to="/"
                    style={{ flex: 1, textAlign: 'start', margin: '0 8px' }}
                  >
                    Dados
                  </Link>
                </Text>
              </Box>
            </Box>
          </Slide>

          <Modal isOpen={isOpenModal} onClose={onClose}>
            <ModalOverlay />
            <ModalContent
              bg={barberTheme.colors.primary.black}
              color="white"
              maxW="500px"
              mx="auto"
              marginY="200px"
              marginX="16px"
              borderRadius="md"
            >
              <ModalHeader>Você tem certeza?</ModalHeader>
              <ModalCloseButton />
              <ModalBody color={barberTheme.colors.primary.gray03}>
                Você tem certeza que deseja sair?
              </ModalBody>
              <ModalFooter>
                <Button
                  backgroundColor={barberTheme.colors.primary.gray}
                  color="white"
                  mr={3}
                  onClick={onClose}
                >
                  Fechar
                </Button>
                <Button
                  onClick={logout}
                  color="white"
                  backgroundColor="red.400"
                >
                  Sair
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          <Box as="main">{children}</Box>
        </Box>
      </Box>
    </>
  );
};
