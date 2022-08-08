import { capitalize } from "lodash";
import React, { useState } from "react";
import styled from "styled-components";
import moment from "moment";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import Close from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import { ChevronRight } from "@material-ui/icons";
import scores from "../../utils/scores";

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

const posibleWidth = ["xs", "sm", "md", "lg", "xl"];

export default function ParticipationItem({ participation }) {
  const [showModal, setShowModal] = useState(false);
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState(posibleWidth[2]);
  const getSubject = () =>
    participation?.subject
      ? capitalize(participation?.subject)
      : capitalize(participation?.identifier);

  const getCreateAt = () =>
    moment(participation?.createAtMoment, "LLL").format("hh:mm a") || "";

  const getHours = () =>
    moment(participation?.createAtMoment, "LLL").format("DD/MM/YYYY") || "";

  const getScore = () => {
    const { score } = participation;
    const index = scores?.findIndex(item => (item.value = score));
    if (index != -1) {
      return scores[index].label;
    }
    return "";
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <Container onClick={() => setShowModal(true)}>
        <LeftContainer>
          <Subject>{getSubject()}</Subject>
          <Comment>{capitalize(participation?.comment)}</Comment>
        </LeftContainer>
        <RightContainer>
          <DateText>
            {getCreateAt()} - {getHours()}
          </DateText>
          <Score>Calificación: {getScore()}</Score>
        </RightContainer>
        <ChevronRight />
      </Container>
      <Dialog
        open={showModal}
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        scroll="paper"
        onClose={closeModal}
        keepMounted
        TransitionComponent={Transition}>
        <DialogContainer>
          <Header>
            <Title style={{ flex: 1 }}>Detalles de la participación</Title>
            <IconButton onClick={closeModal}>
              <Close fontSize="large" />
            </IconButton>
          </Header>
          <Item>
            <Subtitle>Pregunta o Identificador:</Subtitle>
            <Value>{participation?.subject || participation?.identifier}</Value>
          </Item>
          <Item>
            <Subtitle>Alumno:</Subtitle>
            <Value>{participation?.studentName || ""}</Value>
          </Item>
          <Item>
            <Subtitle>Correo del alumno:</Subtitle>
            <Value>{participation?.studentEmail || ""}</Value>
          </Item>
          <Item>
            <Subtitle>Código del alumno:</Subtitle>
            <Value>{participation?.studentCode || ""}</Value>
          </Item>
          <Item>
            <Subtitle>Calificación:</Subtitle>
            <Value>{getScore()}</Value>
          </Item>
          <Item>
            <Subtitle>Comentario:</Subtitle>
            <Value>{participation?.comment || "Sin comentarios"}</Value>
          </Item>
        </DialogContainer>
      </Dialog>
    </>
  );
}

const DialogContainer = styled.div`
  padding-bottom: 25px;
`;

const Container = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 15px 20px;
  padding-right: 10px;
  border-bottom: 1px solid #c1c1c1;

  :hover {
    background-color: rgba(155, 155, 155, 0.3);
  }
`;

const LeftContainer = styled.div`
  flex: 1;
`;
const Subject = styled.p`
  font-size: 1rem;
  color: black;
  font-weight: bold;
`;
const Comment = styled.p`
  font-size: 1rem;
  color: #c1c1c1;
  font-weight: 300;
`;
const RightContainer = styled.div`
  margin-right: 20px;
`;
const DateText = styled.p`
  font-size: 0.9rem;
  color: grey;
`;
const Score = styled.p``;
const HourText = styled.p``;

const Header = styled.header`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-right: 20px;
  width: 100%;
  margin-top: 20px;
  margin-bottom: 12px;
`;
const Title = styled.p`
  font-size: 1.2rem;
  font-family: "Poppins", sans-serif;
  font-weight: bold;
  padding-left: 30px;
  flex: 1;
`;

const Item = styled.div`
  padding: 0px 25px;
  margin-bottom: 12px;
`;
const Subtitle = styled.p`
  font-weight: bold;
`;
const Value = styled.p``;
