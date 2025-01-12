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
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useServiceList from '../hooks/useServiceList';
import useServiceDelete from '../hooks/useServiceDelete';

type Service = {
  id: number;
  nome: string;
  preco: number;
  foto: string;
  descricao: string;
  barber_foto: string;
};

export const ServiceList = () => {
  const { getServices, loading } = useServiceList();
  const [services, setServices] = useState<Service[]>([]);
  const { deleteService, loading: loadingDelete } = useServiceDelete();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [serviceId, setServiceId] = useState<string>();
  // const { id } = useParams();

  const toast = useToast();

  const handleDeleteService = async () => {
    window.scrollTo(0, 0);
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
      const data = await getServices();
      setServices(data.data.data || []);
    };
    fetchServices();
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
      pt="16px"
      as="section"
      maxWidth="540px"
      margin="0 auto"
      width="100%"
      display="flex"
      flexDirection="column"
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
                _active={{ opacity: 0.4 }}
                onClick={onClose}
                _hover={{
                  opacity: 0.4,
                }}
              >
                Fechar
              </Button>
              <Button
                isLoading={loadingDelete}
                loadingText="Excluindo..."
                onClick={handleDeleteService}
                color="white"
                _active={{ opacity: 0.4 }}
                backgroundColor="red.400"
                _hover={{
                  opacity: 0.4,
                }}
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
        <Link to="/servicos/cadastro">
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
        {services.length > 0 ? (
          services.map((service) => (
            <Box
              position="relative"
              key={service.id}
              my="8px"
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
                objectFit="contain"
                src={service.barber_foto}
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
                  color={barberTheme.colors.primary.gray03}
                  as="h4"
                >
                  R${String(service.preco).replace('.', ',')}
                </Text>
                <Box>
                  <Link to={`/servico/${service.id}`}>
                    <Button
                      mx="4px"
                      height="30px"
                      backgroundColor={barberTheme.colors.primary.gray}
                      color="white"
                      _active={{ opacity: 0.4 }}
                      _hover={{
                        opacity: 0.4,
                      }}
                    >
                      Editar
                    </Button>
                  </Link>
                  <Button
                    onClick={() => {
                      onOpen();
                      setServiceId(String(service.id));
                    }}
                    height="30px"
                    backgroundColor="red.400"
                    color="white"
                    _active={{ opacity: 0.4 }}
                    _hover={{
                      opacity: 0.4,
                    }}
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
            Nenhum serviço cadastrado...
          </Text>
        )}
      </Box>
    </Box>
  );
};
