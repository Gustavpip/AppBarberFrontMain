import {
  Box,
  Button,
  Input,
  Stack,
  Text,
  useToast,
  InputLeftElement,
  InputGroup,
  Select,
  Center,
  Spinner,
} from '@chakra-ui/react';
import { CustomInput } from '../components/forms/CustomInput';
import { ServiceDTO } from '../types/allTypes';
import { useForm } from 'react-hook-form';
import barberTheme from '../theme';
import { useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';
import useServiceEdit from '../hooks/useServiceEdit';
import useGetService from '../hooks/useGetService';
//
export const ServiceEdit = () => {
  const {
    register,
    reset,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<
    Pick<ServiceDTO, 'nome' | 'descricao' | 'preco' | 'tempo' | 'id'>
  >();

  const [formattedValue, setFormattedValue] = useState('');
  const [service, setService] =
    useState<
      Pick<ServiceDTO, 'nome' | 'descricao' | 'preco' | 'tempo' | 'id'>
    >();
  const { updateService, loading } = useServiceEdit();
  const { getService, loading: loadingService } = useGetService();
  const navigate = useNavigate();
  const { idService } = useParams();

  const toast = useToast();

  useEffect(() => {
    const fetchService = async () => {
      const result = await getService(idService ? idService : '');
      setService(result.data.data);
      setValue('nome', result.data.data.nome);
      setValue('descricao', result.data.data.descricao);

      const formatted = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(result.data.data.preco);
      setFormattedValue(formatted);
      setValue('tempo', result.data.data.tempo);
      setValue('preco', formatted);
    };

    fetchService();
  }, []);

  const onSubmit = async (
    data: Pick<ServiceDTO, 'nome' | 'descricao' | 'preco' | 'tempo' | 'id'>
  ) => {
    data.id = idService ? idService : '';
    data.preco = Number(
      String(data.preco)
        .replace('R', '')
        .replace('$', '')
        .replace(' ', '')
        .replace(',', '.')
        .trim()
    );

    if (
      data.nome.length > 2 &&
      data.descricao.length > 5 &&
      Number(data.preco) > 0
    ) {
      const result = await updateService(data);

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
          description: 'Serviço atualizado com sucesso.',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });

        reset();
        navigate('/servicos');
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
        <Text
          fontSize="18px"
          fontWeight={barberTheme.fontWeights.bold}
          margin="16px 0"
          color="white"
        >
          Editar Serviço
        </Text>
        {loadingService ? (
          <Center height="100vh">
            <Spinner size="xl" color={barberTheme.colors.primary.orange} />
          </Center>
        ) : (
          <Stack spacing={2} as="form" onSubmit={handleSubmit(onSubmit)}>
            <>
              <CustomInput
                leftIcon={
                  <img
                    src="/barbeiros.svg"
                    height="16px"
                    width="20px"
                    alt="User Icon"
                  />
                }
                register={register('nome', {
                  required: 'Título é obrigatório',
                })}
                id="nome"
                placeholder="Título"
                type="text"
                isRequired
                borderColor={
                  errors.nome ? 'red.500' : barberTheme.colors.primary.gray
                }
                color={barberTheme.colors.primary.gray03}
                width="100%"
                height="44px"
              />
              <CustomInput
                leftIcon={
                  <img
                    src="/clients.svg"
                    height=""
                    width="16px"
                    alt="Smartphone Icon"
                  />
                }
                register={register('descricao', {
                  required: 'Descrição é obrigatório',
                })}
                id="descricao"
                placeholder="Descrição"
                type="text"
                isRequired
                borderColor={
                  errors.descricao ? 'red.500' : barberTheme.colors.primary.gray
                }
                color={barberTheme.colors.primary.gray03}
                width="100%"
                height="44px"
              />
              <InputGroup
                border={`1px solid ${barberTheme.colors.primary.gray}`}
                borderRadius="4px"
                width="100%"
              >
                <InputLeftElement pointerEvents="none">
                  <img
                    src="/clocks.svg"
                    height="12px"
                    width="16px"
                    alt="Clocks Icon"
                  />
                </InputLeftElement>
                <Select
                  defaultValue={service?.tempo}
                  textAlign="start"
                  id="tempo"
                  {...register('tempo', {
                    required: 'Tempo é obrigatório',
                  })}
                  border="1px solid transparent"
                  onChange={(e) => setValue('tempo', e.target.value)}
                  isInvalid={!!errors.tempo}
                  focusBorderColor={
                    errors.tempo ? 'red.500' : barberTheme.colors.primary.gray
                  }
                  color={barberTheme.colors.primary.gray03}
                  height="44px"
                  pl="32px"
                >
                  <option value="">Tempo</option>
                  <option value="02:00:00">02:00:00</option>
                  <option value="01:00:00">01:00:00</option>
                  <option value="00:30:00">00:30:00</option>
                </Select>
              </InputGroup>
              <InputGroup width="100%">
                <InputLeftElement pointerEvents="none">
                  <img
                    src="/Vector (10).svg"
                    height="12px"
                    width="10px"
                    alt="Cifrão Icon"
                  />
                </InputLeftElement>
                <Input
                  id="preco"
                  placeholder="Preço"
                  type="text"
                  {...register('preco', {
                    required: 'Preço é obrigatório',
                  })}
                  onChange={(e) => {
                    let rawValue = e.target.value;

                    rawValue = rawValue.replace(/[^\d,]/g, '');

                    setFormattedValue(rawValue);

                    const numericValue = parseFloat(rawValue.replace(',', '.'));
                    if (!isNaN(numericValue)) {
                      setValue('preco', numericValue.toFixed(2));
                    } else {
                      setValue('preco', '');
                    }
                  }}
                  value={formattedValue}
                  onBlur={() => {
                    const numericValue = parseFloat(
                      formattedValue.replace(',', '.')
                    );
                    if (!isNaN(numericValue)) {
                      const formatted = new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(numericValue);
                      setFormattedValue(formatted);
                    }
                  }}
                  onFocus={() => {
                    setFormattedValue(formattedValue.replace(/[^\d,]/g, ''));
                  }}
                  isInvalid={!!errors.preco}
                  focusBorderColor={
                    errors.preco ? 'red.500' : barberTheme.colors.primary.gray
                  }
                  color={barberTheme.colors.primary.gray03}
                  height="44px"
                  border={`1px solid ${barberTheme.colors.primary.gray}`}
                />
              </InputGroup>
            </>

            <Button
              onClick={handleSubmit(onSubmit)}
              backgroundColor={barberTheme.colors.primary.orange}
              color="white"
              _hover={{ opacity: 0.8 }}
              type="submit"
              loadingText="Editando..."
              isLoading={loading}
              _active={{ opacity: 0.4 }}
              my="16px"
            >
              Editar
            </Button>
          </Stack>
        )}
      </Box>
    </Box>
  );
};
