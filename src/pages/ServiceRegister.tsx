import {
  Box,
  Button,
  Input,
  Stack,
  Text,
  useToast,
  InputLeftElement,
  InputGroup,
} from '@chakra-ui/react';
import { CustomInput } from '../components/forms/CustomInput';
import { ServiceDTO } from '../types/allTypes';
import { useForm } from 'react-hook-form';
import barberTheme from '../theme';
import { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import useServiceRegister from '../hooks/useServiceRegister';

export const ServiceRegister = () => {
  const {
    register,
    reset,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Pick<ServiceDTO, 'nome' | 'descricao' | 'preco'>>();

  const [formattedValue, setFormattedValue] = useState('');
  const { createService, loading } = useServiceRegister();
  const navigate = useNavigate();

  const toast = useToast();

  const onSubmit = async (
    data: Pick<ServiceDTO, 'nome' | 'descricao' | 'preco'>
  ) => {
    if (
      data.nome.length > 2 &&
      data.descricao.length > 5 &&
      Number(data.preco) > 0
    ) {
      const result = await createService(data);

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
          description: 'Serviço cadastrado com sucesso.',
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
      padding="16px"
      backgroundColor={barberTheme.colors.primary.black}
      display="flex"
      height="70vh"
      justifyContent="center"
      alignItems="center"
    >
      <Box>
        <Text
          fontSize="18px"
          fontWeight={barberTheme.fontWeights.bold}
          margin="16px 0"
          color="white"
        >
          Cadastrar Serviço
        </Text>
        <Stack spacing={4} as="form" onSubmit={handleSubmit(onSubmit)}>
          <>
            <CustomInput
              leftIcon={<img src="/barbeiros.svg" alt="User Icon" />}
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
              width="312px"
              height="44px"
            />
            <CustomInput
              leftIcon={<img src="/clients.svg" alt="Smartphone Icon" />}
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
              width="312px"
              height="44px"
            />
            <InputGroup width="312px">
              <InputLeftElement pointerEvents="none">
                <img
                  src="/Vector (10).svg"
                  height="16px"
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
              />
            </InputGroup>
          </>

          <Button
            onClick={handleSubmit(onSubmit)}
            backgroundColor={barberTheme.colors.primary.orange}
            color="white"
            _hover={{ opacity: 0.8 }}
            type="submit"
            loadingText="Cadastrando..."
            isLoading={loading}
            my="16px"
          >
            Cadastrar
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};
