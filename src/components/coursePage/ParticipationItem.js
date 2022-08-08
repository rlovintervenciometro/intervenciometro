import { capitalize } from "lodash";
import React from "react";
import styled from "styled-components";
import moment from "moment";
import scores from "../../utils/scores";

export default function ParticipationItem({ participation }) {
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

  return (
    <Container>
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
    </Container>
  );
}

const Container = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 15px 20px;
  padding-right: 35px;
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
const RightContainer = styled.div``;
const DateText = styled.p`
  font-size: 0.9rem;
  color: grey;
`;
const Score = styled.p``;
const HourText = styled.p``;
