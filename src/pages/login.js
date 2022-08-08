import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import styled from "styled-components";
import Image from "next/image";
import AlternateEmailIcon from "@material-ui/icons/AlternateEmail";
import VisibilityIcon from "@material-ui/icons/Visibility";
import Button from "@material-ui/core/Button";
import { useRouter } from "next/router";
import ClipLoader from "react-spinners/ClipLoader";
import loginImage from "../../public/images/login.png";
import logoImage from "../../public/images/logo.png";
import LoginInput from "../components/LoginInput";
import colors from "../utils/colors";
import validationEmail from "../utils/validationEmail";
import { auth, provider } from "../../firebase";

export default function Login() {
  const router = useRouter();
  const [passwordInput, setPasswordInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [formError, setFormError] = useState({});
  const [loading, setLoading] = useState(false);

  const onClickForgotPassword = () => {
    router.push("/forgot-password");
  };

  const onClickSignUp = () => {
    router.push("/signup");
  };

  const signin = () => {
    const errors = {};
    if (!emailInput || !passwordInput) {
      if (!emailInput) {
        errors.email = true;
        errors.emailMessage = "El correo es obligatorio";
      }
      if (!passwordInput) {
        errors.password = true;
        errors.passwordMessage = "La contraseña es obligatoria";
      }
    } else if (!validationEmail(emailInput.trim())) {
      errors.invalidEmail = true;
      errors.emailMessage = "Introduzca un correo válido";
    } else {
      setLoading(true);
      signInWithEmailAndPassword(auth, emailInput.trim(), passwordInput)
        .then(() => {})
        .catch(err => {
          let message = "Correo o contraseña incorrectos";
          switch (err.code) {
            case "auth/user-not-found":
              message = "Correo no registrado";
              break;
            case "auth/unknown":
              message = "Ha ocurrido un error, revisa tu conexión a internet";
              break;
            default:
              break;
          }
          setLoading(false);
          errors.main = true;
          errors.mainMessage = message;
        });
    }
    setFormError(errors);
  };

  return (
    <Container>
      {/*  <LeftContainer>
        <ImageContainer>
          <Image src={loginImage} layout="responsive" objectFit="contain" />
        </ImageContainer>
      </LeftContainer> */}
      <RightContainer>
        <LogoContainerHeader>
          <LogoContainer>
            <Image src={logoImage} layout="fill" objectFit="contain" />
          </LogoContainer>
        </LogoContainerHeader>
        <Title>Inicia sesión</Title>
        {(formError?.main || formError?.mainMessage) && (
          <ErrorText style={{ textAlign: "center", marginBottom: "15px" }}>
            {formError.mainMessage}
          </ErrorText>
        )}
        <LoginInput
          placeholder="Correo"
          content={emailInput}
          setContent={setEmailInput}
          icon={<AlternateEmailIcon />}
        />
        {(formError?.email || formError?.invalidEmail) && (
          <ErrorText>{formError.emailMessage}</ErrorText>
        )}
        <ForgotYourPasswordContainer>
          <Button onClick={onClickForgotPassword}>
            <ForgotYourPasswordText>¿La olvidaste?</ForgotYourPasswordText>
          </Button>
        </ForgotYourPasswordContainer>
        <LoginInput
          placeholder="Contraseña"
          type="password"
          icon={<VisibilityIcon />}
          content={passwordInput}
          setContent={setPasswordInput}
        />
        {formError?.password && (
          <ErrorText>{formError.passwordMessage}</ErrorText>
        )}
        <ButtonSignInContainer>
          <ButtonSignin onClick={signin}>
            {loading ? (
              <ClipLoader color="white" size={20} />
            ) : (
              <SigninText>Ingresar</SigninText>
            )}
          </ButtonSignin>
        </ButtonSignInContainer>
        <DontHaveAccountContainer>
          <DontHaveAccountAuxText>
            ¿No tienes una cuenta?
          </DontHaveAccountAuxText>
          <DontHaveAccountButton onClick={onClickSignUp}>
            Regístrate
          </DontHaveAccountButton>
        </DontHaveAccountContainer>
      </RightContainer>
    </Container>
  );
}

const Container = styled.main`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-bottom: 120px;

  @media ${props => props.theme.breakpoints.xxl} {
  }
`;

const LeftContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
  flex: 0.4;
  background-color: ${colors.MAIN_COLOR};
`;

const ImageContainer = styled.div`
  position: relative;
  padding-right: 40px;
`;

const RightContainer = styled.div`
  height: 100vh;
  padding-top: 80px;
  width: 65%;
  max-width: 500px;
`;

const LogoContainerHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 35px;
`;

const LogoContainer = styled.div`
  position: relative;
  height: 130px;
  width: 130px;
`;

const Title = styled.h4`
  font-size: 1.6rem;
  text-align: center;
  margin-bottom: 20px;
  margin-top: 15px;
  font-style: normal;
  font-weight: 600;
`;

const ForgotYourPasswordContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin-top: 16px;
  margin-bottom: 5px;
`;

const ForgotYourPasswordText = styled.p`
  text-transform: none;
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
`;

const ButtonSignInContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 40px;
`;

const ButtonSignin = styled(Button)`
  &&& {
    background-color: ${colors.MAIN_COLOR};
    border-radius: 20px;
    padding-top: 14px;
    padding-bottom: 14px;
    width: 90%;
    height: 50px;
  }
`;

const SigninText = styled.p`
  color: white;
  text-transform: none;
  font-family: "Poppins", sans-serif;
  font-size: 1rem;
`;

const DontHaveAccountContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
`;

const DontHaveAccountAuxText = styled.p`
  font-family: "Poppins", sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
`;

const DontHaveAccountButton = styled.p`
  color: ${colors.MAIN_COLOR};
  font-weight: 500;
  margin-left: 4px;
  font-size: 0.9rem;
  cursor: pointer;
`;

const ErrorText = styled.p`
  font-size: 0.9rem;
  color: red;
  margin-top: 10px;
`;
