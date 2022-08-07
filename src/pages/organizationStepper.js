import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Backdrop from "@material-ui/core/Backdrop";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import { useRouter } from "next/router";
import {
  collection,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  setDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import StepContent from "@material-ui/core/StepContent";
import StepLabel from "@material-ui/core/StepLabel";
import { Button, makeStyles, Typography } from "@material-ui/core";
import GridLoader from "react-spinners/HashLoader";
import HashLoader from "react-spinners/HashLoader";
import Avatar from "../components/Avatar";
import SelectRole from "../components/organizationStepper/SelectRole";
import UserInformation from "../components/organizationStepper/UserInformation";
import SelectOrganization from "../components/organizationStepper/SelectOrganization";
import colors from "../utils/colors";
import { auth, db } from "../../firebase";

function Alert(props) {
  return (
    <MuiAlert severity="error" elevation={6} variant="filled" {...props} />
  );
}

const useStyles = makeStyles(() => ({
  root: {
    "& .MuiStepIcon-active": { color: colors?.MAIN_COLOR },
    "& .MuiStepIcon-completed": { color: colors?.MAIN_COLOR },
    "& .Mui-disabled .MuiStepIcon-root": { color: "#c1c1c1" },
  },
}));

export default function OrganizationStepper() {
  const router = useRouter();
  const classes = useStyles();
  const [userInfo, setUserInfo] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [role, setRole] = useState("teacher");
  const [displayName, setDisplayName] = useState("");
  const [selectedOrganizationId, setSelectedOrganizationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showErrorSnackbar, setShowErrorSnackbar] = useState(false);
  const [snackbarPosition, setSnackbarPosition] = useState({
    vertical: "top",
    horizontal: "center",
  });
  const [code, setCode] = useState("");
  const [organizationsList, setOrganizationsList] = useState(null);
  const { vertical, horizontal } = snackbarPosition;
  const user = auth.currentUser;
  const organizationsRef = collection(db, "organizations");
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (user != null) {
      const userDoc = doc(db, "users", user?.uid);
      getDoc(userDoc)
        .then(res => {
          if (res.exists()) {
            router.push("/");
          } else {
            const object = res.data();
            object.id = res.id;
            setUserInfo(object);
          }
        })
        .catch(err => {
          console.log("Err1: ", err);
        });
    }
  }, []);

  useEffect(() => {
    const q = query(organizationsRef, orderBy("name", "asc"));

    const suscriber = onSnapshot(
      q,
      snapshot => {
        if (!snapshot.empty) {
          const tempArray = [];
          snapshot.forEach(doc => {
            const object = doc.data();
            object.id = doc.id;
            tempArray.push(object);
          });
          if (isMounted.current) {
            setOrganizationsList(tempArray);
          }
        } else if (isMounted.current) {
          setOrganizationsList([]);
        }
      },
      err => {
        console.log("Err: ", err);
      },
    );

    return () => {
      suscriber();
    };
  }, []);

  const registerAccount = async () => {
    setLoading(true);

    const data = {
      organizationId: selectedOrganizationId,
      email: user.email,
      userId: user.uid,
      role,
      name: displayName?.toLowerCase()?.trim(),
      code: role == "teacher" ? null : code,
    };

    await setDoc(doc(db, "users", user?.uid), data)
      .then(() => {})
      .catch(err => {
        setLoading(false);
        setShowErrorSnackbar(true);
      });
  };

  const handleCloseErroSnackbar = () => {
    setShowErrorSnackbar(false);
  };

  const stepsList = [
    {
      title: "Selecciona tu rol",
      component: (
        <SelectRole
          role={role}
          setRole={setRole}
          setActiveStep={setActiveStep}
          code={code}
          setCode={setCode}
        />
      ),
    },
    {
      title: "Coloque su nombre completo",
      component: (
        <UserInformation
          displayName={displayName}
          setDisplayName={setDisplayName}
          setActiveStep={setActiveStep}
        />
      ),
    },
    {
      title: "Selecciona tu organización o institución educativa",
      component: (
        <SelectOrganization
          selectedOrganizationId={selectedOrganizationId}
          setSelectedOrganizationId={setSelectedOrganizationId}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          organizationsList={organizationsList}
          setOrganizationsList={setOrganizationsList}
        />
      ),
    },
    {
      title: "Terminar configuración",
      component: (
        <ConfirmComponent
          registerAccount={registerAccount}
          selectedOrganizationId={selectedOrganizationId}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          setSelectedOrganizationId={setSelectedOrganizationId}
        />
      ),
    },
  ];

  if (userInfo == null) {
    return (
      <Backdrop
        open
        style={{ zIndex: 1000, backgroundColor: "rgba(0,0,0,0.8)" }}>
        <HashLoader color={colors.MAIN_COLOR} size={70} />
      </Backdrop>
    );
  }

  return (
    <Container>
      <Header>
        <Text>Termina de registrar tu cuenta</Text>
        <Avatar />
      </Header>
      <Stepper activeStep={activeStep} orientation="vertical">
        {stepsList?.map(({ title, component }, index) => (
          <Step className={classes.root} key={title}>
            <StepLabel>
              <StepTitle active={index === activeStep}>{title}</StepTitle>
            </StepLabel>
            <StepContent>{component}</StepContent>
          </Step>
        ))}
      </Stepper>
      <Backdrop
        open={loading}
        style={{
          zIndex: 1000,
          backgroundColor: "rgba(0,0,0,0.8)",
          display: "flex",
          flexDirection: "column",
        }}>
        <GridLoader color={colors.MAIN_COLOR} size={80} />
        <Message>Registrando cuenta, espere un momento...</Message>
      </Backdrop>
      <Snackbar
        open={showErrorSnackbar}
        autoHideDuration={4000}
        onClose={handleCloseErroSnackbar}
        anchorOrigin={{ vertical, horizontal }}
        key={vertical + horizontal}>
        <Alert onClose={handleCloseErroSnackbar}>
          Ocurrió un error, inténtalo de nuevo
        </Alert>
      </Snackbar>
    </Container>
  );
}

