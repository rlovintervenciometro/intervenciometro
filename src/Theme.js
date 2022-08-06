import React from "react";
import { ThemeProvider } from "styled-components";

const theme = {
  colors: {},
  fonts: ["Nunito", "Roboto"],
  fontSizes: {},
  breakpoints: {
    xs: "screen and (max-width: 330px)",
    sd: "screen and (max-width: 400px)",
    xm: "screen and (max-width: 540px)",
    sm: "screen and (max-width: 640px)",
    md: "screen and (max-width: 768px)",
    ml: "screen and (max-width: 860px)",
    lg: "screen and (max-width: 1024px)",
    xl: "screen and (max-width: 1280px)",
    xxl: "screen and (max-width: 1400px)",
  },
};

function Theme({ children }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export default Theme;
