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
import { useAuth } from '../context/AuthContext';

export const Dashboard = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string>('');
  const { isOpen: isOpenModal, onOpen, onClose } = useDisclosure();
  const { user } = useAuth();
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
        zIndex={101}
        backdropFilter={isOpen ? '' : 'blur(10px)'}
        background={isOpen ? '' : 'rgba(255, 255, 255, 0.1)'}
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
                width="40px"
                borderRadius="12%"
                src={user?.logo}
                alt="Logo"
                objectFit="cover"
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
      {/* here*/}
      <Slide
        direction="right"
        in={isOpen}
        style={{ zIndex: 100, maxWidth: '400px' }} // ZIndex dinâmico com base no breakpoint
      >
        <Box
          position="fixed"
          top="0"
          right="0"
          height="100vh"
          width="100%"
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
            alignItems="start"
            flexDirection="row"
            borderBottom={`1px solid ${barberTheme.colors.primary.gray}`}
          >
            <Box
              mr="12px"
              display="flex"
              justifyContent="center"
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
                src={user?.logo}
              />
            </Box>
            <Box as="div">
              <Text
                as="h2"
                fontWeight={barberTheme.fontWeights.bold}
                fontSize="16px"
              >
                {user?.nome_barbearia}
              </Text>
              <Text as="h4">{user?.email}</Text>
            </Box>
          </Box>
          <Box
            as="ul"
            borderBottom={`1px solid ${barberTheme.colors.primary.gray}`}
          >
            <Link
              to="/"
              style={{
                flex: 1,
                textAlign: 'start',
                maxHeight: '46px !important',
              }}
            >
              <Text
                as="li"
                display="flex"
                alignItems="center"
                height="44px"
                width="310px"
                borderRadius="12px"
                color="white"
                mt="16px"
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
                Início
              </Text>
            </Link>

            <Link
              to="/agendamentos"
              style={{ flex: 1, textAlign: 'start', margin: '0 8px' }}
            >
              <Text
                as="li"
                display="flex"
                alignItems="center"
                height="44px"
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
                <Image
                  src="/appointments.svg"
                  boxSize="20px"
                  marginRight="8px"
                />{' '}
                Agendamentos
              </Text>
            </Link>

            <Link
              to="/perfil"
              style={{ flex: 1, textAlign: 'start', margin: '0 8px' }}
            >
              <Text
                as="li"
                display="flex"
                alignItems="center"
                height="44px"
                width="310px"
                borderRadius="12px"
                color="white"
                padding="0 16px"
                cursor="pointer"
                backgroundColor={
                  selectedItem === 'perfil'
                    ? barberTheme.colors.primary.orange
                    : 'transparent'
                }
                onClick={() => handleSelect('perfil')}
              >
                <Image src="/whiteuser.svg" boxSize="20px" marginRight="8px" />{' '}
                Perfil
              </Text>
            </Link>

            <Link
              to="/barbeiros"
              style={{ flex: 1, textAlign: 'start', margin: '0 8px' }}
            >
              <Text
                as="li"
                display="flex"
                alignItems="center"
                height="44px"
                width="310px"
                borderRadius="12px"
                color="white"
                padding="0 16px"
                cursor="pointer"
                backgroundColor={
                  selectedItem === 'barbeiros'
                    ? barberTheme.colors.primary.orange
                    : 'transparent'
                }
                onClick={() => handleSelect('barbeiros')}
              >
                <Image src="/barbeiros.svg" boxSize="20px" marginRight="8px" />{' '}
                Barbeiros
              </Text>
            </Link>

            <Link
              to="/servicos"
              style={{ flex: 1, textAlign: 'start', margin: '0 8px' }}
            >
              <Text
                as="li"
                display="flex"
                alignItems="center"
                height="44px"
                width="310px"
                borderRadius="12px"
                color="white"
                padding="0 16px"
                cursor="pointer"
                backgroundColor={
                  selectedItem === 'clients'
                    ? barberTheme.colors.primary.orange
                    : 'transparent'
                }
                onClick={() => handleSelect('clients')}
              >
                <Image src="/clients.svg" boxSize="20px" marginRight="8px" />{' '}
                Serviços
              </Text>
            </Link>
          </Box>

          <Box as="ul" mt="32px">
            <Text
              as="li"
              display="flex"
              alignItems="center"
              height="44px"
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
              _hover={{
                opacity: 0.4,
              }}
            >
              Fechar
            </Button>
            <Button
              onClick={logout}
              color="white"
              backgroundColor="red.400"
              _active={{ opacity: 0.4 }}
              _hover={{
                opacity: 0.4,
              }}
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
