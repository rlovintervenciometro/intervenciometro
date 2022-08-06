import React, { useState } from "react";
import styled from "styled-components";
import Image from "next/image";
import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { auth } from "../../../firebase";
import withoutCoursesImage from "../../../public/images/withoutCourses.png";
import colors from "../../utils/colors";

const useStyles = makeStyles(theme => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

export default function CoursesList() {
  const classes = useStyles();
  const [courses, setCourses] = useState(null);
  const user = auth.currentUser;

  return (
    <Container>
      <ImageContainer>
        <Image src={withoutCoursesImage} layout="fill" objectFit="contain" />
      </ImageContainer>
      <Message>Ups, todavía no has registrado ningún curso</Message>
      <CustomFab variant="extended">
        <AddIcon fontSize="large" style={{ color: "white" }} />
        <FabText>Nuevo curso</FabText>
      </CustomFab>
    </Container>
  );
}

const Container = styled.div`
  height: calc(100vh - 70px);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ImageContainer = styled.div`
  position: relative;
  height: 550px;
  width: 550px;
  margin-bottom: 30px;
  margin-top: 40px;
`;

const Message = styled.p`
  font-size: 1.3rem;
  font-weight: 500;
`;

const CustomFab = styled(Fab)`
  &&& {
    background-color: ${colors.MAIN_COLOR};
    padding-left: 25px;
    padding-right: 25px;
    height: 60px;
    position: absolute;
    right: 60px;
    bottom: 60px;
  }
`;

const FabText = styled.p`
  text-transform: none;
  font-size: 1.1rem;
  margin-left: 10px;
  font-family: "Poppins", sans-serif;
  color: white;
`;
