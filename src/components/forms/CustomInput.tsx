import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Spinner,
} from '@chakra-ui/react';
import { ReactNode } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import barberTheme from '../../theme';

type CustomInputProps = {
  placeholder?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  type?: string;
  size?: string;
  variant?: string;
  color?: string;
  leftIcon?: ReactNode;
  id?: string;
  isRequired?: boolean;
  borderColor: string;
  width: string;
  height: string;
  padding?: string;
  register: UseFormRegisterReturn;
  margin?: string;
  defaultValue?: string;
};

export const CustomInput = ({
  placeholder = 'Digite aqui...',
  isLoading = false,
  isDisabled = false,
  type = 'text',
  size = 'md',
  variant = 'outline',
  color = 'black',
  leftIcon,
  id,
  isRequired,
  borderColor,
  width,
  height,
  register,
  padding,
  margin,
  defaultValue,
}: CustomInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === 'file' && e.target.files) {
      register.onChange(e); // Passa o evento para o react-hook-form
    }
  };

  return (
    <InputGroup size={size}>
      {leftIcon && <InputLeftElement>{leftIcon}</InputLeftElement>}
      <Input
        sx={{
          '::placeholder': {
            color: barberTheme.colors.primary.gray03,
          },
        }}
        outline="none"
        required={isRequired ? isRequired : false}
        id={id ? id : ''}
        placeholder={placeholder}
        borderColor={borderColor}
        isDisabled={isDisabled || isLoading}
        type={type}
        variant={variant}
        focusBorderColor={color}
        width={width}
        height={height}
        color={color}
        defaultValue={defaultValue}
        padding={padding}
        margin={margin ? margin : ''}
        autoComplete="off"
        {...register} // Mantém o register para integrá-lo ao react-hook-form
        onChange={type === 'file' ? handleChange : register.onChange} // Lida com o caso de arquivo
      />
      {isLoading && (
        <InputRightElement>
          <Spinner size="sm" />
        </InputRightElement>
      )}
    </InputGroup>
  );
};
