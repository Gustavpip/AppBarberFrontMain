import { Box, Button, Input, Text, useToast } from '@chakra-ui/react';
import { useRef } from 'react';
import barberTheme from '../theme';

export const Init = () => {
  const user = localStorage.getItem('user');
  const link = user ? JSON.parse(user).link : null;

  const inputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const handleCopy = () => {
    if (inputRef.current) {
      navigator.clipboard.writeText(inputRef.current.value).then(() => {
        toast({
          title: 'Link copiado!',
          description: 'O link foi copiado para a área de transferência.',
          status: 'success',
          duration: 2000,
          isClosable: true,
          position: 'top-right',
        });
      });
    }
  };

  return (
    <Box
      width="100%"
      height="70vh"
      as="section"
      display="flex"
      justifyContent="center"
      flexDirection="column"
      alignItems="center"
      maxWidth="540px"
      margin="0 auto"
    >
      <Box>
        <Text margin="16px 0" textAlign="start" fontSize="18px" color="white">
          Link
        </Text>

        <Box width="100%">
          <Input
            ref={inputRef}
            _focus={{
              borderColor: barberTheme.colors.primary.gray,
            }}
            borderColor={barberTheme.colors.primary.gray}
            color={barberTheme.colors.primary.gray03}
            outline="none"
            maxWidth="74%"
            height="44px"
            defaultValue={link}
            isReadOnly
          />
          <Button
            mx="8px"
            marginTop="-2px"
            backgroundColor={barberTheme.colors.primary.orange}
            color="white"
            onClick={handleCopy}
            _active={{ opacity: 0.4 }}
          >
            Copiar
          </Button>
        </Box>
        <Text mt="32px" color="gray.500">
          OBS: Envie este link para que seus clientes agendem um horário com
          você de forma prática...
        </Text>
      </Box>
    </Box>
  );
};
