import { Box, Button, Stack } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import { Title } from '../components/global/TitleH2';
import barberTheme from '../theme';
import { CustomInput } from '../components/forms/CustomInput';
import CustomParagraph from '../components/global/CustomParagraph';
import { UserDTO } from '../types/allTypes';
import useSignup from '../hooks/useSignup';

export const Signup = () => {
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<
    Pick<UserDTO, 'senha' | 'phone' | 'email' | 'endereco' | 'nome_barbearia'>
  >();
  const toast = useToast();
  const { signup, loading } = useSignup();

  const onSubmit = async (
    data: Pick<
      UserDTO,
      'senha' | 'phone' | 'email' | 'endereco' | 'nome_barbearia'
    >
  ) => {
    if (data.senha.length < 8) {
      toast({
        title: 'Erro de validação',
        description: 'A senha deve ter pelo menos 8 caracteres.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      return;
    }

    if (data.phone.length < 11) {
      toast({
        title: 'Erro de validação',
        description:
          'Por favor, inclua o DDD e adicione o número 9 antes do telefone.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      return;
    }

    const result = await signup(data);

    if (!result.success) {
      toast({
        title: 'Erro ao cadastrar',
        description: result.data.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    } else if (result.success) {
      toast({
        title: 'Sucesso',
        description: 'Verifique seu email.',
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
          Registrar
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

          {/* Campo Nome da Barbearia */}
          <CustomInput
            leftIcon={<img src="/Group.svg" alt="Group Icon" />}
            register={register('nome_barbearia', {
              required: 'Nome da barbearia é obrigatório',
            })}
            id="nome_barbearia"
            placeholder="Barbearia"
            type="text"
            isRequired={true}
            borderColor={
              errors.nome_barbearia
                ? 'red.500'
                : barberTheme.colors.primary.gray
            }
            color={barberTheme.colors.primary.gray03}
            width="300px"
            height="44px"
          />

          {/* Campo Endereço */}
          <CustomInput
            leftIcon={<img src="/Home.svg" alt="Home Icon" />}
            register={register('endereco', {
              required: 'Endereço é obrigatório',
            })}
            id="endereco"
            placeholder="Endereço"
            type="text"
            isRequired={true}
            borderColor={
              errors.endereco ? 'red.500' : barberTheme.colors.primary.gray
            }
            color={barberTheme.colors.primary.gray03}
            width="300px"
            height="44px"
          />

          {/* Campo Telefone */}
          <CustomInput
            leftIcon={<img src="/Smartphone.svg" alt="Smartphone Icon" />}
            register={register('phone', {
              required: 'Telefone é obrigatório',
              pattern: {
                value: /^[0-9]+$/,
                message: 'Telefone inválido',
              },
            })}
            id="phone"
            placeholder="Telefone"
            type="number"
            isRequired={true}
            borderColor={
              errors.phone ? 'red.500' : barberTheme.colors.primary.gray
            }
            color={barberTheme.colors.primary.gray03}
            width="300px"
            height="44px"
          />

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
            loadingText="Cadastrando..."
          >
            Cadastrar
          </Button>

          <CustomParagraph
            marginTop="32px"
            textAlign="center"
            color={barberTheme.colors.primary.gray03}
          >
            Já possui conta?
          </CustomParagraph>

          <Link to="/entrar">
            <CustomParagraph
              color={barberTheme.colors.primary.orange}
              marginTop="-12px"
              textAlign="center"
            >
              Entrar
            </CustomParagraph>
          </Link>
        </Stack>
      </Box>
    </Box>
  );
};
