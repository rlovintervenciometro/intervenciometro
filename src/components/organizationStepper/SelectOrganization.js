import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import Close from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import {
  collection,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  addDoc,
} from "firebase/firestore";
import { ClipLoader } from "react-spinners";
import { auth, db } from "../../../firebase";
import colors from "../../utils/colors";

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const posibleWidth = ["xs", "sm", "md", "lg", "xl"];

export default function SelectOrganization({
  selectedOrganizationId,
  setSelectedOrganizationId,
  activeStep,
  setActiveStep,
  organizationsList,
  setOrganizationsList,
}) {
  const user = auth.currentUser;
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState(posibleWidth[0]);
  const organizationsRef = collection(db, "organizations");
  const [showModal, setShowModal] = useState(false);
  const [newOrganizationName, setNewOrganizationName] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState({});
  const [snackbarPosition, setSnackbarPosition] = useState({
    vertical: "top",
    horizontal: "center",
  });
  const [showSnackbarnOrganization, setShowSnackbarnOrganization] =
    useState(false);
  const { vertical, horizontal } = snackbarPosition;
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const getOrganizationsList = () => {
    if (organizationsList != null) {
      const tempArray = [];
      organizationsList?.forEach((item, index) => {
        tempArray.push({
          id: item?.id,
          name: item?.name,
        });
      });
      return tempArray;
    }
    return [];
  };

  const openModal = () => setShowModal(true);

  const createOrganization = async () => {
    const errors = {};
    if (!newOrganizationName) {
      errors.email = true;
      errors.emailMessage = "Este campo es obligatorio";
    } else {
      setLoading(true);
      await addDoc(organizationsRef, {
        name: newOrganizationName?.trim(),
        ownerId: user?.uid,
      })
        .then(() => {
          setShowModal(false);
          setShowSnackbarnOrganization(true);
          setLoading(false);
          setNewOrganizationName("");
        })
        .catch(() => {
          setLoading(false);
          errors.main = true;
          errors.mainMessage = "Ocurrió un error. Inténtalo de nuevo";
        });
    }
    setFormError(errors);
  };

  const onClickPrev = () => {
    setSelectedOrganizationId(null);
    setActiveStep(prevStep => prevStep - 1);
  };

  const handleCloseSnackbarOrganization = () =>
    setShowSnackbarnOrganization(false);

  const onClickNext = () => {
    setActiveStep(prevStep => prevStep + 1);
  };

  return (
    <>
      <Container>
        {organizationsList == null ? (
          <LoaderContainer>
            <ClipLoader />
          </LoaderContainer>
        ) : (
          <>
            {organizationsList?.length == 0 ? (
              <Message>No se encontró ninguna organización</Message>
            ) : (
              <Autocomplete
                onChange={(e, value) => {
                  setSelectedOrganizationId(value?.id);
                }}
                style={{ width: "100%" }}
                disablePortal
                id="combo-box-organizations"
                options={getOrganizationsList()}
                getOptionLabel={option => option.name}
                renderInput={params => (
                  <TextField {...params} label="Organización..." />
                )}
              />
            )}
            {organizationsList?.length == 0 && (
              <Divider
                style={{
                  backgroundColor: "#c1c1c1",
                  height: "2px",
                  width: "100%",
                  marginTop: "5px",
                }}
              />
            )}
            <Message>O puedes crear una nueva organización</Message>
            <CustomButton onClick={openModal}>
              <ButtonText>Crear organización</ButtonText>
            </CustomButton>
            <ButtonsContainer>
              <CustomButton
                style={{ backgroundColor: "transparent" }}
                onClick={onClickPrev}>
                <ButtonText style={{ color: "black" }}>Atrás</ButtonText>
              </CustomButton>
              <CustomButton
                disabled={selectedOrganizationId == null}
                onClick={onClickNext}
                isDisabled={selectedOrganizationId == null}>
                <ButtonText>Siguiente</ButtonText>
              </CustomButton>
            </ButtonsContainer>
          </>
        )}
      </Container>
      <CustomDialog
        open={showModal}
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        scroll="paper"
        onClose={() => setShowModal(false)}
        TransitionComponent={Transition}>
        <DialogContainer>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              padding: "8px 10px",
            }}>
            <IconButton
              onClick={() => {
                if (!loading) {
                  setShowModal(false);
                }
              }}>
              <Close />
            </IconButton>
          </div>
          <Subtitle>Crear nueva organización</Subtitle>
          {formError?.main && (
            <ErrorText style={{ textAlign: "center" }}>
              {formError.mainMessage}
            </ErrorText>
          )}
          <TextField
            value={newOrganizationName}
            placeholder="Nombre de la organización"
            variant="outlined"
            style={{ width: "calc(100% - 20px)", marginBottom: "5px" }}
            onChange={e => {
              setFormError({});
              setNewOrganizationName(e.target.value);
            }}
          />
          {formError?.email && <ErrorText>{formError.emailMessage}</ErrorText>}
          <Footer>
            <CustomButton
              onClick={createOrganization}
              style={{ width: "calc(100% - 20px)" }}>
              {loading ? (
                <ClipLoader color="white" size={20} />
              ) : (
                <ButtonText>Crear organización</ButtonText>
              )}
            </CustomButton>
          </Footer>
        </DialogContainer>
      </CustomDialog>
      <Snackbar
        open={showSnackbarnOrganization}
        autoHideDuration={4000}
        onClose={handleCloseSnackbarOrganization}
        anchorOrigin={{ vertical, horizontal }}
        key={vertical + horizontal}>
        <Alert onClose={handleCloseSnackbarOrganization} severity="success">
          La organización se creó correctamente
        </Alert>
      </Snackbar>
    </>
  );
}

const ErrorText = styled.p`
  font-size: 0.9rem;
  color: red;
  margin-top: 10px;
`;

const CustomDialog = styled(Dialog)``;

const DialogContainer = styled.div`
  position: relative;
  flex-direction: column;
  align-items: center;
  padding-left: 20px;
  padding-bottom: 20px;
`;

const Container = styled.div`
  width: 35vw;
  /*   display: flex;
  flex-direction: column;
  align-items: center; */
`;

const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 50px;
  padding-top: 20px;
`;

const Message = styled.p`
  padding-top: 20px;
  margin-bottom: 15px;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 15px;
`;
const Footer = styled.footer`
  display: flex;
  flex-direction: row;
  margin-top: 30px;
`;

const CustomButton = styled(Button)`
  &&& {
    background-color: ${props =>
      props.isDisabled ? "#c1c1c1" : colors.MAIN_COLOR};
    padding-left: 15px;
    padding-right: 15px;
  }
`;

const ButtonText = styled.p`
  color: white;
  text-transform: none;
  font-family: "Poppins", sans-serif;
`;

const ButtonsContainer = styled.div`
  margin-top: 25px;
`;
