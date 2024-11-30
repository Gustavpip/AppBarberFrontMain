import { Box, Button, Stack } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import { Title } from '../components/global/TitleH2';
import barberTheme from '../theme';
import { CustomInput } from '../components/forms/CustomInput';
import CustomParagraph from '../components/global/CustomParagraph';
import { UserDTO } from '../types/allTypes';
import useRecoverPassword from '../hooks/useRecoverPassword';

export const RecoverPassword = () => {
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Pick<UserDTO, 'email'>>();
  const toast = useToast();
  const { recoverPassword, loading } = useRecoverPassword();

  const onSubmit = async (data: Pick<UserDTO, 'email'>) => {
    const result = await recoverPassword(data);

    if (!result.success) {
      toast({
        title: 'Erro ao recuperar',
        description: result?.data?.response?.data?.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    } else if (result.success) {
      toast({
        title: 'Sucesso',
        description: `${result.data.data.message}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      reset();
    }
  };

  return (
    <Box
      style={{
        backgroundColor: barberTheme.colors.primary.black,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      className="container-form"
    >
      <Box className="container-title">
        <Title
          style={{
            color: barberTheme.colors.neutral.white,
            fontSize: barberTheme.fontSizes['xl'],
            margin: '16px 0',
            textAlign: 'center',
          }}
        >
          Recuperar
        </Title>
        <Stack spacing={4} as="form" onSubmit={handleSubmit(onSubmit)}>
          {/* Campo de Email */}
          <CustomInput
            leftIcon={<img src="/User.svg" alt="User Icon" />}
            register={register('email', {
              required: 'Email é obrigatório',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'Email inválido',
              },
            })}
            id="email"
            placeholder="Email"
            type="email"
            isRequired={true}
            borderColor={
              errors.email ? 'red.500' : barberTheme.colors.primary.gray
            }
            color={barberTheme.colors.primary.gray03}
            width="300px"
            height="44px"
          />

          <Link to="/entrar">
            <CustomParagraph
              textAlign="right"
              color={barberTheme.colors.primary.gray03}
            >
              Possui conta?
            </CustomParagraph>
          </Link>

          <Button
            _hover={{ opacity: 0.8 }}
            backgroundColor={barberTheme.colors.primary.orange}
            color={barberTheme.colors.neutral.white}
            type="submit"
            isLoading={loading} // Exibe o spinner
            loadingText="Recuperando..."
          >
            Recuperar
          </Button>

          <CustomParagraph
            marginTop="32px"
            textAlign="center"
            color={barberTheme.colors.primary.gray03}
          >
            Não possui conta?
          </CustomParagraph>

          <Link to="/registrar">
            <CustomParagraph
              color={barberTheme.colors.primary.orange}
              marginTop="-12px"
              textAlign="center"
            >
              Registrar
            </CustomParagraph>
          </Link>
        </Stack>
      </Box>
    </Box>
  );
};
