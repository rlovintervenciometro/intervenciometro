import React from "react";
import styled from "styled-components";
import AddIcon from "@material-ui/icons/Add";
import { useDispatch } from "react-redux";
import colors from "../utils/colors";
import { toggleOpenNewCourseModal } from "../context/reducers/appSlice";

export default function AddNewCourseButton() {
  const dispatch = useDispatch();

  const openModal = () => {
    dispatch(
      toggleOpenNewCourseModal({
        openNewCourseModal: true,
      }),
    );
  };

  return (
    <Container onClick={openModal}>
      <AddIcon style={{ color: "white" }} />
      <Text>Nuevo curso</Text>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${colors.MAIN_COLOR};
  margin-right: 15px;
  height: 40px;
  padding-left: 17px;
  padding-right: 17px;
  border-radius: 12px;
  cursor: pointer;
`;
const Text = styled.p`
  color: white;
  font-weight: 500;
  font-size: 0.9rem;
`;
