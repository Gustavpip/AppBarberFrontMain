import { Box, Button, Stack } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Title } from '../components/global/TitleH2';
import barberTheme from '../theme';
import { CustomInput } from '../components/forms/CustomInput';
import CustomParagraph from '../components/global/CustomParagraph';
import { UserDTO } from '../types/allTypes';
import useUpdatePassword from '../hooks/useUpdatePassword';

export const UpdatePassword = () => {
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<
    Pick<UserDTO, 'senha'> & { confirmSenha: string; token: string }
  >();

  const toast = useToast();
  const { updatePassword, loading } = useUpdatePassword();
  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const token = query.get('token') || '';

  const onSubmit = async (
    data: Pick<UserDTO, 'senha'> & { confirmSenha: string; token: string }
  ) => {
    const result = await updatePassword(data);

    if (!result.success) {
      toast({
        title: 'Erro ao alterar',
        description: result?.data?.response?.data?.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    } else {
      toast({
        title: 'Sucesso',
        description: `${result?.data?.data?.message}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      reset();
      navigate('/entrar');
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
          Alterar
        </Title>
        <Stack spacing={4} as="form" onSubmit={handleSubmit(onSubmit)}>
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

          {/* Campo de Senha Confirm */}
          <CustomInput
            leftIcon={<img src="/Smartphone.svg" alt="Smartphone Icon" />}
            register={register('confirmSenha', {
              required: 'Senha é obrigatória',
            })}
            id="senha"
            placeholder="Senha novamente"
            type="password"
            isRequired={true}
            borderColor={
              errors.senha ? 'red.500' : barberTheme.colors.primary.gray
            }
            color={barberTheme.colors.primary.gray03}
            width="300px"
            height="44px"
          />

          <input type="hidden" {...register('token')} value={token} />

          <Link to="/recuperar/senha">
            <CustomParagraph
              textAlign="right"
              color={barberTheme.colors.primary.gray03}
            >
              Esqueceu sua senha?
            </CustomParagraph>
          </Link>

          <Button
            _hover={{ opacity: 0.8 }}
            backgroundColor={barberTheme.colors.primary.orange}
            color={barberTheme.colors.neutral.white}
            type="submit"
            isLoading={loading} // Exibe o spinner
            loadingText="Alterando..."
          >
            Alterar
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
