import React from "react";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import colors from "../../utils/colors";

export default function UserInformation({
  displayName,
  setDisplayName,
  setActiveStep,
}) {
  const onClickPrev = () => {
    setActiveStep(prevStep => prevStep - 1);
  };

  const onClickNext = () => {
    setActiveStep(prevStep => prevStep + 1);
  };

  return (
    <Container>
      <TextField
        variant="outlined"
        placeholder="Escribe tu nombre aquí..."
        style={{
          width: "35vw",
          outline: "none",
        }}
        value={displayName}
        onChange={e => setDisplayName(e.target.value)}
      />
      <ButtonsContainer>
        <CustomButton
          style={{ backgroundColor: "transparent" }}
          onClick={onClickPrev}>
          <ButtonText style={{ color: "black" }}>Atrás</ButtonText>
        </CustomButton>
        <CustomButton
          isDisabled={displayName == ""}
          disabled={displayName == ""}
          onClick={onClickNext}>
          <ButtonText>Siguiente</ButtonText>
        </CustomButton>
      </ButtonsContainer>
    </Container>
  );
}

const Container = styled.div`
  padding-top: 10px;
`;

const ButtonsContainer = styled.div`
  margin-top: 25px;
`;

const CustomButton = styled(Button)`
  &&& {
    background-color: ${props =>
      props.isDisabled ? "#c1c1c1" : colors.MAIN_COLOR};
    padding-left: 15px;
    padding-right: 15px;
    margin-right: 20px;
  }
`;

const ButtonText = styled.p`
  color: white;
  text-transform: none;
  font-family: "Poppins", sans-serif;
`;
