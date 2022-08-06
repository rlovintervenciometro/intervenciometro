import React, { useState } from "react";
import styled from "styled-components";
import { Button, IconButton } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { useRouter } from "next/router";
import AlternateEmailIcon from "@material-ui/icons/AlternateEmail";
import Image from "next/image";
import ClipLoader from "react-spinners/ClipLoader";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import { sendPasswordResetEmail } from "firebase/auth";
import LoginInput from "../components/LoginInput";
import colors from "../utils/colors";
import forgotPasswordImage from "../../public/images/forgotPassword.png";
import validationEmail from "../utils/validationEmail";
import { auth } from "../../firebase";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function ForgotPassword() {
  const router = useRouter();
  const [emailInput, setEmailInput] = useState("");
  const [formError, setFormError] = useState({});
  const [loading, setLoading] = useState(false);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [snackbarPosition, setSnackbarPosition] = useState({
    vertical: "top",
    horizontal: "center",
  });

  const { vertical, horizontal } = snackbarPosition;

  const goBack = () => {
    router.push("/login");
  };

  const onPressSendCode = () => {
    const errors = {};
    if (!emailInput) {
      errors.email = true;
      errors.emailMessage = "El correo es obligatorio";
    } else if (!validationEmail(emailInput)) {
      errors.invalidEmail = true;
      errors.emailMessage = "Introduzca un correo válido";
    } else {
      setLoading(true);
      sendPasswordResetEmail(auth, emailInput?.trim())
        .then(() => {
          setLoading(false);
          setShowConfirmationPopup(true);
          setTimeout(() => {
            setShowConfirmationPopup(false);
          }, 4000);
        })
        .catch(err => {
          let message = "Ha ocurrido un error";
          switch (err.code) {
            case "auth/user-not-found":
              message = "Correo no registrado";
              break;
            case "auth/unknown":
              message = "Ha ocurrido un error, inténtalo otra vez";
              break;
            default:
              break;
          }
          setLoading(false);
          errors.email = true;
          errors.emailMessage = message;
        });
    }
    setFormError(errors);
  };

  const handleClose = () => {
    setShowConfirmationPopup(false);
  };

  return (
    <Container>
      <Header>
        <IconButton onClick={goBack}>
          <ArrowBackIcon fontSize="large" />
        </IconButton>
      </Header>
      <FormContainer>
        <Title>Reestablece tu contraseña</Title>
        <LoginInput
          content={emailInput}
          setContent={setEmailInput}
          placeholder="Correo"
          icon={<AlternateEmailIcon />}
        />
        {(formError?.email || formError?.emailMessage) && (
          <ErrorText>{formError.emailMessage}</ErrorText>
        )}
        <ButtonSendCodeContainer>
          <ButtonSendCode onClick={onPressSendCode}>
            {loading ? (
              <ClipLoader color="white" size={20} />
            ) : (
              <ButtonSendCodeText>
                Enviar código de recuperación
              </ButtonSendCodeText>
            )}
          </ButtonSendCode>
        </ButtonSendCodeContainer>
      </FormContainer>
      <AbsoluteImage>
        <ImageContainer>
          <Image src={forgotPasswordImage} layout="fill" objectFit="contain" />
        </ImageContainer>
      </AbsoluteImage>
      <BottomLeftCircle />
      <TopRightCircle />
      <Snackbar
        open={showConfirmationPopup}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical, horizontal }}
        key={vertical + horizontal}>
        <Alert onClose={handleClose} severity="success">
          {`Se ha enviado un correo a ${emailInput}. Si no le llega ningún correo, verifique su bandeja de Spam.`}
        </Alert>
      </Snackbar>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  padding-left: 35px;
  height: 100vh;
  overflow: hidden;
`;

const Header = styled.header`
  padding-top: 25px;
`;

const AbsoluteImage = styled.div`
  position: absolute;
  bottom: 0px;
  right: 0px;
`;

const ImageContainer = styled.div`
  position: relative;
  height: 100vh;
  min-width: 40vw;
`;

const FormContainer = styled.div`
  width: 35%;
`;

const Title = styled.p`
  font-size: 1.5rem;
  text-align: left;
  margin-bottom: 40px;
  margin-top: 75px;
  font-style: normal;
  font-weight: 600;
`;

const ButtonSendCodeContainer = styled.div``;

const ButtonSendCode = styled(Button)`
  &&& {
    background-color: ${colors.MAIN_COLOR};
    border-radius: 20px;
    padding-top: 14px;
    padding-bottom: 14px;
    margin-top: 25px;
    width: 100%;
  }
`;

const ButtonSendCodeText = styled.p`
  color: white;
  text-transform: none;
  font-family: "Poppins", sans-serif;
  font-size: 1rem;
`;

const BottomLeftCircle = styled.div`
  background-color: ${colors.MAIN_COLOR};
  height: 550px;
  width: 650px;
  position: absolute;
  bottom: -300px;
  border-radius: 100%;
  left: -120px;
`;

const TopRightCircle = styled.div`
  background-color: ${colors.MAIN_COLOR};
  height: 550px;
  width: 650px;
  position: absolute;
  top: -300px;
  border-radius: 100%;
  right: -260px;
`;

const ErrorText = styled.p`
  font-size: 0.9rem;
  color: red;
  margin-top: 10px;
`;
