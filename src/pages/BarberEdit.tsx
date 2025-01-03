import {
  Box,
  Button,
  Stack,
  Text,
  useToast,
  InputGroup,
  Center,
  Spinner,
} from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import { CustomInput } from '../components/forms/CustomInput';
import { BarberDTO } from '../types/allTypes';
import { useForm } from 'react-hook-form';
import barberTheme from '../theme';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useGetBarber from '../hooks/useGetBarber';
import useBarberEdit from '../hooks/useEditBarber';

export const BarberEdit = () => {
  const {
    register,
    reset,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<
    Pick<BarberDTO, 'nome_completo' | 'telefone' | 'id' | 'dias_trabalho'>
  >();

  const [currentStep, setCurrentStep] = useState(1);
  const [workSchedule, setworkSchedule] = useState<string[]>([]);
  const [lunchSchedule, setLunchSchedule] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [, setBarber] = useState<BarberDTO>();
  const { updateBarber, loading } = useBarberEdit();
  const { getBarber, loading: loadingBarber } = useGetBarber();
  const navigate = useNavigate();
  const { idBarber } = useParams();

  const handleSelect = (day: string) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(day)
        ? prevSelected.filter((item) => item !== day)
        : [...prevSelected, day]
    );
  };

  const handleworkSchedule = (hour: string) => {
    setworkSchedule((prevSchedule) =>
      prevSchedule.includes(hour)
        ? prevSchedule.filter((item) => item !== hour)
        : prevSchedule.length < 2
          ? [...prevSchedule, hour]
          : prevSchedule
    );
  };

  const handleLunchSchedule = (hour: string) => {
    setLunchSchedule((prevSchedule) =>
      prevSchedule.includes(hour)
        ? prevSchedule.filter((item) => item !== hour)
        : prevSchedule.length < 2
          ? [...prevSchedule, hour]
          : prevSchedule
    );
  };

  const toast = useToast();
  const days = [
    { name: 'Segunda', value: 'seg' },
    { name: 'Terça', value: 'ter' },
    { name: 'Quarta', value: 'qua' },
    { name: 'Quinta', value: 'qui' },
    { name: 'Sexta', value: 'sex' },
    { name: 'Sábado', value: 'sab' },
    { name: 'Domingo', value: 'dom' },
  ];
  const hours = [
    '07:00',
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00',
    '22:00',
    '23:00'
  ];
  const intervalHour = ['11:00', '12:00', '13:00', '14:00'];

  const onSubmit = async (
    data: Pick<BarberDTO, 'nome_completo' | 'telefone' | 'id' | 'dias_trabalho'>
  ) => {
    if (lunchSchedule.length < 2 || lunchSchedule.length > 2) {
      toast({
        title: 'Erro ao editar',
        description:
          'Por favor, selecione o horário de início e término do intervalo de almoço do barbeiro.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      return;
    }
    if (
      data.nome_completo &&
      data.telefone &&
      // data.foto.length > 0 &&
      workSchedule.length >= 2 &&
      lunchSchedule.length === 2 &&
      selectedItems.length > 1
    ) {
      const formData = new FormData();
      formData.append('nome_completo', data.nome_completo);
      formData.append('telefone', data.telefone);
      // formData.append('foto', data.foto[0]);

      const workHourDays = [];
      const [hoursInit] = workSchedule[0].split(':').map(Number);
      const [hoursEnd] = workSchedule[1].split(':').map(Number);

      const [hoursLunch] = lunchSchedule[0].split(':').map(Number);
      const [hoursLunchEnd] = lunchSchedule[1].split(':').map(Number);

      for (let i = 0; i < selectedItems.length; i++) {
        workHourDays.push({
          dia: selectedItems[i],
          horario_inicio:
            hoursInit < hoursEnd ? workSchedule[0] : workSchedule[1],
          horario_fim: hoursInit < hoursEnd ? workSchedule[1] : workSchedule[0],
          inicio_almoco:
            hoursLunch < hoursLunchEnd ? lunchSchedule[0] : lunchSchedule[1],
          fim_almoco:
            hoursLunch < hoursLunchEnd ? lunchSchedule[1] : lunchSchedule[0],
        });
      }

      const stringWorkDays = JSON.stringify(workHourDays);

      formData.append('dias_trabalho', stringWorkDays);
      formData.append('id', idBarber ? idBarber : '');

      // return;
      const result = await updateBarber(formData);

      if (!result.success) {
        toast({
          title: 'Erro ao editar',
          description: result?.data?.response?.data?.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      } else if (result.success) {
        toast({
          title: 'Sucesso',
          description: 'Barbeiro editado com sucesso.',
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
        title: 'Preencha todos os campos corretamente antes de continuar',
        status: 'error',
        duration: 3000,
        position: 'top-right',
        isClosable: true,
      });
    }
  };

  const handleNextStep = () => {
    const nome_completo = watch('nome_completo')?.trim();
    const telefone = watch('telefone')?.trim();
    // const foto = watch('foto');

    const nome = nome_completo.split(' ');
    if (nome.length > 2 || nome.length < 2) {
      toast({
        title: 'Por favor, informe apenas o nome e último nome.',
        status: 'error',
        duration: 3000,
        position: 'top-right',
        isClosable: true,
      });
      return;
    }

    if (telefone?.trim().length > 11 || telefone?.trim().length < 11) {
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

    if (nome_completo && telefone) {
      if (currentStep === 2) {
        if (selectedItems.length > 0) {
          setCurrentStep(3);
        } else {
          toast({
            title: 'Por favor, selecione os dias de trabalho do barbeiro.',
            status: 'error',
            duration: 3000,
            position: 'top-right',
            isClosable: true,
          });
        }
      }

      if (currentStep === 3) {
        if (workSchedule.length === 2) {
          setCurrentStep(4);
        } else {
          toast({
            title:
              'Por favor, selecione o horário de início e término do expediente do barbeiro.',
            status: 'error',
            duration: 3000,
            position: 'top-right',
            isClosable: true,
          });
        }
      }

      if (currentStep === 1) setCurrentStep(2);
    } else {
      toast({
        title:
          'Por favor, informe corretamente o seu nome e último nome, número de telefone.',
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
      // resetField('foto');
    }
    if (currentStep === 3) setCurrentStep(2);
    if (currentStep === 4) setCurrentStep(3);
  };

  useEffect(() => {
    const fetchBarber = async () => {
      const response = await getBarber(idBarber);
      setBarber(response.data.data);
      setValue('nome_completo', response.data.data.nome_completo);
      setValue('telefone', response.data.data.telefone);

      const initialDays = response.data.data.horariosTrabalho.map(
        (schedule: any) => schedule.dia
      );

      const initialLunchInit =
        response.data.data.horariosTrabalho[0].inicio_almoco;

      const lunchEnd = response.data.data.horariosTrabalho[0].fim_almoco;

      const initWork = response.data.data.horariosTrabalho[0].horario_inicio;
      const endWork = response.data.data.horariosTrabalho[0].horario_fim;

      setLunchSchedule([initialLunchInit.slice(0, 5), lunchEnd.slice(0, 5)]);
      setSelectedItems(initialDays);
      setworkSchedule([initWork.slice(0, 5), endWork.slice(0, 5)]);
    };

    fetchBarber();
  }, []);

  return (
    <Box
      pt="16px"
      backgroundColor={barberTheme.colors.primary.black}
      display="flex"
      height="70vh"
      justifyContent="center"
      alignItems="center"
      maxWidth="540px"
      margin="0 auto"
    >
      <Box width="100%">
        <Text color={barberTheme.colors.primary.orange}>
          Etapa {currentStep} de 4
        </Text>
        <Text
          fontSize="18px"
          fontWeight={barberTheme.fontWeights.bold}
          margin="16px 0"
          color="white"
        >
          Editar Barbeiro - Etapa {currentStep}
        </Text>
        {loadingBarber ? (
          <Center height="100vh">
            <Spinner size="xl" color={barberTheme.colors.primary.orange} />
          </Center>
        ) : (
          <Stack spacing={2} as="form" onSubmit={handleSubmit(onSubmit)}>
            {currentStep === 1 && (
              <>
                <CustomInput
                  leftIcon={<img src="/User.svg" alt="User Icon" />}
                  register={register('nome_completo', {
                    required: 'Nome completo é obrigatório',
                  })}
                  id="nome-completo"
                  placeholder="Nome e último nome"
                  type="text"
                  isRequired
                  borderColor={
                    errors.nome_completo
                      ? 'red.500'
                      : barberTheme.colors.primary.gray
                  }
                  color={barberTheme.colors.primary.gray03}
                  width="100%"
                  height="44px"
                />
                <CustomInput
                  leftIcon={<img src="/Smartphone.svg" alt="Smartphone Icon" />}
                  register={register('telefone', {
                    required: 'Telefone é obrigatório',
                    minLength: 10,
                    maxLength: 11,
                  })}
                  id="telefone"
                  placeholder="Telefone"
                  type="number"
                  isRequired
                  borderColor={
                    errors.telefone
                      ? 'red.500'
                      : barberTheme.colors.primary.gray
                  }
                  color={barberTheme.colors.primary.gray03}
                  width="100%"
                  height="44px"
                />
                {/* <Input
              type="file"
              id="foto"
              {...register('foto', {
                required: 'Foto é obrigatória',
              })}
              accept="image/*"
              borderColor={
                errors.foto ? 'red.500' : barberTheme.colors.primary.gray
              }
              color={barberTheme.colors.primary.gray03}
              width="100%"
              height="44px"
              padding="8px 0 0 8px"
              style={{
                borderRadius: '4px',
                borderWidth: '1px',
              }}
            /> */}
              </>
            )}

            {currentStep === 2 && (
              <InputGroup display="block">
                <Text mb="16px" color={barberTheme.colors.primary.orange}>
                  Selecione os dias de trabalho do barbeiro
                </Text>
                <Box display="flex" flexWrap="wrap">
                  {days.map((day, index) => (
                    <Box
                      onClick={() => handleSelect(day.value)}
                      key={index}
                      m="4px"
                      cursor="pointer"
                      p="8px"
                      maxWidth="130px"
                      height="44px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      borderRadius="4px"
                      backgroundColor={
                        selectedItems.includes(day.value)
                          ? barberTheme.colors.primary.orange
                          : barberTheme.colors.primary.gray
                      }
                      color="white"
                    >
                      {day.name}
                    </Box>
                  ))}
                </Box>
              </InputGroup>
            )}

            {currentStep === 3 && (
              <InputGroup display="block">
                <Text
                  maxWidth="100%"
                  mb="16px"
                  color={barberTheme.colors.primary.orange}
                >
                  Selecione o horário de início e término do expediente do
                  barbeiro
                </Text>
                <Box display="flex" flexWrap="wrap">
                  {hours.map((hour, index) => (
                    <Box
                      onClick={() => handleworkSchedule(hour)}
                      key={index}
                      m="4px"
                      cursor="pointer"
                      p="8px"
                      maxWidth="130px"
                      height="44px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      borderRadius="4px"
                      backgroundColor={
                        workSchedule.includes(hour)
                          ? barberTheme.colors.primary.orange
                          : barberTheme.colors.primary.gray
                      }
                      color="white"
                    >
                      {hour}
                    </Box>
                  ))}
                </Box>
              </InputGroup>
            )}

            {currentStep === 4 && (
              <InputGroup display="block">
                <Text mb="16px" color={barberTheme.colors.primary.orange}>
                  Selecione o horário de início e término do intervalo de almoço
                  do barbeiro
                </Text>
                <Box display="flex" flexWrap="wrap">
                  {intervalHour.map((hour, index) => (
                    <Box
                      onClick={() => handleLunchSchedule(hour)}
                      key={index}
                      m="4px"
                      cursor="pointer"
                      p="8px"
                      maxWidth="130px"
                      height="44px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      borderRadius="4px"
                      backgroundColor={
                        lunchSchedule.includes(hour)
                          ? barberTheme.colors.primary.orange
                          : barberTheme.colors.primary.gray
                      }
                      color="white"
                    >
                      {hour}
                    </Box>
                  ))}
                </Box>
              </InputGroup>
            )}

            <Stack direction="row" spacing={4} mt={4}>
              {(currentStep === 2 ||
                currentStep === 3 ||
                currentStep === 4) && (
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
              {(currentStep === 1 ||
                currentStep === 2 ||
                currentStep === 3) && (
                <Button
                  rightIcon={<ArrowForwardIcon />}
                  onClick={handleNextStep}
                  backgroundColor={barberTheme.colors.primary.orange}
                  color="white"
                  _hover={{ opacity: 0.7 }}
                  type="button"
                  _active={{ opacity: 0.4 }}
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
                  _active={{ opacity: 0.4 }}
                >
                  Finalizar
                </Button>
              )}
            </Stack>
          </Stack>
        )}
      </Box>
    </Box>
  );
};
