import { Heading } from '@chakra-ui/react';

type Props = {
  style: {
    color: string;
    fontSize: string;
    margin: string;
    padding?: string;
    textAlign: "center" | "right" | "left";
  };
  children: React.ReactNode;
};

export const Title = ({ style, children }: Props) => {
  return (
    <Heading
      as="h2"
      color={style.color}
      fontSize={style.fontSize}
      margin={style.margin}
      padding={style.padding}
      textAlign={style.textAlign}
    >
      {children}
    </Heading>
  );
};
