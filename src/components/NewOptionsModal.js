import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import Close from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
  toggleOpenNewCourseModal,
  toggleOpenNewOptionsModal,
  toggleOpenNewParticipationModal,
  toggleOpenNewStudentsModal,
} from "../context/reducers/appSlice";
import colors from "../utils/colors";

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const posibleWidth = ["xs", "sm", "md", "lg", "xl"];

export default function NewOptionsModal() {
  const router = useRouter();
  const userInfo = useSelector(state => state.user.userInfo);
  const openNewOptionsModal = useSelector(
    state => state.app.openNewOptionsModal,
  );
  const dispatch = useDispatch();
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState(posibleWidth[2]);
  const { courseId } = router.query;

  const closeModal = () => {
    dispatch(
      toggleOpenNewOptionsModal({
        openNewOptionsModal: false,
      }),
    );
  };

  const openCourseModal = () => {
    closeModal();
    dispatch(
      toggleOpenNewCourseModal({
        openNewCourseModal: true,
      }),
    );
  };

  const openNewStudent = () => {
    closeModal();
    dispatch(
      toggleOpenNewStudentsModal({
        openNewStudentsModal: true,
      }),
    );
  };

  const openNewParticipation = () => {
    closeModal();
    dispatch(
      toggleOpenNewParticipationModal({
        openNewParticipationModal: true,
      }),
    );
  };

  const options = [
    {
      title: "Nuevo curso",
      method: () => openCourseModal(),
    },
    /*  {
      title: "Agregar nuevo alumno a este curso",
      method: openNewStudent,
    }, */
    {
      title: "Agregar nueva participación",
      method: () => openNewParticipation(),
    },
  ];

  if (userInfo?.role == "teacher" && courseId != undefined) {
    options.push({
      title: "Agregar nuevo alumno a este curso",
      method: () => openNewStudent(),
    });
  }

  return (
    <Dialog
      open={openNewOptionsModal}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      scroll="paper"
      onClose={closeModal}
      TransitionComponent={Transition}>
      <Container>
        <Header>
          <Title style={{ flex: 1 }}>Selecciona una opción</Title>
          <IconButton onClick={closeModal}>
            <Close fontSize="large" />
          </IconButton>
        </Header>
        {options.map((item, index) => (
          <OptionItem key={index} onClick={item.method}>
            <OptionText>{item.title}</OptionText>
            <ChevronRight />
          </OptionItem>
        ))}
      </Container>
    </Dialog>
  );
}

const Container = styled.div``;

const Header = styled.header`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-right: 20px;
`;
const Title = styled.p`
  font-size: 1.5rem;
  font-family: "Poppins", sans-serif;
  font-weight: bold;
  padding-left: 30px;
  padding-top: 30px;
  margin-bottom: 20px;
`;

const OptionItem = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-top: 20px;
  padding-bottom: 25px;
  padding-left: 30px;
  padding-right: 30px;

  :hover {
    background-color: rgba(155, 155, 155, 0.3);
  }
`;

const OptionText = styled.p``;
