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

import useAppointmentsList from '../hooks/useListAppointments';
import useDeleteAppointment from '../hooks/useDeleteAppointment';
import { CloseIcon } from '@chakra-ui/icons';

type Appointment = {
  id: string;
  data: string;
  hora: string;
  barbearia: {
    id: number;
    email: string;
    nome_barbearia: string;
    barbeiro: boolean;
    autorizado: boolean;
    endereco: string;
    phone: string;
    absent: boolean;
    email_verificado: boolean;
    logo: string | null;
    link: string;
  };
  cliente: {
    id: number;
    nome: string;
    telefone: string;
    hashIdClient: string;
  };
  barbeiro: {
    id: number;
    nome_completo: string;
    telefone: string;
    foto: string;
  };
  servico: {
    id: number;
    nome: string;
    descricao: string;
    preco: string;
    tempo: string;
    foto: string;
    barber_foto: string;
  };
};

export const AppointmentsList = () => {
  const { getAppointments, loading } = useAppointmentsList();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const { deleteAppointment, loading: loadingDeleteAppointment } =
    useDeleteAppointment();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [appointmentId, setAppointmentId] = useState<string>();
  // const { id } = useParams();

  const toast = useToast();

  const handleDeleteService = async () => {
    if (appointmentId) {
      const result = await deleteAppointment({ id: appointmentId });

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

      setAppointments((prevServices) =>
        prevServices.filter((s) => String(s.id) !== appointmentId)
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
    const fetchAppointments = async () => {
      const data = await getAppointments();

      setAppointments(data.data.data || []);
    };
    fetchAppointments();
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
      p="16px"
      as="section"
      maxWidth="402px"
      width="100%"
      display="flex"
      flexDirection="column"
      margin="0 auto"
    >
      <Box alignItems="center">
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
              Se você cancelar este agendamento, a ação será permanente e não
              poderá ser desfeita.
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
                isLoading={loadingDeleteAppointment}
                loadingText="Cancelando..."
                onClick={handleDeleteService}
                color="white"
                backgroundColor="red.400"
              >
                Cancelar
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
          Agendamentos
        </Text>
        <Text
          m="16px 0"
          fontWeight={barberTheme.fontWeights.bold}
          color={barberTheme.colors.primary.gray03}
          fontSize="16px"
          as="h1"
        >
          CONFIRMADOS
        </Text>
      </Box>
      <Box overflowY="auto">
        {appointments.length > 0 ? (
          appointments.map((appointment, index) => (
            <Box
              position="relative"
              key={index}
              display="flex"
              borderRadius="10px"
              padding="12px"
              border={`1px solid ${barberTheme.colors.primary.gray}`}
              maxHeight="136px"
            >
              <Box
                borderRight={`1px solid ${barberTheme.colors.primary.gray}`}
                width="70%"
              >
                <Box display="flex" justifyContent="space-between">
                  <Text
                    color={barberTheme.colors.primary.orange}
                    fontWeight={barberTheme.fontWeights.bold}
                  >
                    Confirmado
                  </Text>
                  <Text
                    cursor="pointer"
                    fontSize="12px"
                    color="red.400"
                    paddingRight="8px"
                  >
                    <CloseIcon
                      onClick={() => {
                        onOpen();
                        setAppointmentId(String(appointment.id));
                      }}
                    />
                  </Text>
                </Box>
                <Text
                  maxWidth="130px"
                  as="h2"
                  my="8px"
                  fontWeight={barberTheme.fontWeights.bold}
                  fontSize="18px"
                  color="white"
                >
                  {appointment.servico.nome}
                </Text>
                <Box display="flex">
                  <Image
                    borderRadius="12px"
                    height="24px"
                    width="24px"
                    objectFit="cover"
                    src="https://img.freepik.com/vetores-premium/logotipo-do-emblema-do-cracha-da-barbearia-com-icone-de-bigode-barba-logotipo-do-emblema-vintage-simples-hexagono-classico_645012-28.jpg?semt=ais_hybrid"
                  />
                  <Text color="white" mx="8px">
                    {appointment.barbearia.nome_barbearia}
                  </Text>
                </Box>
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                width="30%"
              >
                <Text fontSize="16px" color="white">
                  {new Date(appointment.data)
                    .toLocaleDateString('pt-BR', {
                      month: 'long',
                    })
                    .replace(/^\w/, (char) => char.toUpperCase())}
                </Text>
                <Text fontSize="32px" color="white">
                  {appointment.data.slice(8, 12)}
                </Text>

                <Text color="white" fontSize="16px">
                  {appointment.hora.slice(0, 5)}
                </Text>
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
            Nenhum agendamento...
          </Text>
        )}
      </Box>
      <Text
          m="16px 0"
          fontWeight={barberTheme.fontWeights.bold}
          color={barberTheme.colors.primary.gray03}
          fontSize="16px"
          as="h1"
        >
          FINALIZADOS
        </Text>
      <Box overflowY="auto">
        {appointments.length > 0 ? (
          appointments.map((appointment, index) => (
            <Box
              position="relative"
              key={index}
              display="flex"
              borderRadius="10px"
              padding="12px"
              border={`1px solid ${barberTheme.colors.primary.gray}`}
              maxHeight="136px"
            >
              <Box
                borderRight={`1px solid ${barberTheme.colors.primary.gray}`}
                width="70%"
              >
                <Box display="flex" justifyContent="space-between">
                  <Text
                    color={barberTheme.colors.primary.orange}
                    fontWeight={barberTheme.fontWeights.bold}
                  >
                    Confirmado
                  </Text>
                  <Text
                    cursor="pointer"
                    fontSize="12px"
                    color="red.400"
                    paddingRight="8px"
                  >
                    <CloseIcon
                      onClick={() => {
                        onOpen();
                        setAppointmentId(String(appointment.id));
                      }}
                    />
                  </Text>
                </Box>
                <Text
                  maxWidth="130px"
                  as="h2"
                  my="8px"
                  fontWeight={barberTheme.fontWeights.bold}
                  fontSize="18px"
                  color="white"
                >
                  {appointment.servico.nome}
                </Text>
                <Box display="flex">
                  <Image
                    borderRadius="12px"
                    height="24px"
                    width="24px"
                    objectFit="cover"
                    src="https://img.freepik.com/vetores-premium/logotipo-do-emblema-do-cracha-da-barbearia-com-icone-de-bigode-barba-logotipo-do-emblema-vintage-simples-hexagono-classico_645012-28.jpg?semt=ais_hybrid"
                  />
                  <Text color="white" mx="8px">
                    {appointment.barbearia.nome_barbearia}
                  </Text>
                </Box>
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                width="30%"
              >
                <Text fontSize="16px" color="white">
                  {new Date(appointment.data)
                    .toLocaleDateString('pt-BR', {
                      month: 'long',
                    })
                    .replace(/^\w/, (char) => char.toUpperCase())}
                </Text>
                <Text fontSize="32px" color="white">
                  {appointment.data.slice(8, 12)}
                </Text>

                <Text color="white" fontSize="16px">
                  {appointment.hora.slice(0, 5)}
                </Text>
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
            Nenhum agendamento...
          </Text>
        )}
      </Box>
    </Box>
  );
};

// <Button
//   onClick={() => {
//     onOpen();
//     setAppointmentId(String(appointment.id));
//   }}
//                   height="30px"
//                   backgroundColor="red.400"
//                   color="white"
//                 >
//                   Cancelar
//                 </Button>
