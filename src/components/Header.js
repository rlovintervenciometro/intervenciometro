import React from "react";
import styled from "styled-components";
import { IconButton } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import Avatar from "./Avatar";
import { auth } from "../../firebase";
import AddNewCourseButton from "./AddNewCourseButton";
import HeaderTab from "./HeaderTab";

export default function Header() {
  const router = useRouter();
  const userInfo = useSelector(state => state.user.userInfo);
  const { courseId } = router.query;

  const tabs = [
    {
      label: "Alumnos",
      path: "students",
    },
    {
      label: "Participaciones",
      path: "participations",
    },
  ];

  return (
    <Container>
      {/*  <IconButton>
        <MenuIcon fontSize="large" />
      </IconButton> */}
      <Title onClick={() => router.push("/")}>Tu lista de cursos</Title>
      {/* {courseId != null && courseId != undefined && (
        <TabsContainer>
          {tabs.map((item, index) => (
            <HeaderTab key={index} item={item} />
          ))}
        </TabsContainer>
      )} */}
      <RightContainer>
        {/* <SearchBarContainer>
          <SearchIcon style={{ color: "#C1C1C1" }} />
          <Input placeholder="Buscar cursos" />
        </SearchBarContainer> */}
        {userInfo?.role == "teacher" && <AddNewCourseButton />}
        <Avatar />
      </RightContainer>
    </Container>
  );
}

const Container = styled.header`
  position: sticky;
  top: 0px;
  z-index: 1000;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: white;
  justify-content: space-between;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  height: 70px;
  padding-left: 1%;
  padding-right: 2%;
`;

const Title = styled.p`
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
`;

const RightContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
`;
const SearchBarContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 20px;
  background: rgba(230, 230, 230, 1);
  border-radius: 10px;
  padding-left: 15px;
  height: 40px;
  width: 40%;
`;
const Input = styled.input`
  border: none;
  outline: none;
  padding-right: 20px;
  background-color: transparent;
  margin-left: 10px;
  font-size: 0.9rem;
  flex: 1;
  color: black;
  ::placeholder {
    color: #94a0ad;
  }
`;

const TabsContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;
