import React from "react";
import Radio from "@material-ui/core/Radio";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import ArrowBack from "@material-ui/icons/ArrowBack";
import styled from "styled-components";
import { capitalize } from "lodash";
import { ClipLoader } from "react-spinners";
import scores from "../utils/scores";
import colors from "../utils/colors";

export default function NewParticipationForm({
  setStep,
  selectedStudent,
  formData,
  setFormData,
  saveParticipation,
  loading,
  setLoading,
}) {

  console.log("formData: ",formData)

  const changeScore = value => {
    console.log("value: ",value)
    setFormData({
      ...formData,
      score: value,
    });
  };

  return (
    <Container>
      <Header>
        <IconButton
          onClick={() => {
            if (!loading) {
              setStep(2);
            }
          }}>
          <ArrowBack fontSize="large" />
        </IconButton>
        <TitleContainer>
          <Name>{capitalize(selectedStudent?.name)}</Name>
          <Code>{selectedStudent?.code}</Code>
        </TitleContainer>
      </Header>
      <Item>
        <Subtitle>Pregunta</Subtitle>
        <TextField
          placeholder="Escribe aquí la pregunta..."
          style={{ width: "100%" }}
          value={formData?.subject}
          variant="outlined"
          onChange={e =>
            setFormData({
              ...formData,
              subject: e.target.value,
            })
          }
        />
      </Item>
      <Item>
        <Subtitle>Calificaciones</Subtitle>
        <RadiosContainer>
          {scores?.map((item, index) => (
            <div
              key={`${item.value}_${index}`}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginRight: "5px",
              }}>
              <Radio
                checked={formData?.score === item?.value}
                value={item.value}
                onChange={() => changeScore(item?.value)}
                color="black"
              />
              <RadioText>{item.label}</RadioText>
            </div>
          ))}
        </RadiosContainer>
      </Item>
      <Item>
        <Subtitle>Comentarios</Subtitle>
        <TextField
          placeholder="Escribe tus comentarios"
          style={{ width: "100%" }}
          value={formData?.comment}
          variant="outlined"
          onChange={e =>
            setFormData({
              ...formData,
              comment: e.target.value,
            })
          }
        />
      </Item>

      <Footer>
        <CustomButton onClick={saveParticipation}>
          {loading ? (
            <ClipLoader color="white" />
          ) : (
            <ButtonText>Guardar</ButtonText>
          )}
        </CustomButton>
      </Footer>
    </Container>
  );
}

const Container = styled.div``;

const Header = styled.header`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-right: 20px;
  border-bottom: 1px solid #c1c1c1;
`;

const Item = styled.div`
  padding: 8px 20px;
  margin-top: 10px;
`;

const TitleContainer = styled.div`
  flex: 1;
  padding-top: 20px;
  padding-left: 20px;
`;

const Name = styled.p`
  font-family: "Poppins", sans-serif;
  font-size: 1.1rem;
  font-weight: bold;
`;

const Subtitle = styled.p`
  font-family: "Poppins", sans-serif;
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 5px;
`;

const RadiosContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
`;

const RadioText = styled.p``;

const Code = styled.p`
  margin-top: 1px;
  font-family: "Poppins", sans-serif;
  font-size: 0.9rem;
  font-weight: 400;
`;

const Footer = styled.footer`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;

  margin-right: 20px;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const CustomButton = styled(Button)`
  &&& {
    background-color: ${props =>
      props.isDisabled ? "#c1c1c1" : colors.MAIN_COLOR};
    padding-left: 25px;
    padding-right: 25px;
  }
`;

const ButtonText = styled.p`
  color: white;
  text-transform: none;
  font-family: "Poppins", sans-serif;
  font-size: 1.2rem;
`;
