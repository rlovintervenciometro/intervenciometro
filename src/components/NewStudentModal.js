import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Image from "next/image";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import Close from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { useDispatch, useSelector } from "react-redux";
import {
  addDoc,
  collection,
  doc,
  increment,
  onSnapshot,
  orderBy,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { ClipLoader } from "react-spinners";
import colors from "../utils/colors";
import { auth, db } from "../../firebase";
import { toggleOpenNewStudentsModal } from "../context/reducers/appSlice";
import StudentItem from "./coursePage/StudentItem";

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const posibleWidth = ["xs", "sm", "md", "lg", "xl"];

export default function NewStudentModal() {
  const router = useRouter();
  const openNewStudentsModal = useSelector(
    state => state.app.openNewStudentsModal,
  );
  const user = auth.currentUser;
  const userInfo = useSelector(state => state.user.userInfo);
  const [students, setStudents] = useState(null);
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState(posibleWidth[2]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const [showErrorSnackbar, setShowErrorSnackbar] = useState(false);
  const { courseId } = router.query;
  const dispatch = useDispatch();

  useEffect(() => {
    const usersReference = collection(db, "users");

    const q = query(
      usersReference,
      where("organizationId", "==", userInfo?.organizationId),
      where("role", "==", "student"),
      orderBy("name", "asc"),
    );

    const suscriber = onSnapshot(q, snapshot => {
      if (!snapshot.empty) {
        const tempArray = [];
        snapshot.forEach(doc => {
          const object = doc.data();
          object.id = doc.id;
          tempArray.push(object);
        });
        setStudents(tempArray);
      } else {
        setStudents([]);
      }
    });

    return () => {
      suscriber();
    };
  }, []);

  const closeModal = () => {
    dispatch(
      toggleOpenNewStudentsModal({
        openNewStudentsModal: false,
      }),
    );
    setSelectedStudent(null);
  };

  const confirmRegister = async () => {
    if (selectedStudent != null) {
      setLoading(true);

      const batch = writeBatch(db);

      const userRcourseDoc = doc(collection(db, "users-courses"));

      batch.set(userRcourseDoc, {
        userId: selectedStudent?.userId,
        courseId,
        teacherId: user?.uid,
      });

      const studentReference = doc(
        collection(
          db,
          "organizations",
          userInfo?.organizationId,
          "courses",
          courseId,
          "students",
        ),
      );

      batch.set(studentReference, selectedStudent);

      const courseRef = doc(
        db,
        "organizations",
        userInfo?.organizationId,
        "courses",
        courseId,
      );

      batch.update(courseRef, {
        studentsQuantity: increment(1),
      });

      await batch
        .commit()
        .then(() => {
          closeModal();
          setShowSuccessSnackbar(true);
          setLoading(false);
        })
        .catch(err => {
          console.log("Err");
          setLoading(false);
          setShowErrorSnackbar(true);
        });
    }
  };

  return (
    <>
      <Dialog
        open={openNewStudentsModal}
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        scroll="paper"
        onClose={closeModal}
        keepMounted
        TransitionComponent={Transition}>
        <Container>
          <Header>
            <TitleContainer>
              <Title>Alumnos de tu organización</Title>
              <Subtitle>
                Selecciona un alumno para agregarlo a este curso
              </Subtitle>
            </TitleContainer>
            <IconButton onClick={closeModal}>
              <Close fontSize="large" />
            </IconButton>
          </Header>

          {selectedStudent != null && (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",
              }}>
              <p style={{ marginRight: "15px" }}>
                Alumno seleccionado:{" "}
                <span style={{ fontWeight: "bold" }}>
                  {selectedStudent?.name}
                </span>
              </p>
              <Button
                onClick={confirmRegister}
                disabled={loading}
                style={{
                  backgroundColor: colors.MAIN_COLOR,
                  marginRight: "20px",
                  padding: "10px 20px",
                }}>
                {loading ? (
                  <ClipLoader color="white" size={20} />
                ) : (
                  <p
                    style={{
                      textTransform: "none",
                      color: "white",
                      fontFamily: "Poppins",
                    }}>
                    Confirmar
                  </p>
                )}
              </Button>
            </div>
          )}

          {students == null ? (
            <LoaderContainer>
              <ClipLoader />
            </LoaderContainer>
          ) : students?.length == 0 ? (
            <Message>No se encontró ningún alumno en tu organización</Message>
          ) : (
            students?.map((item, index) => (
              <StudentItem
                key={`${item.id}_${index}`}
                student={item}
                type="new-student"
                selectedStudent={selectedStudent}
                setSelectedStudent={setSelectedStudent}
              />
            ))
          )}
          <ListContainer />
        </Container>
      </Dialog>
      <Snackbar
        open={showSuccessSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSuccessSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        key={"bottom" + "center"}>
        <Alert onClose={() => setShowSuccessSnackbar(false)} severity="success">
          Alumno agregado creado correctamente
        </Alert>
      </Snackbar>
      <Snackbar
        open={showErrorSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowErrorSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        key={"bottom" + "center"}>
        <Alert onClose={() => setShowErrorSnackbar(false)} severity="error">
          Ocurrió un error, inténtalo de nuevo
        </Alert>
      </Snackbar>
    </>
  );
}

const Container = styled.div``;
const Header = styled.header`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-right: 20px;
`;

const ListContainer = styled.div``;

const TitleContainer = styled.div`
  flex: 1;
  padding-top: 20px;
  padding-left: 20px;
`;
const Title = styled.p`
  font-size: 1.3rem;
  font-weight: bold;
`;
const Subtitle = styled.p`
  font-size: 1rem;
  font-weight: 400;
  margin-top: 10px;
  margin-bottom: 15px;
`;

const LoaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
  margin-bottom: 30px;
`;

const Message = styled.p`
  text-align: center;
  font-size: 0.8rem;
  margin-top: 20px;
  margin-bottom: 20px;
  padding: 0px 20px;
`;
