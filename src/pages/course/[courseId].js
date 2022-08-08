import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import { ClipLoader } from "react-spinners";
import Portal from "@material-ui/core/Portal";
import Button from "@material-ui/core/Button";
import FileCopyIcon from "@material-ui/icons/FileCopyOutlined";
import ContentLoader, { Facebook } from "react-content-loader";
import { useSelector } from "react-redux";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import Image from "next/image";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import { makeStyles } from "@material-ui/core";
import Header from "../../components/coursePage/Header";
import { db } from "../../../firebase";
import StudentsList from "../../components/coursePage/StudentsList";
import HeaderTab from "../../components/HeaderTab";
import ParticipationsList from "../../components/coursePage/ParticipationsList";

const useStyles = makeStyles(theme => ({
  root: {
    transform: "translateZ(0px)",
    flexGrow: 1,
  },
  exampleWrapper: {
    position: "relative",
    marginTop: theme.spacing(3),
    height: 380,
  },
  radioGroup: {
    margin: theme.spacing(1, 0),
  },
  speedDial: {
    position: "absolute",
    "&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft": {
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    "&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight": {
      top: theme.spacing(2),
      left: theme.spacing(2),
    },
  },
}));

const actions = [{ icon: <FileCopyIcon />, name: "Copy" }];

const tabs = [
  {
    label: "Alumnos",
    path: "students",
  },
  {
    label: "Participaciones",
    path: "participations",
  },
];

export default function CoursePage() {
  const classes = useStyles();
  const userInfo = useSelector(state => state.user.userInfo);
  const [courseInfo, setCourseInfo] = useState(null);
  const [direction, setDirection] = useState("up");
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [view, setView] = useState("students");
  const router = useRouter();
  const isMounted = useRef(false);
  const { courseId } = router.query;
  console.log("view1: ", view);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {}, []);

  useEffect(() => {
    if (userInfo != null) {
      const courseReference = doc(
        db,
        "organizations",
        userInfo?.organizationId,
        "courses",
        courseId,
      );

      const suscriber = onSnapshot(
        courseReference,
        res => {
          if (res.exists) {
            const object = res.data();
            object.id = res.id;
            if (isMounted.current) {
              setCourseInfo(object);
            }
          } else if (isMounted.current) {
            setCourseInfo("doesn't exist");
          }
        },
        err => {
          console.log("Err: ", err);
        },
      );

      return () => {
        suscriber();
      };
    }
  }, [userInfo]);

  if (courseInfo == null || userInfo == null) {
    return (
      <LoaderContainer>
        <ClipLoader size={80} />
      </LoaderContainer>
    );
  }

  if (courseInfo == "doesn't exist") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "120px",
        }}>
        <ImageContainer>
          <Image
            src={require("../../../public/images/courseDoesntExist.png")}
            layout="fill"
            objectFit="contain"
          />
        </ImageContainer>
        <Message>Lo sentimos, este curso no se encuentra disponible</Message>
      </div>
    );
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleClick = () => {
    handleClose();
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <Container>
      <Header course={courseInfo} />
      <TabsContainer>
        {tabs.map((item, index) => (
          <HeaderTab key={index} item={item} setView={setView} />
        ))}
      </TabsContainer>
      <ParticipationsList course={courseInfo} view={view} />
      <StudentsList course={courseInfo} view={view} />
    </Container>
  );
}

const Container = styled.main`
  padding: 25px 15%;
  min-height: calc(100vh - 70px);
`;

const LoaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 80px);
  width: 100vw;
`;

const ImageContainer = styled.div`
  position: relative;
  height: 400px;
  width: 600px;
`;

const Message = styled.p`
  font-size: 1.2rem;
  margin-top: 40px;
`;

const CustomButton = styled(Button)`
  &&& {
    position: absolute;
    right: 0px;
    bottom: 0px;
  }
`;

const ButtonText = styled.p``;

const TabsContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 25px;
`;
