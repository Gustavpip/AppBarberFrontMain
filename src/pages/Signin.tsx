import { Box, Button, Stack } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Title } from '../components/global/TitleH2';
import barberTheme from '../theme';
import { CustomInput } from '../components/forms/CustomInput';
import CustomParagraph from '../components/global/CustomParagraph';
import { UserDTO } from '../types/allTypes';
import useSignin from '../hooks/useSignin';
import { useEffect, useRef } from 'react';

export const Signin = () => {
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Pick<UserDTO, 'senha' | 'email'>>();

  const toast = useToast();
  const { signin, loading } = useSignin();
  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const emailVerificado = query.get('email_verificado');

  const hasShownToast = useRef(false);

  useEffect(() => {
    if (emailVerificado && !hasShownToast.current) {
      toast({
        title: 'Sucesso',
        description: `Email verificado com sucesso.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      hasShownToast.current = true;
    }
  }, [emailVerificado, toast]);

  const onSubmit = async (data: Pick<UserDTO, 'senha' | 'email'>) => {
    const result = await signin(data);

    if (!result.success) {
      toast({
        title: 'Erro ao entrar',
        description: result?.data?.response?.data?.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    } else {
      toast({
        title: 'Sucesso',
        description: `Bem vindo(a), ${result.data.data.user.nome_barbearia}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      reset();
      navigate('/');
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
          Entrar
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

          {/* Campo de Senha */}
          <CustomInput
            leftIcon={<img src="/Smartphone.svg" alt="Smartphone Icon" />}
            register={register('senha', { required: 'Senha é obrigatória' })}
            id="senha"
            placeholder="Senha"
            type="password"
            isRequired={true}
            borderColor={
              errors.senha ? 'red.500' : barberTheme.colors.primary.gray
            }
            color={barberTheme.colors.primary.gray03}
            width="300px"
            height="44px"
          />

          <Link
            style={{
              width: '156px',
              alignSelf: 'end',
            }}
            to="/recuperar/senha"
          >
            <CustomParagraph
              style={{ display: 'inline-block' }}
              color={barberTheme.colors.primary.gray03}
            >
              Esqueceu sua senha?
            </CustomParagraph>
          </Link>

          <Button
            _hover={{ opacity: 0.8 }}
            _active={{ opacity: 0.4 }}
            backgroundColor={barberTheme.colors.primary.orange}
            color={barberTheme.colors.neutral.white}
            type="submit"
            isLoading={loading}
            loadingText="Entrando..."
          >
            Entrar
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
