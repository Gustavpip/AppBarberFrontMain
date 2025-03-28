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
import { ChevronDownIcon, CloseIcon } from '@chakra-ui/icons';
import { Link, useParams } from 'react-router-dom';
import useCancelAppointment from '../hooks/useCancelAppointment';

import ReactLoading from 'react-loading';

type Appointment = {
  id: string;
  data: string;
  hora: string;
  status: boolean;
  cancelado: boolean;
  andamento: boolean;
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

export const AppointmentsListClient = () => {
  const { getAppointments, loading } = useAppointmentsList();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [inactiveAppointments, setInactiveAppointments] = useState<
    Appointment[]
  >([]);
  const [reload, setReload] = useState(false);
  const { cancelAppointment, loading: cancelLoading } = useCancelAppointment();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [appointmentId, setAppointmentId] = useState<string>();
  const { token, hashIdClient } = useParams();

  const toast = useToast();

  const handleCancelAppointment = async () => {
    if (appointmentId) {
      try {
        const result = await cancelAppointment({ appointmentId });

        if (!result.success) {
          toast({
            title: 'Erro ao cancelar',
            description:
              result?.data?.response?.data?.message ||
              'Ocorreu um erro ao tentar cancelar o agendamento.',
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
          });
          return;
        }

        setAppointments((prevAppointments) => {
          const updatedAppointments = prevAppointments.filter(
            (s) => String(s.id) !== appointmentId
          );
          const canceledAppointment = prevAppointments.find(
            (s) => String(s.id) === appointmentId
          );

          if (canceledAppointment) {
            setInactiveAppointments((prevInactive) => [
              ...prevInactive,
              canceledAppointment,
            ]);
          }

          return updatedAppointments;
        });

        onClose();
        if (result.success) {
          toast({
            title: 'Sucesso',
            description:
              result?.data?.data?.message ||
              'Agendamento cancelado com sucesso.',
            status: 'success',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
          });
          setReload((prev) => !prev);
        } else {
          toast({
            title: 'Erro',
            description:
              result?.data?.data?.message ||
              'Erro interno. Tente novamente mais tarde.',
            status: 'success',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
          });
        }
      } catch (error) {
        toast({
          title: 'Erro ao cancelar',
          description:
            'Ocorreu um erro inesperado. Tente novamente mais tarde.',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      }
    }
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      const data = await getAppointments(token, hashIdClient);
      if (!data.success) {
        toast({
          title: 'Erro ao consultar',
          description:
            data?.data?.response?.data?.message ||
            'Ocorreu um erro ao consultar os agendamentos. Atualize a página.',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        return;
      }
      const appointmentsActive = data.data.data.filter(
        (appointment: Appointment) =>
          appointment.status !== true &&
          appointment.cancelado !== true &&
          !appointment.andamento
      );

      const appointmenetsInactive = data.data.data.filter(
        (appointment: Appointment) =>
          appointment.status || appointment.cancelado || appointment.andamento
      );

      setInactiveAppointments(appointmenetsInactive);
      setAppointments(appointmentsActive);
    };

    fetchAppointments();
    window.scrollTo(0, 0);
  }, [reload]); // Reexecuta o fetch apenas quando `reload` mudar

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
      width="100%"
      display="flex"
      flexDirection="column"
      margin="0 auto"
      height="calc(92vh - 73px)"
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
                _active={{ opacity: 0.4 }}
                mr={3}
                onClick={onClose}
                _hover={{
                  opacity: 0.4,
                }}
              >
                Fechar
              </Button>
              <Button
                isLoading={cancelLoading}
                loadingText="Cancelando..."
                onClick={handleCancelAppointment}
                color="white"
                _loading={{
                  opacity: 0.4,
                  color: 'white !important',
                  backgroundColor: 'red.400 !important',
                }}
                _active={{ opacity: 0.4 }}
                _hover={{
                  opacity: 0.4,
                }}
                backgroundColor="red.400"
              >
                Sim
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        {/* Títulos */}
        <Box flexShrink={0}>
          <Text
            fontWeight={barberTheme.fontWeights.bold}
            color="white"
            fontSize="18px"
            as="h1"
            position="sticky"
            top="0"
            bg={barberTheme.colors.primary.black}
            zIndex="10"
            padding="8px 0"
          >
            Agendamentos
          </Text>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Text
              m="8px 0"
              fontWeight={barberTheme.fontWeights.bold}
              color={barberTheme.colors.primary.gray03}
              fontSize="16px"
              as="h1"
              position="sticky"
              top="32px"
              bg={barberTheme.colors.primary.black}
              zIndex="10"
              padding="8px 0"
            >
              CONFIRMADOS
            </Text>

            <Link to={`/agendar/${token}`}>
              <Button
                _active={{ opacity: 0.4 }}
                _hover={{}}
                height="30px"
                color={barberTheme.colors.neutral.white}
                background={barberTheme.colors.primary.orange}
              >
                Novo +
              </Button>
            </Link>
          </Box>
        </Box>
      </Box>
      <Box
        minHeight={`${
          appointments.length < 1
            ? '50px'
            : appointments.length === 1
              ? '150px'
              : '300px'
        }`}
        borderTop={`2px solid ${barberTheme.colors.primary.gray}`}
        borderBottom={`2px solid ${barberTheme.colors.primary.gray}`}
        overflowY={`${appointments.length < 1 ? 'visible' : 'auto'}`}
        maxHeight={`${appointments.length < 1 ? '32px' : '300px'}`}
      >
        {appointments.length > 0 ? (
          appointments.map((appointment, index) => (
            <Box
              backgroundColor="#1A1B1F"
              my="8px"
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
                    borderRadius="16px"
                    padding="2px 8px"
                    background={barberTheme.colors.primary.black}
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
                  maxWidth="94%"
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
                    {appointment?.cliente.nome}
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
            textAlign="center"
            alignSelf="center"
            fontSize="18px"
            paddingTop="8px"
            color={barberTheme.colors.primary.gray}
          >
            Nenhum agendamento...
          </Text>
        )}
      </Box>
      {appointments.length >= 2 && (
        <Text textAlign="center" color={barberTheme.colors.primary.gray}>
          <ChevronDownIcon className="scroll-animation" fontSize="24px" />
        </Text>
      )}
      <Box flexShrink={0}>
        <Text
          m="8px 0"
          fontWeight={barberTheme.fontWeights.bold}
          color={barberTheme.colors.primary.gray03}
          fontSize="16px"
          as="h1"
          position="sticky"
          top="64px"
          bg={barberTheme.colors.primary.black}
          zIndex="10"
          padding="8px 0"
        >
          ANDAMENTO / FINALIZADOS
        </Text>
      </Box>
      <Box
        minHeight={`${
          inactiveAppointments.length < 1
            ? '50px'
            : inactiveAppointments.length === 1
              ? '110px'
              : '220px'
        }`}
        borderTop={`2px solid ${barberTheme.colors.primary.gray}`}
        borderBottom={`2px solid ${barberTheme.colors.primary.gray}`}
        overflowY={`${inactiveAppointments.length < 1 ? 'visible' : 'auto'}`}
        maxHeight={`${inactiveAppointments.length < 1 ? '32px' : '320px'}`}
      >
        {inactiveAppointments.length > 0 ? (
          inactiveAppointments.map((appointment, index) => (
            <Box
              backgroundColor="#1A1B1F"
              my="8px"
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
                <Box display="flex" alignItems="center">
                  <Text
                    alignItems="center"
                    display="flex"
                    color={
                      appointment.cancelado
                        ? 'red.400'
                        : appointment.status
                          ? barberTheme.colors.primary.gray03
                          : barberTheme.colors.primary.orange
                    }
                    borderRadius="16px"
                    padding="2px 8px"
                    background={
                      appointment.status
                        ? barberTheme.colors.primary.gray
                        : barberTheme.colors.primary.black
                    }
                    fontWeight={barberTheme.fontWeights.bold}
                  >
                    {appointment.cancelado
                      ? 'Cancelado'
                      : appointment.andamento
                        ? 'Andamento'
                        : 'Finalizado'}
                  </Text>
                  <Box>
                    {appointment.andamento && (
                      <ReactLoading
                        type="bubbles"
                        color={barberTheme.colors.primary.orange}
                        height={20}
                        width={20}
                      />
                    )}
                  </Box>
                </Box>
                <Text
                  maxWidth="94%"
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
                    {appointment?.cliente.nome}
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
            textAlign="center"
            alignSelf="center"
            fontSize="18px"
            paddingTop="8px"
            color={barberTheme.colors.primary.gray}
          >
            Nenhum agendamento...
          </Text>
        )}
      </Box>
      {inactiveAppointments.length >= 2 && (
        <Text textAlign="center" color={barberTheme.colors.primary.gray}>
          <ChevronDownIcon className="scroll-animation" fontSize="24px" />
        </Text>
      )}
    </Box>
  );
};
