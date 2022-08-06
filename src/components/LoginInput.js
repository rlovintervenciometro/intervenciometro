import React, { useState, useEffect } from "react";
import { IconButton } from "@material-ui/core";
import styled from "styled-components";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";

export default function LoginInput({
  icon = null,
  placeholder = "",
  type = "text",
  content,
  setContent,
}) {
  const [auxType, setAuxType] = useState(type);
  const [auxIcon, setAuxIcon] = useState(icon);

  useEffect(() => {
    if (type === "password") {
      auxType == "text"
        ? setAuxIcon(<VisibilityIcon />)
        : setAuxIcon(<VisibilityOffIcon />);
    }
  }, [auxType]);

  const onClickIcon = () => {
    if (type == "password") {
      auxType == "text" ? setAuxType("password") : setAuxType("text");
    }
  };

  return (
    <Container>
      <Input
        value={content}
        placeholder={placeholder}
        type={auxType}
        onChange={e => setContent(e.target.value)}
      />
      {auxIcon && <IconButton onClick={onClickIcon}>{auxIcon}</IconButton>}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  border: 2px solid #c1c1c1;
  border-radius: 8px;
  flex-direction: row;
  padding-left: 15px;
`;

const Input = styled.input`
  flex: 1;
  border: none;
  font-size: 1.1rem;
  outline: none;

  &::placeholder {
    color: #c1c1c1;
    font-style: normal;
    font-weight: 400;
  }
`;
