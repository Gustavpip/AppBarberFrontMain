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
} from '@chakra-ui/react';
import barberTheme from '../theme';
import useBarberList from '../hooks/useBarberList';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useBarberDelete from '../hooks/useBarberDelete';

type Barber = {
  id: number;
  nome_completo: string;
  telefone: string;
  foto: string;
};

export const BarbersList = () => {
  const { getBarbers, loading } = useBarberList();
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const { deleteBarber, loading: loadingDelete } = useBarberDelete();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [barberId, setBarberId] = useState<string>();

  const toast = useToast();

  const handleDeleteBarber = async () => {
    if (barberId) {
      const result = await deleteBarber({ id: barberId });

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

      setBarbers((prevBarbers) =>
        prevBarbers.filter((b) => String(b.id) !== barberId)
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
    const fetchBarbers = async () => {
      const data = await getBarbers();
      console.log(data.data.data);
      setBarbers(data.data.data || []);
    };
    fetchBarbers();
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <Center height="calc(92vh - 73px)">
        <Spinner size="xl" color={barberTheme.colors.primary.orange} />
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
      <Box display="flex" justifyContent="space-between" alignItems="center">
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
                onClick={onClose}
                _active={{ opacity: 0.4 }}
              >
                Fechar
              </Button>
              <Button
                isLoading={loadingDelete}
                loadingText="Excluindo..."
                onClick={handleDeleteBarber}
                color="white"
                _loading={{
                  opacity: 0.4,
                  color: 'white !important',
                  backgroundColor: 'red.400 !important',
                }}
                backgroundColor="red.400"
                _active={{ opacity: 0.4 }}
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
          Barbeiros
        </Text>
        <Link to="/barbeiros/cadastro">
          <Button
            _active={{ opacity: 0.4 }}
            _hover={{}}
            height="30px"
            color={barberTheme.colors.neutral.white}
            background={barberTheme.colors.primary.orange}
          >
            Cadastrar
          </Button>
        </Link>
      </Box>
      <Box overflowY="auto">
        {barbers.length > 0 ? (
          barbers.map((barber) => (
            <Box
              key={barber.id}
              display="flex"
              borderRadius="10px"
              padding="12px"
              my="8px"
              border={`1px solid ${barberTheme.colors.primary.gray}`}
            >
              <Image
                borderRadius="10px"
                height="110px"
                width="110px"
                objectFit="cover"
                src={barber.foto}
              />
              <Box as="div" ml="10px">
                <Text
                  as="h2"
                  fontWeight={barberTheme.fontWeights.bold}
                  fontSize="16px"
                  color="white"
                >
                  {barber.nome_completo}
                </Text>
                <Text
                  my="4px"
                  fontSize="14px"
                  color={barberTheme.colors.primary.gray03}
                  as="h4"
                >
                  {barber.nome_completo} - Barbeiro
                </Text>
                <Box display="flex" alignItems="end" justifyContent="end">
                  <Button
                    _active={{ opacity: 0.4 }}
                    mr="8px"
                    mt="30px"
                    height="30px"
                    backgroundColor={barberTheme.colors.primary.gray}
                    color="white"
                  >
                    Editar
                  </Button>
                  <Button
                    onClick={() => {
                      onOpen();
                      setBarberId(String(barber.id));
                    }}
                    mt="30px"
                    height="30px"
                    backgroundColor="red.400"
                    color="white"
                    _active={{ opacity: 0.4 }}
                  >
                    Excluir
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
            Nenhum barbeiro cadastrado...
          </Text>
        )}
      </Box>
    </Box>
  );
};