function ConfirmComponent({
  registerAccount,
  activeStep,
  setActiveStep,
  setSelectedOrganizationId,
}) {
  const onClickPrev = () => {
    setSelectedOrganizationId(null);
    setActiveStep(prevStep => prevStep - 1);
  };

  return (
    <>
      <ConfirmRegisterContainer>
        <ConfirmRegisterButton onClick={registerAccount}>
          <ButtonText style={{ color: "white" }}>
            Confirmar registro de cuenta
          </ButtonText>
        </ConfirmRegisterButton>
      </ConfirmRegisterContainer>
      <CustomButton
        style={{
          backgroundColor: "transparent",
          display: "block",
          marginTop: "20px",
        }}
        onClick={onClickPrev}>
        <ButtonText style={{ color: "black" }}>Atrás</ButtonText>
      </CustomButton>
    </>
  );
}

const CustomButton = styled(Button)`
  &&& {
    background-color: ${props =>
      props.isDisabled ? "#c1c1c1" : colors.MAIN_COLOR};
    padding-left: 15px;
    padding-right: 15px;
  }
`;

const Container = styled.div`
  padding-left: 4%;
  padding-right: 4%;
`;

const Text = styled.p`
  font-size: 1.5rem;
  font-weight: 500;
`;

const Header = styled.header`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 120px;
`;

const StepTitle = styled.p`
  font-family: "Poppins", sans-serif;
  font-size: 1rem;
  color: black;
`;

const ConfirmRegisterContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-top: 15px;
`;
const ConfirmRegisterButton = styled(Button)`
  &&& {
    background-color: ${colors.MAIN_COLOR};
    padding-left: 20px;
    padding-right: 20px;
    margin-right: 20px;
    height: 40px;
    border-radius: 10px;
  }
`;

const ButtonText = styled.p`
  color: ${colors.MAIN_COLOR};
  text-transform: none;
  font-family: "Poppins", sans-serif;
`;

const Message = styled.p`
  font-size: 1.4rem;
  color: white;
  margin-top: 25px;
`;
