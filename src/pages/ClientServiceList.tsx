import {
  Box,
  Button,
  Center,
  Image,
  Spinner,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
  VStack,
  Slide,
  IconButton,
} from '@chakra-ui/react';
import barberTheme from '../theme';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import useServiceList from '../hooks/useServiceList';
import useServiceDelete from '../hooks/useServiceDelete';
import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';

type Service = {
  id: number;
  nome: string;
  preco: number;
  foto: string;
  descricao: string;
};

export const ClientServiceList = () => {
  const { getServices, loading } = useServiceList();
  const [services, setServices] = useState<Service[]>([]);
  const { deleteService, loading: loadingDelete } = useServiceDelete();
  const { isOpen, onClose } = useDisclosure();
  const [isOpenSchedule, setIsOpenSchedule] = useState(false);
  const [serviceId, setServiceId] = useState<string>();
  const { token } = useParams();

  const toast = useToast();

  const toggleMenuSchedule = () => setIsOpenSchedule(!isOpenSchedule);

  const handleDeleteService = async () => {
    if (serviceId) {
      const result = await deleteService({ id: serviceId });

      if (!result.success) {
        toast({
          title: 'Erro ao excluir',
          description: result?.data.response.data.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        return;
      }

      setServices((prevServices) =>
        prevServices.filter((s) => String(s.id) !== serviceId)
      );
      onClose();

      toast({
        title: 'Sucesso',
        description: result?.data.data.message,
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  useEffect(() => {
    const fetchServices = async () => {
      const data = await getServices(token);
      setServices(data.data.data || []);
    };
    fetchServices();
  }, []);

  if (loading) {
    return (
      <Center height="0vh">
        <Spinner size="lg" color={barberTheme.colors.primary.orange} />
      </Center>
    );
  }

  return (
    <Box
      as="section"
      display="flex"
      flexDirection="column"
      maxWidth="540px"
      margin="0 auto"
    >
      <Box
        width="100%"
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
          </Box>
          <Box>
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
      <Slide direction="right" in={isOpenSchedule} style={{ zIndex: 1 }}>
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
              width="312px"
              borderRadius="12px"
              color="white"
              padding="0 16px"
              cursor="pointer"
            >
              <Image src="/whiteuser.svg" boxSize="20px" marginRight="8px" />{' '}
              <Link
                to="/"
                style={{ flex: 1, textAlign: 'start', margin: '0 8px' }}
              >
                Dados
              </Link>
            </Text>
            <Text
              as="li"
              display="flex"
              alignItems="center"
              height="44px"
              mt="16px"
              mb="16px"
              width="312px"
              borderRadius="12px"
              color="white"
              padding="0 16px"
              cursor="pointer"
            >
              <Image src="/appointments.svg" boxSize="20px" marginRight="8px" />{' '}
              <Link
                to="/"
                style={{ flex: 1, textAlign: 'start', margin: '0 8px' }}
              >
                Agendamentos
              </Link>
            </Text>
          </Box>

          <VStack spacing={4}></VStack>
        </Box>
      </Slide>

      <Box
        p="16px"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Modal isOpen={isOpen} onClose={onClose}>
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
              Isso não poderá ser desfeito.
            </ModalBody>
            <ModalFooter>
              <Button
                backgroundColor={barberTheme.colors.primary.gray}
                color="white"
                mr={3}
                _active={{ opacity: 0.4 }}
                onClick={onClose}
              >
                Fechar
              </Button>
              <Button
                _active={{ opacity: 0.4 }}
                isLoading={loadingDelete}
                loadingText="Excluindo..."
                onClick={handleDeleteService}
                color="white"
                backgroundColor="red.400"
                _loading={{
                  opacity: 0.4,
                  color: 'white !important',
                  backgroundColor: 'red.400 !important',
                }}
              >
                Excluir
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Text
          m="16px 0"
          fontWeight={barberTheme.fontWeights.bold}
          color="white"
          fontSize="18px"
          as="h1"
        >
          Serviços
        </Text>
      </Box>
      <Box p="16px" overflowY="auto">
        {services.length > 0 ? (
          services.map((service) => (
            <Box
              position="relative"
              key={service.id}
              display="flex"
              borderRadius="10px"
              padding="12px"
              border={`1px solid ${barberTheme.colors.primary.gray}`}
              maxHeight="136px"
            >
              <Image
                borderRadius="10px"
                height="110px"
                width="110px"
                objectFit="cover"
                src={service.foto}
              />
              <Box
                as="div"
                ml="10px"
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
              >
                <Text
                  maxWidth="130px"
                  as="h2"
                  fontWeight={barberTheme.fontWeights.bold}
                  fontSize="16px"
                  color="white"
                >
                  {service.nome}
                </Text>
                <Text
                  mt="4px"
                  fontSize="14px"
                  color={barberTheme.colors.primary.gray03}
                  as="h4"
                >
                  {service.descricao}
                </Text>

                <Text
                  position="absolute"
                  right="12px"
                  top="12px"
                  fontSize="14px"
                  color={barberTheme.colors.primary.orange}
                  as="h4"
                >
                  R$ {String(service.preco).replace('.', ',')}
                </Text>
                <Box>
                  <Button
                    onClick={() => {
                      toggleMenuSchedule();
                      setServiceId(String(service.id));
                    }}
                    float="right"
                    _active={{ opacity: 0.4 }}
                    height="30px"
                    backgroundColor={barberTheme.colors.primary.gray}
                    color="white"
                  >
                    Reservar
                  </Button>
                </Box>
              </Box>
            </Box>
          ))
        ) : (
          <Text
            marginY="128px"
            textAlign="center"
            alignSelf="center"
            fontSize="18px"
            color={barberTheme.colors.primary.gray}
          >
            Nenhum serviço cadastrado...
          </Text>
        )}
      </Box>
    </Box>
  );
};
