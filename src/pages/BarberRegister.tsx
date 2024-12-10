import {
  Box,
  Button,
  Stack,
  Text,
  useToast,
  Input,
  InputGroup,
} from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import { CustomInput } from '../components/forms/CustomInput';
import { BarberDTO } from '../types/allTypes';
import { useForm } from 'react-hook-form';
import barberTheme from '../theme';
import { useState } from 'react';
import useBarberRegister from '../hooks/useBarberRegister';
import { useNavigate } from 'react-router-dom';

export const BarberRegister = () => {
  const {
    register,
    reset,
    handleSubmit,
    resetField,
    formState: { errors },
    watch,
  } = useForm<Pick<BarberDTO, 'nome_completo' | 'telefone' | 'foto'>>();

  const [currentStep, setCurrentStep] = useState(1);
  const [workSchedule, setworkSchedule] = useState<string[]>([]);
  const [lunchSchedule, setLunchSchedule] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const { createBarber, loading } = useBarberRegister();
  const navigate = useNavigate();

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
  ];
  const intervalHour = ['11:00', '12:00', '13:00', '14:00'];

  const onSubmit = async (
    data: Pick<BarberDTO, 'nome_completo' | 'telefone' | 'foto'>
  ) => {
    if (lunchSchedule.length < 2 || lunchSchedule.length > 2) {
      toast({
        title: 'Erro ao cadastrar',
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
      data.foto.length > 0 &&
      workSchedule.length >= 2 &&
      lunchSchedule.length === 2 &&
      selectedItems.length > 1
    ) {
      const formData = new FormData();
      formData.append('nome_completo', data.nome_completo);
      formData.append('telefone', data.telefone);
      formData.append('foto', data.foto[0]);

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

      const result = await createBarber(formData);

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
    const foto = watch('foto');

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

    if (nome_completo && telefone && foto.length > 0) {
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
          'Por favor, informe corretamente o seu nome e último nome, número de telefone e foto.',
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
      resetField('foto');
    }
    if (currentStep === 3) setCurrentStep(2);
    if (currentStep === 4) setCurrentStep(3);
  };

  return (
    <Box
      padding="16px"
      backgroundColor={barberTheme.colors.primary.black}
      display="flex"
      height="70vh"
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
          margin="16px 0"
          color="white"
        >
          Cadastrar Barbeiro - Etapa {currentStep}
        </Text>
        <Stack spacing={4} as="form" onSubmit={handleSubmit(onSubmit)}>
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
                width="312px"
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
                  errors.telefone ? 'red.500' : barberTheme.colors.primary.gray
                }
                color={barberTheme.colors.primary.gray03}
                width="312px"
                height="44px"
              />
              <Input
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
                width="312px"
                height="44px"
                padding="8px 0 0 0"
                style={{
                  borderRadius: '4px',
                  borderWidth: '1px',
                  paddingLeft: '40px',
                }}
              />
            </>
          )}

          {currentStep === 2 && (
            <InputGroup display="block">
              <Text mb="16px" color={barberTheme.colors.primary.orange}>
                Selecione os dias de trabalho do barbeiro
              </Text>
              <Box display="flex" maxWidth="312px" flexWrap="wrap">
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
                maxWidth="312px"
                my="16px"
                color={barberTheme.colors.primary.orange}
              >
                Selecione o horário de início e término do expediente do
                barbeiro
              </Text>
              <Box display="flex" maxWidth="312px" flexWrap="wrap">
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
              <Text
                maxWidth="312px"
                mb="16px"
                color={barberTheme.colors.primary.orange}
              >
                Selecione o horário de início e término do intervalo de almoço
                do barbeiro
              </Text>
              <Box display="flex" maxWidth="312px" flexWrap="wrap">
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
      </Box>
    </Box>
  );
};
