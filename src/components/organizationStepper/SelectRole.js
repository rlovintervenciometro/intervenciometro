import React from "react";
import styled from "styled-components";
import Radio from "@material-ui/core/Radio";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import colors from "../../utils/colors";

export default function SelectRole({
  role,
  setRole,
  setActiveStep,
  setCode,
  code,
}) {
  const changeRole = value => setRole(value);

  const onClickNext = () => {
    if (role == "student") {
      if (code != "") {
        setActiveStep(prevStep => prevStep + 1);
      }
    } else {
      setActiveStep(prevStep => prevStep + 1);
    }
  };

  return (
    <Container>
      <RadioGroup>
        <Item onClick={() => changeRole("teacher")}>
          <Radio
            checked={role === "teacher"}
            value="teacher"
            onChange={() => changeRole("teacher")}
            color="black"
          />
          <RadioText>Profesor</RadioText>
        </Item>
        <Item onClick={() => changeRole("student")}>
          <Radio
            checked={role === "student"}
            value="student"
            onChange={() => changeRole("student")}
            color="black"
          />
          <RadioText>Estudiante</RadioText>
        </Item>
      </RadioGroup>
      {role == "student" && (
        <TextField
          style={{
            width: "350px",
          }}
          value={code}
          placeholder="Escribe tu código de estudiante aquí..."
          variant="outlined"
          onChange={e => {
            setCode(e.target.value);
          }}
        />
      )}
      <ButtonsContainer>
        <CustomButton
          isDisabled={role == "student" && code == ""}
          disabled={role == "student" && code == ""}
          onClick={onClickNext}>
          <ButtonText>Siguiente</ButtonText>
        </CustomButton>
      </ButtonsContainer>
    </Container>
  );
}

const Container = styled.div``;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

const Item = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-right: 15px;
  cursor: pointer;
`;
const RadioText = styled.p``;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-top: 10px;
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
