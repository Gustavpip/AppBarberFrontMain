import { Box, Button, Input, Stack, Text, useToast } from '@chakra-ui/react';
import { CustomInput } from '../components/forms/CustomInput';
import { ProfileDTO, UserDTO } from '../types/allTypes';
import { useForm } from 'react-hook-form';
import barberTheme from '../theme';
import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import useProfileEdit from '../hooks/useProfileEdit';
import useGetUser from '../hooks/useGetUser';
import { useAuth } from '../context/AuthContext';

export const Profile = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<
    Pick<ProfileDTO, 'email' | 'logo' | 'nome_barbearia' | 'phone' | 'endereco'>
  >();

  const [, setDataProfile] =
    useState<
      Pick<
        UserDTO,
        'id' | 'email' | 'nome_barbearia' | 'phone' | 'logo' | 'endereco'
      >
    >();
  const { user, setUser, updateLocalStorage } = useAuth();
  const { getUser } = useGetUser();

  const { updateProfile, loading } = useProfileEdit();
  const navigate = useNavigate();

  const toast = useToast();

  const handleUpdateUser = (
    data: Pick<
      UserDTO,
      'email' | 'nome_barbearia' | 'phone' | 'logo' | 'endereco'
    >
  ) => {
    setUser({
      ...user,
      logo: data.logo,
      endereco: data.endereco,
      phone: data.phone,
      email: data.email,
      nome_barbearia: data.nome_barbearia,
    });

    updateLocalStorage({
      ...user,
      logo: data.logo,
      endereco: data.endereco,
      phone: data.phone,
      email: data.email,
      nome_barbearia: data.nome_barbearia,
    });
  };

  const onSubmit = async (
    data: Pick<
      ProfileDTO,
      'email' | 'logo' | 'nome_barbearia' | 'phone' | 'endereco'
    >
  ) => {
    if (
      (data.email && data.nome_barbearia && data.phone && data.logo.length > 0,
      data.endereco)
    ) {
      const formData = new FormData();
      formData.append('nome_barbearia', data.nome_barbearia);
      formData.append('email', data.email);
      formData.append('logo', data.logo[0]);
      formData.append('phone', data.phone);
      formData.append('endereco', data.endereco);

      const result = await updateProfile(data);

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
          description: 'Dados atualizados com sucesso.',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });

        handleUpdateUser(result.data.data);

        navigate('/perfil');
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

  useEffect(() => {
    const fetchProfileData = async () => {
      const result = await getUser();
      setDataProfile(result.data.data);
      setValue('nome_barbearia', result.data.data.nome_barbearia);
      setValue('email', result.data.data.email);
      setValue('phone', result.data.data.phone);
      setValue('endereco', result.data.data.endereco);
    };

    fetchProfileData();
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
        <Text
          fontSize="18px"
          fontWeight={barberTheme.fontWeights.bold}
          margin="16px 0"
          color="white"
        >
          Editar perfil
        </Text>
        <Stack spacing={2} as="form" onSubmit={handleSubmit(onSubmit)}>
          <>
            <CustomInput
              leftIcon={
                <img
                  src="/Group.svg"
                  height="16px"
                  width="20px"
                  alt="User Icon"
                />
              }
              register={register('nome_barbearia', {
                required: 'Nome da barbearia é obrigatório',
              })}
              id="nome_barbearia"
              placeholder="Barbearia"
              type="text"
              isRequired
              borderColor={
                errors.nome_barbearia
                  ? 'red.500'
                  : barberTheme.colors.primary.gray
              }
              color={barberTheme.colors.primary.gray03}
              width="100%"
              height="44px"
            />
            <CustomInput
              leftIcon={
                <img
                  src="/User.svg"
                  height=""
                  width="26px"
                  alt="Smartphone Icon"
                />
              }
              register={register('email', {
                required: 'Email é obrigatório',
              })}
              id="email"
              placeholder="Email"
              type="text"
              isRequired
              borderColor={
                errors.email ? 'red.500' : barberTheme.colors.primary.gray
              }
              color={barberTheme.colors.primary.gray03}
              width="100%"
              height="44px"
            />
            <CustomInput
              leftIcon={<img src="/Smartphone.svg" alt="Smartphone Icon" />}
              register={register('phone', {
                required: 'Telefone é obrigatório',
                minLength: 10,
                maxLength: 11,
              })}
              id="telefone"
              placeholder="Telefone"
              type="number"
              isRequired
              borderColor={
                errors.phone ? 'red.500' : barberTheme.colors.primary.gray
              }
              color={barberTheme.colors.primary.gray03}
              width="100%"
              height="44px"
            />

            <CustomInput
              leftIcon={<img src="/Home.svg" alt="Home Icon" />}
              register={register('endereco', {
                required: 'Endereço é obrigatório',
              })}
              id="endereco"
              placeholder="Endereço"
              type="text"
              isRequired
              borderColor={
                errors.endereco ? 'red.500' : barberTheme.colors.primary.gray
              }
              color={barberTheme.colors.primary.gray03}
              width="100%"
              height="44px"
            />

            <Input
              type="file"
              id="foto"
              {...register('logo')}
              accept="image/*"
              borderColor={
                errors.logo ? 'red.500' : barberTheme.colors.primary.gray
              }
              color={barberTheme.colors.primary.gray03}
              width="100%"
              height="44px"
              padding="8px 0 0 8px"
              style={{
                borderRadius: '4px',
                borderWidth: '1px',
              }}
            />
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
      </Box>
    </Box>
  );
};
