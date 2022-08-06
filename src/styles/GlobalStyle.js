import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    html,body{
        padding: 0;
        margin: 0;
        box-sizing: border-box;
        font-family: 'Poppins', 'Nunito', 'Roboto', sans-serif;
        scroll-behavior: smooth;
    }
    
    * {
        box-sizing: border-box;
        padding: 0;
        margin: 0;
    }
    a {
        color: inherit;
        text-decoration: none;
    }
`;

export default GlobalStyle;
