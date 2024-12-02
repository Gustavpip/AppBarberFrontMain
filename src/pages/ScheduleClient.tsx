import {
  Box,
  Button,
  Stack,
  Text,
  useToast,
  InputGroup,
} from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import { CustomInput } from '../components/forms/CustomInput';
import { BarberDTO, Scheduling, ServiceDTO } from '../types/allTypes';
import { useForm } from 'react-hook-form';
import barberTheme from '../theme';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useScheduling from '../hooks/useScheduling';
import useServiceList from '../hooks/useServiceList';
import 'react-calendar/dist/Calendar.css';

import 'react-calendar/dist/Calendar.css';
import moment from 'moment';

import Calendar from 'react-calendar';
import { useState } from 'react';
import useBarberList from '../hooks/useBarberList';

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

  const [currentStep, setCurrentStep] = useState(4);
  const [hourSchedule, sethourSchedule] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedBarber, setSelectedBarber] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(moment(new Date()).format('YYYY-MM-DD'));
  const [services, setServices] = useState<ServiceDTO[]>([]);
  const [barbers, setBarbers] = useState<BarberDTO[]>([]);

  console.log(selectedDate);
  const { createScheduling, loading } = useScheduling();
  const { getServices } = useServiceList();
  const { getBarbers } = useBarberList();
  const navigate = useNavigate();
  const { token } = useParams();

  const handleDateChange = (date: any) => {
    const formattedDate = moment(date).format('YYYY-MM-DD');
    setSelectedDate(formattedDate);
    console.log('Data selecionada:', formattedDate);
  };

  const handleSelect = (service: string) => {
    console.log(selectedItems);
    setSelectedItems((prevSelected) =>
      prevSelected.includes(service) ? [] : [service]
    );
  };

  const handleSelectBarber = (service: string) => {
    console.log(selectedBarber);
    setSelectedBarber((prevSelected) =>
      prevSelected.includes(service) ? [] : [service]
    );
  };

  const handlehourSchedule = (hour: string) => {
    console.log(hour);
    sethourSchedule((prevSchedule) =>
      prevSchedule.includes(hour) ? [] : [hour]
    );
  };

  useEffect(() => {
    const fetchBarbers = async () => {
      const result = await getBarbers(token);
      setBarbers(result.data.data);
    };
    const fetchServices = async () => {
      const response = await getServices(token);
      setServices(response.data.data);
    };

    fetchServices();
    fetchBarbers();
  }, []);

  const toast = useToast();

  const hours = [
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
  ];

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
    if (!hourSchedule) {
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
      console.log(selectedDate);
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
      // console.log(selectedItems);
      // console.log(data);
      // return;

      const result = await createScheduling(data);
      console.log(result);

      if (!result.success) {
        toast({
          title: 'Erro ao cadastrar',
          description: result?.data?.response?.data?.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      } else if (result.success) {
        toast({
          title: 'Sucesso',
          description: 'Barbeiro cadastrado com sucesso.',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });

        reset();
        navigate('/barbeiros');
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
    console.log(telefone);
    console.log(telefone.length);
    if (telefone.length < 11) {
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
      if (currentStep === 1) setCurrentStep(2);

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
      padding="32px 16px 16px 16px"
      backgroundColor={barberTheme.colors.primary.black}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box>
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
        <Stack spacing={4} as="form" onSubmit={handleSubmit(onSubmit)}>
          {currentStep === 1 && (
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
                      placeholder="Nome e último nome"
                      type="text"
                      isRequired
                      borderColor={
                        errors.nome
                          ? 'red.500'
                          : barberTheme.colors.primary.gray
                      }
                      color={barberTheme.colors.primary.gray03}
                      width="300px"
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
                      borderColor={
                        errors.telefone
                          ? 'red.500'
                          : barberTheme.colors.primary.gray
                      }
                      color={barberTheme.colors.primary.gray03}
                      width="300px"
                      height="44px"
                    />
                  </Box>
                  <Text
                    maxWidth="300px"
                    fontSize="14px"
                    textAlign="left"
                    m="16px 0"
                    color={barberTheme.colors.primary.orange}
                  >
                    Por favor, insira o número com o DDD (2 dígitos), seguido do
                    9 e o número de telefone.
                  </Text>
                </>
              </Box>
            </>
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
                maxWidth="400px"
              >
                {services.map((service, index) => (
                  <Box
                    onClick={() => handleSelect(service.id)}
                    key={index}
                    cursor="pointer"
                    p="8px"
                    width="160px"
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
                    <Text position="absolute" bottom="4px">
                      {service.nome}
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
                maxWidth="400px"
              >
                {barbers.map((barber, index) => (
                  <Box
                    onClick={() => handleSelectBarber(barber.id)}
                    key={index}
                    cursor="pointer"
                    width="160px"
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
                      width="140px"
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
            <InputGroup display="flex" flexDirection="column">
              <Text mb="16px" color="orange.500">
                Selecione a data e o horário desejados para o agendamento.
              </Text>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Box
                  width="100%"
                  maxWidth="400px"
                  height="300px"
                  border="1px solid #ccc"
                  borderRadius="8px"
                  overflow="hidden"
                >
                  <Calendar
                    className="custom-calendar"
                    tileContent=""
                    onChange={handleDateChange} // Atualiza o estado ao selecionar uma data
                    locale="pt-BR"
                  />
                </Box>
                <Box
                  mt="16px"
                  display="flex"
                  justifyContent="flex-start"
                  maxWidth="400px"
                  flexWrap="wrap"
                >
                  {hours.map((hour, index) => (
                    <Box
                      onClick={() => handlehourSchedule(hour)}
                      key={index}
                      m="4px"
                      cursor="pointer"
                      p="8px"
                      width="54px"
                      height="44px"
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
                      {hour}
                    </Box>
                  ))}
                </Box>
              </Box>
            </InputGroup>
          )}

          <Stack direction="row" left="16px" spacing={4} mt={4}>
            {(currentStep === 2 || currentStep === 3 || currentStep === 4) && (
              <Button
                onClick={handlePreviousStep}
                backgroundColor={barberTheme.colors.primary.gray}
                color="white"
                _hover={{ opacity: 0.8 }}
                type="button"
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
                _hover={{ opacity: 0.8 }}
              >
                Próximo
              </Button>
            )}

            {currentStep === 4 && (
              <Button
                onClick={handleSubmit(onSubmit)}
                backgroundColor={barberTheme.colors.primary.orange}
                color="white"
                _hover={{ opacity: 0.8 }}
                type="submit"
                loadingText="Finalizando..."
                isLoading={loading}
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
