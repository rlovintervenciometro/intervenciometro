import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

export default function HeaderTab({ item, setView }) {
  const router = useRouter();
  const { courseId } = router.query;

  const onClick = () => {
    setView(item?.path);
  };

  return (
    <Container onClick={onClick}>
      <Text>{item?.label}</Text>
    </Container>
  );
}

const Container = styled.a`
  cursor: pointer;
`;

const Text = styled.p``;
