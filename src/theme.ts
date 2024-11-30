// theme.js
import { extendTheme } from '@chakra-ui/react';

// Exemplo de um tema personalizado
const barberTheme = extendTheme({
  colors: {
    primary: {
        orange: '#DF9146',
        black: '#18191E',
        gray: "#26272B",
        gray03: "#838896"
    },

    neutral: {
        white: "#FFFFFF",
        black: "#000000" 
    }

  },
  fonts: {
    heading: `'Nunito', sans-serif`,  
    body: `'Nunito', sans-serif`,    // Fonte para corpo de texto
  },
  fontSizes: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',  
    '3xl': '30px',
    '4xl': '36px',
    '5xl': '48px',
    '6xl': '64px',
  },
  // Exemplo de customização de um componente
  fontWeights: {
    light: 200,
    regular: 400,
    bold: 700
  }
});

export default barberTheme;
