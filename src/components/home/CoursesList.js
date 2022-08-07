import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Image from "next/image";
import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { useDispatch, useSelector } from "react-redux";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { HashLoader } from "react-spinners";
import { auth, db } from "../../../firebase";
import withoutCoursesImage from "../../../public/images/withoutCourses.png";
import colors from "../../utils/colors";
import { toggleOpenNewCourseModal } from "../../context/reducers/appSlice";
import CourseItem from "./CourseItem";

const useStyles = makeStyles(theme => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

export default function CoursesList() {
  const userInfo = useSelector(state => state.user.userInfo);
  const dispatch = useDispatch();
  const classes = useStyles();
  const [courses, setCourses] = useState(null);
  const user = auth.currentUser;
  const isMounted = useRef(false);
  const coursesRef = collection(
    db,
    "organizations",
    userInfo?.organizationId,
    "courses",
  );

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const q = query(coursesRef, orderBy("name", "asc"));

    const suscriber = onSnapshot(q, snapshot => {
      if (!snapshot.empty) {
        const tempArray = [];
        snapshot.forEach(doc => {
          const object = doc.data();
          object.id = doc.id;
          tempArray.push(object);
        });
        if (isMounted.current) {
          setCourses(tempArray);
        }
      } else if (isMounted.current) {
        setCourses([]);
      }
    });
    return () => {
      suscriber();
    };
  }, []);

  const getMessage = () => {
    if (userInfo != null) {
      if (userInfo?.role == "teacher") {
        return "Ups, todavía no has registrado ningún curso";
      }
      return "Ups, no te encuentras registrado en ningún curso";
    }
    return "";
  };

  const openAddCourseModal = () => {
    dispatch(
      toggleOpenNewCourseModal({
        openNewCourseModal: true,
      }),
    );
  };

  return (
    <Container>
      {!courses ? (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}>
          <HashLoader color={colors?.MAIN_COLOR} size={70} />
        </div>
      ) : courses?.length == 0 ? (
        <>
          <ImageContainer>
            <Image
              src={withoutCoursesImage}
              layout="fill"
              objectFit="contain"
            />
          </ImageContainer>
          <Message>{getMessage()}</Message>
          {userInfo?.role == "teacher" && (
            <CustomFab variant="extended" onClick={openAddCourseModal}>
              <AddIcon fontSize="large" style={{ color: "white" }} />
              <FabText>Nuevo curso</FabText>
            </CustomFab>
          )}
        </>
      ) : (
        <ListContainer>
          {courses?.map((item, index) => (
            <CourseItem course={item} key={`${item.id}_${index}`} />
          ))}
        </ListContainer>
      )}
    </Container>
  );
}

const Container = styled.div`
  height: calc(100vh - 70px);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ImageContainer = styled.div`
  position: relative;
  height: 450px;
  width: 500px;
  margin-bottom: 30px;
  margin-top: 40px;
`;

const Message = styled.p`
  font-size: 1.3rem;
  font-weight: 500;
`;

const CustomFab = styled(Fab)`
  &&& {
    position: absolute;
    background-color: ${colors.MAIN_COLOR};
    padding-left: 25px;
    padding-right: 25px;
    height: 60px;
    right: 60px;
    bottom: 50px;
  }
`;

const FabText = styled.p`
  text-transform: none;
  font-size: 1.1rem;
  margin-left: 10px;
  font-family: "Poppins", sans-serif;
  color: white;
`;

const ListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  width: 100%;
  padding: 20px 2%;
  grid-gap: 14px;
  grid-row-gap: 20px;
`;
