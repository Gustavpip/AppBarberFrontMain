import {
  Box,
  Image,
  IconButton,
  VStack,
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
import { Link, useNavigate } from 'react-router-dom';

export const Dashboard = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string>('');
  const { isOpen: isOpenModal, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

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
    <Box
      maxHeight="100vh"
      style={{
        backgroundColor: barberTheme.colors.primary.black,
        minHeight: '100vh',
      }}
      className="container-form"
    >
      <Box
        width="100%"
        as="header"
        padding="16px"
        borderBottom={`${isOpen ? '' : '1px solid ' + barberTheme.colors.primary.gray}`}
        position="fixed"
        top="0"
        left="0"
        right="0"
        zIndex={999} // Certifique-se de que o header tem um zIndex alto
        backdropFilter={isOpen ? '' : 'blur(10px)'} // Aplica o desfoque
        background={isOpen ? 'transparent' : 'rgba(255, 255, 255, 0.1)'} // Fundo semi-transparente
      >
        <Box
          as="nav"
          className="navbar"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box>
            <Link to="/">
              {' '}
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
              onClick={toggleMenu}
              _hover={{ bg: 'transparent' }}
              _active={{ bg: 'transparent' }}
              zIndex={3}
            />
          </Box>
        </Box>
      </Box>
      <Slide
        direction="right"
        in={isOpen}
        style={{ zIndex: 100, pointerEvents: 'auto' }}
      >
        <Box
          position="fixed"
          top="0"
          right="0"
          height="100vh"
          width="90%"
          maxWidth="400px"
          bg="#18181D"
          borderLeft={`1px solid ` + barberTheme.colors.primary.gray}
          borderBottom={`1px solid ` + barberTheme.colors.primary.gray}
          borderTop={`1px solid ` + barberTheme.colors.primary.gray}
          color="white"
          boxShadow="md"
          p="4"
        >
          <Text fontWeight={barberTheme.fontWeights.bold} color="white">
            Menu
          </Text>
          <Box
            py="22px"
            as="div"
            display="flex"
            alignItems="center"
            flexDirection="row"
            borderBottom={`1px solid ${barberTheme.colors.primary.gray}`}
          >
            <Box
              mr="12px"
              display="flex"
              justifyContent="center"
              alignItems="center"
              backgroundColor={barberTheme.colors.primary.orange}
              p="2px"
              borderRadius="50%"
              height="52px"
              width="52px"
              as="div"
            >
              <Image
                objectFit="cover"
                borderRadius="50%"
                height="48px"
                width="48px"
                src="https://static.vecteezy.com/ti/fotos-gratis/p1/26411272-sorrir-homem-retrato-feliz-confiante-apreciar-africano-jovem-preto-americano-sorridente-emocao-foto.jpg"
              />
            </Box>
            <Box as="div">
              <Text
                as="h2"
                fontWeight={barberTheme.fontWeights.bold}
                fontSize="16px"
              >
                Pedro Sales
              </Text>
              <Text as="h4">pedrosales@gmail.com</Text>
            </Box>
          </Box>
          <Box
            as="ul"
            borderBottom={`1px solid ${barberTheme.colors.primary.gray}`}
          >
            <Text
              as="li"
              display="flex"
              alignItems="center"
              height="44px"
              my="16px"
              width="310px"
              borderRadius="12px"
              color="white"
              padding="0 16px"
              cursor="pointer"
              backgroundColor={
                selectedItem === 'home'
                  ? barberTheme.colors.primary.orange
                  : 'transparent'
              }
              onClick={() => handleSelect('home')}
            >
              <Image src="/home.svg" boxSize="20px" marginRight="8px" />{' '}
              <Link
                to="/"
                style={{ flex: 1, textAlign: 'start', margin: '0 8px' }}
              >
                Início
              </Link>
            </Text>
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
                selectedItem === 'appointments'
                  ? barberTheme.colors.primary.orange
                  : 'transparent'
              }
              onClick={() => handleSelect('appointments')}
            >
              <Image src="/appointments.svg" boxSize="20px" marginRight="8px" />{' '}
              <Link
                to="/agendamentos"
                style={{ flex: 1, textAlign: 'start', margin: '0 8px' }}
              >
                Agendamentos
              </Link>
            </Text>
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
              <Image src="/whiteuser.svg" boxSize="20px" marginRight="8px" />{' '}
              <Link
                to="/"
                style={{ flex: 1, textAlign: 'start', margin: '0 8px' }}
              >
                Perfil
              </Link>
            </Text>
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
                selectedItem === 'barbeiros'
                  ? barberTheme.colors.primary.orange
                  : 'barbeiros'
              }
              onClick={() => handleSelect('barbeiros')}
            >
              <Image src="/barbeiros.svg" boxSize="20px" marginRight="8px" />{' '}
              <Link
                to="/barbeiros"
                style={{ flex: 1, textAlign: 'start', margin: '0 8px' }}
              >
                Barbeiros
              </Link>
            </Text>

            <Text
              as="li"
              display="flex"
              alignItems="center"
              height="44px"
              mt="16px"
              mb="32px"
              width="310px"
              borderRadius="12px"
              color="white"
              padding="0 16px"
              cursor="pointer"
              backgroundColor={
                selectedItem === 'clients'
                  ? barberTheme.colors.primary.orange
                  : 'clients'
              }
              onClick={() => handleSelect('clients')}
            >
              <Image src="/clients.svg" boxSize="20px" marginRight="8px" />{' '}
              <Link
                to="/servicos"
                style={{ flex: 1, textAlign: 'start', margin: '0 8px' }}
              >
                Serviços
              </Link>
            </Text>
          </Box>
          <Box as="ul" mt="32px">
            <Text
              as="li"
              display="flex"
              alignItems="center"
              height="44px"
              mt="16px"
              mb="32px"
              width="310px"
              borderRadius="12px"
              color="white"
              padding="0 16px"
              cursor="pointer"
              backgroundColor={
                selectedItem === 'logout'
                  ? barberTheme.colors.primary.orange
                  : 'logout'
              }
              onClick={() => {
                handleSelect('logout');
                onOpen();
              }}
            >
              <Image src="/logout.svg" boxSize="20px" marginRight="8px" />{' '}
              <Text style={{ flex: 1, textAlign: 'start', margin: '0 8px' }}>
                Sair da conta
              </Text>
            </Text>
          </Box>
          <VStack spacing={4}></VStack>
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
          _loading={{
            opacity: 0.4,
            color: 'white !important',
            backgroundColor: barberTheme.colors.primary.black + ' !important',
          }}
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
              _active={{ opacity: 0.4 }}
            >
              Fechar
            </Button>
            <Button
              onClick={logout}
              color="white"
              backgroundColor="red.400"
              _active={{ opacity: 0.4 }}
            >
              Sair
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Box as="main" paddingTop="74px" px="16px" overflow="hidden">
        {children}
      </Box>
    </Box>
  );
};
