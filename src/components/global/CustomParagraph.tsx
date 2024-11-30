import { Text, TextProps } from '@chakra-ui/react';

type CustomParagraphProps = TextProps & {
  children: React.ReactNode;
};

const CustomParagraph: React.FC<CustomParagraphProps> = ({
  children,
  ...props
}) => {
  return (
    <Text lineHeight="tall" {...props}>
      {children}
    </Text>
  );
};

export default CustomParagraph;
