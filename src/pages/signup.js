import React, { useState } from "react";
import styled from "styled-components";
import Image from "next/image";
import AlternateEmailIcon from "@material-ui/icons/AlternateEmail";
import VisibilityIcon from "@material-ui/icons/Visibility";
import Button from "@material-ui/core/Button";
import { useRouter } from "next/router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { size } from "lodash";
import { ClipLoader } from "react-spinners";
import logoImage from "../../public/images/logo.png";
import LoginInput from "../components/LoginInput";
import colors from "../utils/colors";
import validationEmail from "../utils/validationEmail";
import { auth } from "../../firebase";

export default function Signup() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState({});

  const onClickSignin = () => {
    router.push("/login");
  };

  const signup = () => {
    const errors = {};
    if (!emailInput || !passwordInput || !confirmPasswordInput) {
      if (!emailInput) {
        errors.email = true;
        errors.emailMessage = "El correo es obligatorio";
      }
      if (!passwordInput) {
        errors.password = true;
        errors.passwordMessage = "La contraseña es obligatoria";
      }
      if (!confirmPasswordInput) {
        errors.confirmPassword = true;
        errors.confirmPasswordMessage = "La contraseña es obligatoria";
      }
    } else if (!validationEmail(emailInput.trim())) {
      errors.invalidEmail = true;
      errors.emailMessage = "Introduzca un correo válido";
    } else if (passwordInput !== confirmPasswordInput) {
      errors.password = true;
      errors.passwordMessage = "Las contraseñas no coinciden";
      errors.confirmPassword = true;
      errors.confirmPasswordMessage = "Las contraseñas no coinciden";
    } else if (size(passwordInput) < 6) {
      errors.password = true;
      errors.passwordMessage = "Mínimo 6 caracteres";
      errors.confirmPassword = true;
      errors.confirmPasswordMessage = "Mínimo 6 caracteres";
    } else {
      setLoading(true);
      createUserWithEmailAndPassword(auth, emailInput.trim(), passwordInput)
        .then(() => {
          setLoading(false);
        })
        .catch(err => {
          let message = "Ocurrió un error, inténtalo otra vez";
          setLoading(false);
          switch (err.code) {
            case "auth/email-already-in-use":
              message = "El correo ya está siendo utilizado";
              break;
            case "auth/internal-error":
              message = "Ocurrió un error, inténtalo otra vez";
              break;
            default:
              break;
          }
          errors.main = true;
          errors.mainMessage = message;
        });
    }
    setFormError(errors);
  };

  return (
    <Container>
      <FormContainer>
        <LogoContainerHeader>
          <LogoContainer>
            <Image src={logoImage} layout="fill" objectFit="contain" />
          </LogoContainer>
        </LogoContainerHeader>
        <Title>Registro</Title>
        {formError?.main && (
          <ErrorText style={{ textAlign: "center", marginBottom: "10px" }}>
            {formError?.mainMessage}
          </ErrorText>
        )}
        <LoginInput
          content={emailInput}
          setContent={setEmailInput}
          placeholder="Correo"
          icon={<AlternateEmailIcon />}
        />
        {(formError?.email || formError?.invalidEmail) && (
          <ErrorText>{formError.emailMessage}</ErrorText>
        )}
        <div style={{ marginBottom: "20px" }} />
        <LoginInput
          content={passwordInput}
          setContent={setPasswordInput}
          placeholder="Contraseña"
          type="password"
          icon={<VisibilityIcon />}
        />
        {(formError?.password || formError?.passwordMessage) && (
          <ErrorText>{formError.passwordMessage}</ErrorText>
        )}
        <div style={{ marginBottom: "20px" }} />
        <LoginInput
          content={confirmPasswordInput}
          setContent={setConfirmPasswordInput}
          placeholder="Confirmar contraseña"
          type="password"
          icon={<VisibilityIcon />}
        />
        {(formError?.confirmPassword || formError?.confirmPasswordMessage) && (
          <ErrorText>{formError.confirmPasswordMessage}</ErrorText>
        )}
        <ButtonSignupContainer>
          <ButtonSignup onClick={signup}>
            {loading ? (
              <ClipLoader color="white" size={20} />
            ) : (
              <SignupText>Registrarte</SignupText>
            )}
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
    height: 50px;
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

const ErrorText = styled.p`
  font-size: 0.9rem;
  color: red;
  margin-top: 10px;
`;
