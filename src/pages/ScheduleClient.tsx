import {
  Box,
  Button,
  Stack,
  Text,
  useToast,
  InputGroup,
  Center,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  useDisclosure,
  Image,
  Input,
  Progress,
} from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import { CustomInput } from '../components/forms/CustomInput';
import { BarberDTO, Scheduling, ServiceDTO } from '../types/allTypes';
import { useForm } from 'react-hook-form';
import barberTheme from '../theme';
import { useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useScheduling from '../hooks/useScheduling';
import useServiceList from '../hooks/useServiceList';
import 'react-calendar/dist/Calendar.css';

import 'react-calendar/dist/Calendar.css';
import moment from 'moment';

import Calendar from 'react-calendar';

import useBarberList from '../hooks/useBarberList';
import useHoursList from '../hooks/useHoursList';
import useGetUser from '../hooks/useGetUser';

import { useState } from 'react';

const CountdownProgressBar = ({
  linkAppointments,
  resetTrigger, // Dependência que muda quando um agendamento é feito
}: {
  linkAppointments: string;
  resetTrigger: number; // Um número que muda sempre que um novo agendamento é feito
}) => {
  const [timeLeft, setTimeLeft] = useState(() => {
    const savedTime = localStorage.getItem('timeLeft');
    return savedTime ? parseInt(savedTime) : 300;
  });
  const [progress, setProgress] = useState(100);
  const navigate = useNavigate();

  // Função para reiniciar o contador
  const resetCountdown = () => {
    setTimeLeft(300);
    localStorage.setItem('timeLeft', '300');
  };

  // Reseta o contador quando resetTrigger muda (novo agendamento)
  useEffect(() => {
    resetCountdown();
  }, [resetTrigger]);

  useEffect(() => {
    localStorage.setItem('timeLeft', timeLeft.toString());

    if (timeLeft <= 0) {
      localStorage.removeItem('timeLeft');
      navigate(linkAppointments);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => Math.max(prevTime - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, navigate, linkAppointments]);

  useEffect(() => {
    setProgress((timeLeft / 300) * 100);
  }, [timeLeft]);

  return (
    <Box textAlign="center" w="100%">
      <Text color="white" fontSize="lg" mb="4">
        Tempo Restante: {Math.floor(timeLeft / 60)}:
        {String(timeLeft % 60).padStart(2, '0')}
      </Text>
      <Progress
        value={progress}
        size="lg"
        bg={barberTheme.colors.primary.gray}
        sx={{
          '& div[role=progressbar]': {
            backgroundColor: barberTheme.colors.primary.orange,
          },
        }}
        borderRadius="8px"
      />
    </Box>
  );
};

export default CountdownProgressBar;

export const ScheduleClient = () => {
  const {
    register,
    reset,
    handleSubmit,

    formState: { errors },
    watch,
  } = useForm<
    Pick<
      Scheduling,
      'barbeiro_id' | 'data' | 'hora' | 'nome' | 'servico_id' | 'telefone'
    >
  >();

  const [currentStep, setCurrentStep] = useState(1);
  const [hourSchedule, sethourSchedule] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedBarber, setSelectedBarber] = useState<string[]>([]);
  const [linkAppointments, setLinkAppointments] = useState('');
  const [resetTrigger] = useState(0);
  const [hashPix, setHashPix] = useState('');
  const [hours, setHours] = useState<string[]>([]);
  const [absent, setAbsent] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(
    moment(new Date()).format('YYYY-MM-DD')
  );

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [services, setServices] = useState<ServiceDTO[]>([]);
  const [barbers, setBarbers] = useState<BarberDTO[]>([]);

  const { createScheduling, loading } = useScheduling();
  const { getServices } = useServiceList();
  const { getBarbers } = useBarberList();
  const { getHours, loading: loadingHours } = useHoursList();
  const { getUser, loading: loadingUser } = useGetUser();

  const inputRef = useRef<HTMLInputElement>(null);

  const { token } = useParams();

  const handleCopy = () => {
    if (inputRef.current) {
      navigator.clipboard.writeText(inputRef.current.value).then(() => {
        toast({
          title: 'Link copiado!',
          description: 'O link foi copiado para a área de transferência.',
          status: 'success',
          duration: 2000,
          isClosable: true,
          position: 'top-right',
        });
      });
    }
  };

  const handleDateChange = async (date: any) => {
    const formattedDate = moment(date).format('YYYY-MM-DD');
    setSelectedDate(formattedDate);

    const response = await getHours(
      token ? token : '',
      selectedBarber[0],
      formattedDate
    );

    if (!response.success) {
      toast({
        title: 'Erro ao buscar',
        description: response?.data?.response?.data?.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      setHours([]);
      return;
    }

    setHours(response.data.data);
  };

  const handleSelect = (service: string) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(service) ? [] : [service]
    );
  };

  const handleSelectBarber = (service: string) => {
    setSelectedBarber((prevSelected) =>
      prevSelected.includes(service) ? [] : [service]
    );
  };

  const handlehourSchedule = (hour: string) => {
    sethourSchedule((prevSchedule) =>
      prevSchedule.includes(hour) ? [] : [hour]
    );
  };

  useEffect(() => {
    const fetchUser = async () => {
      const result = await getUser(token);
      if (result?.data.data.absent) {
        setAbsent(true);
        toast({
          title: 'A barbearia não está aceitando novos agendamentos para hoje.',
          status: 'error',
          duration: 5000,
          position: 'top-right',
          isClosable: true,
        });
        return;
      }
    };

    const fetchBarbers = async () => {
      const result = await getBarbers(token);
      setBarbers(result.data.data);
    };
    const fetchServices = async () => {
      const response = await getServices(token);
      setServices(response.data.data);
    };
    fetchUser();
    fetchServices();
    fetchBarbers();
  }, []);

  useEffect(() => {
    if (selectedBarber.length > 0) {
      const fetchHours = async () => {
        const response = await getHours(
          token ? token : '',
          selectedBarber[0],
          selectedDate
        );

        setHours(response.data.data);
      };
      fetchHours();
    }
  }, [selectedBarber, selectedDate]);

  const toast = useToast();

  const onSubmit = async (
    data: Pick<
      Scheduling,
      | 'id'
      | 'data'
      | 'barbeiro_id'
      | 'hora'
      | 'nome'
      | 'servico_id'
      | 'telefone'
      | 'barbearia_id'
    >
  ) => {
    if (hourSchedule.length < 1) {
      toast({
        title: 'Por favor, selecione um horário',
        status: 'error',
        duration: 3000,
        position: 'top-right',
        isClosable: true,
      });
      return;
    }
    if (!selectedDate) {
      toast({
        title: 'Por favor, selecione uma data',
        status: 'error',
        duration: 3000,
        position: 'top-right',
        isClosable: true,
      });
      return;
    }
    if (
      typeof data.nome === 'string' &&
      data.nome.trim().length > 2 &&
      typeof data.telefone === 'string' &&
      data.telefone.trim().length > 8 &&
      selectedItems.length > 0 &&
      selectedBarber.length > 0 &&
      hourSchedule.length > 0 &&
      selectedDate !== undefined
    ) {
      data.data = selectedDate;
      data.hora = hourSchedule[0];
      data.barbearia_id = token ? token : '';
      data.barbeiro_id = selectedBarber[0];
      data.servico_id = selectedItems[0];

      const result = await createScheduling(data);

      if (!result.success) {
        toast({
          title: 'Erro ao agendar',
          description: result?.data?.response?.data?.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      } else if (result.success) {
        // toast({
        //   title: 'Sucesso',
        //   description: 'Agendamento realizado com sucesso.',
        //   status: 'success',
        //   duration: 5000,
        //   isClosable: true,
        //   position: 'top-right',
        // });
        reset();
        // navigate(
        //   `/agendamentos/${token}/${result.data.data.cliente.hashIdClient}`
        // );
        setHashPix(result.data.data.hash_pix);
        setLinkAppointments(
          `/agendamentos/${token}/${result.data.data.cliente.hashIdClient}`
        );
      }
    } else {
      toast({
        title:
          'Por favor, preencha todos os campos corretamente antes de continuar',
        status: 'error',
        duration: 3000,
        position: 'top-right',
        isClosable: true,
      });
    }
  };

  const handleNextStep = () => {
    const nome_completo = watch('nome');
    const telefone = watch('telefone');

    if (telefone?.trim().length < 11 || telefone?.trim().length > 11) {
      toast({
        title:
          'Por favor, informe um telefone válido no formato correto (DDD + 9 + número)',
        status: 'error',
        duration: 3000,
        position: 'top-right',
        isClosable: true,
      });
      return;
    }

    if (nome_completo?.trim()?.length < 3) {
      toast({
        title: 'Por favor, informe um nome válido',
        status: 'error',
        duration: 3000,
        position: 'top-right',
        isClosable: true,
      });
      return;
    }

    if (nome_completo && telefone) {
      if (currentStep === 1) {
        setCurrentStep(2);
      }

      if (currentStep === 2) {
        if (selectedItems.length > 0) {
          setCurrentStep(3);
        } else {
          toast({
            title: 'Por favor, selecione o serviço.',
            status: 'error',
            duration: 3000,
            position: 'top-right',
            isClosable: true,
          });
        }
      }
      if (currentStep === 3) {
        if (selectedBarber.length > 0) {
          setCurrentStep(4);
          setSelectedDate(moment(new Date()).format('YYYY-MM-DD'));
        } else {
          toast({
            title: 'Por favor, selecione o barbeiro',
            status: 'error',
            duration: 3000,
            position: 'top-right',
            isClosable: true,
          });
        }
      }
    } else {
      toast({
        title:
          'Por favor, preencha todos os campos corretamente antes de continuar.',
        status: 'error',
        duration: 3000,
        position: 'top-right',
        isClosable: true,
      });
    }
  };

  const handlePreviousStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
    if (currentStep === 3) setCurrentStep(2);
    if (currentStep === 4) setCurrentStep(3);
  };

  return (
    <Box
      position="relative"
      backgroundColor={barberTheme.colors.primary.black}
      display="flex"
      justifyContent="center"
      alignItems="center"
      maxWidth="540px"
      margin="0 auto"
      minHeight={
        currentStep === 1
          ? '73vh'
          : currentStep === 2
            ? '73vh'
            : currentStep === 3
              ? '73vh'
              : '80vh'
      }
    >
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          top="-2%"
          maxWidth="540px"
          transform="translateY(-50%)" // Centraliza verticalmente
          overflowY="hidden"
          justifyContent="center"
          alignItems="center"
          bg={barberTheme.colors.primary.black}
          color="white"
          minW="320px"
          mx="16px"
          maxHeight="640px"
          padding="32px 16px"
          border={`1px solid ${barberTheme.colors.primary.gray}`}
          borderRadius="8px"
          display="flex"
          flexDirection="column"
        >
          {loading ? (
            <Center height="100vh">
              <Spinner size="xl" color={barberTheme.colors.primary.orange} />
            </Center>
          ) : (
            <>
              <Image
                margin="0 auto"
                maxHeight="150px"
                maxWidth="150px"
                src="/logo-pix-520x520.png"
              />
              <ModalHeader
                fontWeight="bold"
                py="16px"
                fontSize="19px"
                textAlign="center"
              >
                Pagamento
              </ModalHeader>

              <ModalBody
                textAlign="center"
                color={barberTheme.colors.primary.orange}
              >
                <Text marginBottom="16px">
                  É necessário o pagamento antecipado de 50% do valor do
                  serviço. O não pagamento resultará no cancelamento do
                  agendamento.
                </Text>
                <CountdownProgressBar
                  resetTrigger={resetTrigger}
                  linkAppointments={linkAppointments}
                />
                <Box width="100%" marginTop="16px">
                  <Input
                    ref={inputRef}
                    _focus={{
                      borderColor: barberTheme.colors.primary.gray,
                    }}
                    borderColor={barberTheme.colors.primary.gray}
                    color={barberTheme.colors.primary.gray03}
                    outline="none"
                    maxWidth="100%"
                    height="44px"
                    defaultValue={hashPix}
                    isReadOnly
                  />
                  <Button
                    width="100%"
                    marginTop="16px"
                    backgroundColor={barberTheme.colors.primary.orange}
                    color="white"
                    onClick={handleCopy}
                    _hover={{ opacity: 0.4 }}
                    _active={{
                      opacity: 0.4,
                      background:
                        barberTheme.colors.primary.orange + '!important',
                    }}
                  >
                    Copiar
                  </Button>

                  <Link to={linkAppointments}>
                    <Button
                      width="100%"
                      marginTop="16px"
                      backgroundColor={barberTheme.colors.primary.black}
                      border={`1px solid ${barberTheme.colors.primary.gray}`}
                      color="white"
                      _hover={{ opacity: 0.4 }}
                      _active={{
                        opacity: 0.4,
                        background:
                          barberTheme.colors.primary.orange + '!important',
                      }}
                    >
                      Meus agendamentos
                    </Button>
                  </Link>
                </Box>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Box width="100%">
        <Text color={barberTheme.colors.primary.orange}>
          Etapa {currentStep} de 4
        </Text>
        <Text
          fontSize="18px"
          fontWeight={barberTheme.fontWeights.bold}
          margin="10px 0"
          color="white"
        >
          Agendar - Etapa {currentStep}
        </Text>
        <Stack
          width="100%"
          spacing={2}
          as="form"
          onSubmit={handleSubmit(onSubmit)}
        >
          {loadingUser ? (
            <Center height="2vh">
              <Spinner size="xl" color={barberTheme.colors.primary.orange} />
            </Center>
          ) : (
            currentStep === 1 && (
              <>
                <Box>
                  <>
                    <Box margin="16px 0">
                      <CustomInput
                        leftIcon={<img src="/User.svg" alt="User Icon" />}
                        register={register('nome', {
                          required: 'Nome é obrigatório',
                          validate: {
                            hasTwoWords: (value) =>
                              value.trim().split(/\s+/).length > 1 ||
                              'Informe o nome completo',
                            noSpacesOnly: (value) =>
                              value.trim().length > 3 ||
                              'Nome não pode ser vazio ou muito curto',
                          },
                        })}
                        id="nome"
                        placeholder="Nome completo"
                        type="text"
                        isRequired
                        isDisabled={absent ? true : false}
                        borderColor={
                          errors.nome
                            ? 'red.500'
                            : barberTheme.colors.primary.gray
                        }
                        color={barberTheme.colors.primary.gray03}
                        width="100%"
                        height="44px"
                      />
                    </Box>

                    <Box>
                      <CustomInput
                        leftIcon={
                          <img src="/Smartphone.svg" alt="Smartphone Icon" />
                        }
                        register={register('telefone', {
                          required: 'Telefone é obrigatório',
                          minLength: 10,
                          maxLength: 11,
                          validate: {
                            validPhone: (value) =>
                              /^\(?\d{2}\)?\s?9\d{4}-?\d{4}$/.test(
                                value.trim()
                              ) ||
                              'Informe um telefone válido no formato correto (DDD + 9 + número)',
                          },
                        })}
                        id="telefone"
                        placeholder="Whatsapp"
                        type="text"
                        isRequired
                        isDisabled={absent ? true : false}
                        borderColor={
                          errors.telefone
                            ? 'red.500'
                            : barberTheme.colors.primary.gray
                        }
                        color={barberTheme.colors.primary.gray03}
                        width="100%"
                        height="44px"
                      />
                    </Box>
                    <Text
                      width="100%"
                      fontSize="14px"
                      textAlign="left"
                      m="16px 0"
                      color={barberTheme.colors.primary.orange}
                    >
                      Por favor, insira o número com o DDD (2 dígitos), seguido
                      do 9 e o número de telefone.
                    </Text>
                  </>
                </Box>
              </>
            )
          )}

          {currentStep === 2 && (
            <InputGroup display="block">
              <Text mb="16px" color={barberTheme.colors.primary.orange}>
                Selecione o serviço
              </Text>
              <Box
                display="grid"
                gridTemplateColumns="repeat(2, 1fr)"
                gap="8px"
                width="100%"
              >
                {services.map((service, index) => (
                  <Box
                    onClick={() => handleSelect(service.id)}
                    key={index}
                    cursor="pointer"
                    p="32px"
                    width="100%"
                    height="120px"
                    display="flex"
                    alignItems="center"
                    fontSize="14px"
                    justifyContent="center"
                    borderRadius="8px"
                    position="relative"
                    backgroundColor={
                      selectedItems.includes(service.id)
                        ? barberTheme.colors.primary.orange
                        : barberTheme.colors.primary.gray
                    }
                    color="white"
                  >
                    <img src={service.foto} height="36px" width="36px" />
                    <Text position="absolute" bottom="8px">
                      {service.nome}
                    </Text>
                    <Text
                      position="absolute"
                      color={barberTheme.colors.primary.gray03}
                      top="8px"
                      right="8px"
                    >
                      R${service.preco}
                    </Text>
                  </Box>
                ))}
              </Box>
            </InputGroup>
          )}

          {currentStep === 3 && (
            <InputGroup display="block">
              <Text mb="16px" color={barberTheme.colors.primary.orange}>
                Selecione o barbeiro
              </Text>
              <Box
                display="grid"
                gridTemplateColumns="repeat(2, 1fr)"
                gap="8px"
              >
                {barbers.map((barber, index) => (
                  <Box
                    onClick={() => handleSelectBarber(barber.id)}
                    key={index}
                    cursor="pointer"
                    p="8px"
                    display="flex"
                    alignItems="center"
                    fontSize="14px"
                    justifyContent="center"
                    flexDirection="column"
                    borderRadius="8px"
                    position="relative"
                    backgroundColor={
                      selectedBarber.includes(barber.id)
                        ? barberTheme.colors.primary.orange
                        : barberTheme.colors.primary.gray
                    }
                    color="white"
                  >
                    <img
                      style={{
                        borderRadius: '8px',
                        objectFit: 'cover',
                        height: ' 140px',
                      }}
                      width="100%"
                      src={barber.foto}
                      loading="lazy"
                    />
                    <Box>
                      <Text
                        fontSize="16px"
                        textAlign="left"
                        fontWeight="bold"
                        mt="4px"
                      >
                        {barber.nome_completo}
                      </Text>
                    </Box>
                  </Box>
                ))}
              </Box>
            </InputGroup>
          )}

          {currentStep === 4 && (
            <InputGroup marginTop="-8px" display="flex" flexDirection="column">
              <Text mb="16px" color="orange.500">
                Selecione a data e o horário.
              </Text>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Box
                  width="100%"
                  height="300px"
                  border="1px solid #ccc"
                  borderRadius="8px"
                  overflow="hidden"
                >
                  <Calendar
                    onChange={handleDateChange} // Atualiza o estado ao selecionar uma data
                    locale="pt-BR"
                  />
                </Box>
                <Box
                  mt="16px"
                  display="flex"
                  justifyContent="flex-start"
                  flexWrap="wrap"
                >
                  {loadingHours ? (
                    <Center
                      width="100%"
                      height="10vh"
                      backgroundColor={barberTheme.colors.primary.black}
                    >
                      <Spinner
                        textAlign="center"
                        size="xl"
                        color={barberTheme.colors.primary.orange}
                      />
                    </Center>
                  ) : hours && hours.length > 0 ? (
                    hours.map((hour, index) => (
                      <Box
                        onClick={() => handlehourSchedule(hour)}
                        key={index}
                        m="2px"
                        cursor="pointer"
                        p="2px"
                        width="50px"
                        height="32px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        borderRadius="8px"
                        backgroundColor={
                          hourSchedule.includes(hour)
                            ? barberTheme.colors.primary.orange
                            : barberTheme.colors.primary.gray
                        }
                        color="white"
                      >
                        {hour.slice(0, 5)}
                      </Box>
                    ))
                  ) : (
                    <Text color={barberTheme.colors.primary.orange}>
                      Não há horários para esta data...
                    </Text>
                  )}
                </Box>
              </Box>
            </InputGroup>
          )}

          <Stack direction="row" left="16px" spacing={4} mt="12px">
            {(currentStep === 2 || currentStep === 3 || currentStep === 4) && (
              <Button
                onClick={handlePreviousStep}
                backgroundColor={barberTheme.colors.primary.gray}
                color="white"
                _hover={{ opacity: 0.8 }}
                type="button"
                _active={{ opacity: 0.4 }}
              >
                Voltar
              </Button>
            )}
            {(currentStep === 1 || currentStep === 2 || currentStep === 3) && (
              <Button
                rightIcon={<ArrowForwardIcon />}
                onClick={handleNextStep}
                backgroundColor={barberTheme.colors.primary.orange}
                color="white"
                isDisabled={absent ? true : false}
                _hover={{ opacity: 0.8 }}
                _active={{ opacity: 0.4 }}
              >
                Próximo
              </Button>
            )}

            {currentStep === 4 && (
              <Button
                onClick={() => {
                  handleSubmit(onSubmit), onOpen();
                }}
                backgroundColor={barberTheme.colors.primary.orange}
                color="white"
                isLoading={loading}
                _hover={{ opacity: 0.8 }}
                type="submit"
                _active={{ opacity: 0.4 }}
              >
                Finalizar
              </Button>
            )}
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};
