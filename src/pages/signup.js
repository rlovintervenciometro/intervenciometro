import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import styled from "styled-components";
import Image from "next/image";
import AlternateEmailIcon from "@material-ui/icons/AlternateEmail";
import VisibilityIcon from "@material-ui/icons/Visibility";
import Button from "@material-ui/core/Button";
import { useRouter } from "next/router";
import logoImage from "../../public/images/logo.png";
import LoginInput from "../components/LoginInput";
import colors from "../utils/colors";

export default function Signup() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");

  const onClickSignin = () => {
    router.push("/login");
  };

  const signup = () => {};

  return (
    <Container>
      <FormContainer>
        <LogoContainerHeader>
          <LogoContainer>
            <Image src={logoImage} layout="fill" objectFit="contain" />
          </LogoContainer>
        </LogoContainerHeader>
        <Title>Registro</Title>
        <LoginInput placeholder="Correo" icon={<AlternateEmailIcon />} />
        <div style={{ marginBottom: "20px" }} />
        <LoginInput
          placeholder="Contraseña"
          type="password"
          icon={<VisibilityIcon />}
        />
        <div style={{ marginBottom: "20px" }} />
        <LoginInput
          placeholder="Confirmar contraseña"
          type="password"
          icon={<VisibilityIcon />}
        />
        <ButtonSignupContainer>
          <ButtonSignup onClick={signup}>
            <SignupText>Registrarte</SignupText>
          </ButtonSignup>
        </ButtonSignupContainer>

        <DontHaveAccountContainer>
          <DontHaveAccountAuxText>
            ¿Ya tienes una cuenta?
          </DontHaveAccountAuxText>
          <DontHaveAccountButton onClick={onClickSignin}>
            Inicia sesión
          </DontHaveAccountButton>
        </DontHaveAccountContainer>
      </FormContainer>
    </Container>
  );
}

const Container = styled.main`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const FormContainer = styled.div`
  width: 500px;
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

const ButtonSignupContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 40px;
`;

const ButtonSignup = styled(Button)`
  &&& {
    background-color: ${colors.MAIN_COLOR};
    border-radius: 20px;
    padding-top: 14px;
    padding-bottom: 14px;
    width: 90%;
  }
`;

const SignupText = styled.p`
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
