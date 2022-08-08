import React from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import styled from "styled-components";
import ChevronRight from "@material-ui/icons/ChevronRight";
import { capitalize } from "lodash";

export default function StudentItem({
  student,
  type,
  setSelectedStudent,
  selectedStudent,
}) {
  const router = useRouter();
  const userInfo = useSelector(state => state.user.userInfo);

  const { courseId } = router.query;

  const onClick = () => {
    if (type == "new-student" && courseId != undefined) {
      setSelectedStudent(student);
    }
  };

  const getName = () => (student?.name ? capitalize(student?.name) : "");

  const getCode = () => student?.code || "";

  return (
    <Container onClick={onClick}>
      <InfoContainer>
        <Name>{getName()}</Name>
        <Code>{getCode()}</Code>
      </InfoContainer>
      {type != "list" && <ChevronRight />}
    </Container>
  );
}

const Container = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 10px 20px;
  padding-right: 35px;
  border-bottom: 1px solid #c1c1c1;

  :hover {
    background-color: rgba(155, 155, 155, 0.3);
  }
`;

const InfoContainer = styled.div`
  flex: 1;
`;
const Name = styled.p`
  font-family: "Poppins", sans-serif;
  font-weight: bold;
  font-size: 1.1rem;
`;
const Code = styled.p`
  font-family: "Poppins", sans-serif;
  font-weight: 500;
  font-size: 0.9rem;
`;
