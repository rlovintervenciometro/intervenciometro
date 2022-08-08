import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import Close from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import ArrowBack from "@material-ui/icons/ArrowBack";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { useDispatch, useSelector } from "react-redux";
import { FaUserGraduate } from "react-icons/fa";
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
import { ClipLoader } from "react-spinners";
import { useRouter } from "next/router";
import moment from "moment";
import uuid from "random-uuid-v4";
import { auth, db } from "../../firebase";
import {
  toggleOpenNewCourseModal,
  toggleOpenNewParticipationModal,
  toggleOpenNewStudentsModal,
} from "../context/reducers/appSlice";
import colors from "../utils/colors";
import StudentItem from "./coursePage/StudentItem";
import NewParticipationForm from "./NewParticipationForm";

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const posibleWidth = ["xs", "sm", "md", "lg", "xl"];

export default function NewParticipationModal() {
  const router = useRouter();
  const openNewParticipationModal = useSelector(
    state => state.app.openNewParticipationModal,
  );
  const dispatch = useDispatch();
  const user = auth.currentUser;
  const userInfo = useSelector(state => state.user.userInfo);
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState(posibleWidth[2]);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState({});
  const [step, setStep] = useState(1);
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const [showErrorSnackbar, setShowErrorSnackbar] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState(null);
  const { courseId } = router.query;
  const [formData, setFormData] = useState({
    subject: "",
    score: "excellent",
    comment: "",
  });

  useEffect(() => {
    if (
      userInfo != null &&
      user != null &&
      courseId != undefined &&
      courseId != null
    ) {
      const studentsReference = collection(
        db,
        "organizations",
        userInfo?.organizationId,
        "courses",
        courseId,
        "students",
      );

      const q = query(studentsReference, orderBy("name", "asc"));

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
    }
  }, []);

  const closeModal = () => {
    dispatch(
      toggleOpenNewParticipationModal({
        openNewParticipationModal: false,
      }),
    );
    setStep(1);
  };

  const saveParticipation = async () => {
    if (selectedStudent != null) {
      setLoading(true);

      const batch = writeBatch(db);

      const participationReference = doc(
        collection(
          db,
          "organizations",
          userInfo?.organizationId,
          "courses",
          courseId,
          "participations",
        ),
      );

      batch.set(participationReference, {
        teacherId: user?.uid,
        studentId: selectedStudent?.userId,
        subject: formData?.subject?.trim(),
        score: formData?.score,
        comment: formData?.comment?.trim(),
        createAt: new Date(),
        createAtMoment: moment().format("LLL"),
        identifier: `participación-${uuid()}`,
        studentCode: selectedStudent?.code,
        studentName: selectedStudent?.name,
        studentEmail: selectedStudent?.email,
      });

      await batch
        .commit()
        .then(() => {
          closeModal();
          setShowSuccessSnackbar(true);
          setLoading(false);
        })
        .catch(err => {
          setLoading(false);
          setShowErrorSnackbar(true);
        });
    }
  };

  return (
    <>
      <Dialog
        open={openNewParticipationModal}
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        scroll="paper"
        onClose={closeModal}
        keepMounted
        TransitionComponent={Transition}>
        {step == 1 ? (
          <Step1
            students={students}
            closeModal={closeModal}
            selectedStudent={selectedStudent}
            setSelectedStudent={setSelectedStudent}
            setStep={setStep}
          />
        ) : step == 2 ? (
          <SelectedStudentComponent
            setStep={setStep}
            closeModal={closeModal}
            selectedStudent={selectedStudent}
            setSelectedStudent={setSelectedStudent}
          />
        ) : (
          <NewParticipationForm
            selectedStudent={selectedStudent}
            setStep={setStep}
            formData={formData}
            setFormData={setFormData}
            saveParticipation={saveParticipation}
            loading={loading}
            setLoading={setLoading}
          />
        )}
      </Dialog>
      <Snackbar
        open={showSuccessSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSuccessSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        key={"bottom" + "center"}>
        <Alert onClose={() => setShowSuccessSnackbar(false)} severity="success">
          Participación creada correctamente
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

function Step1({
  closeModal,
  students,
  selectedStudent,
  setSelectedStudent,
  setStep,
}) {
  return (
    <Container>
      <Header>
        <TitleContainer>
          <Title>Alumnos de este curso</Title>
          <Subtitle>Selecciona el alumno que participará</Subtitle>
        </TitleContainer>
        <IconButton onClick={closeModal}>
          <Close fontSize="large" />
        </IconButton>
      </Header>
      <ListContainer>
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
              type="new-participation"
              selectedStudent={selectedStudent}
              setSelectedStudent={setSelectedStudent}
              setStep={setStep}
            />
          ))
        )}
      </ListContainer>
    </Container>
  );
}

function SelectedStudentComponent({ closeModal, selectedStudent, setStep }) {
  return (
    <Container>
      <Header style={{ padding: "10px 20px" }}>
        <IconButton
          onClick={() => {
            setStep(1);
          }}>
          <ArrowBack fontSize="large" />
        </IconButton>
        <Title style={{ flex: 1 }}>Alumnos seleccionado</Title>
        <IconButton onClick={closeModal}>
          <Close fontSize="large" />
        </IconButton>
      </Header>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
        <FaUserGraduate size={120} />
        <Name>{selectedStudent?.name}</Name>
        <Code>{selectedStudent?.code}</Code>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          marginRight: "20px",
          marginBottom: "20px",
          marginTop: "12px",
        }}>
        <Button
          onClick={() => setStep(3)}
          style={{ backgroundColor: "#00a680", padding: "10px 25px" }}>
          <p style={{ textTransform: "none", color: "white" }}>Siguiente</p>
        </Button>
      </div>
    </Container>
  );
}

const Container = styled.div``;
const Header = styled.header`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-right: 20px;
`;

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

const ListContainer = styled.div``;

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

const Name = styled.p`
  margin-top: 20px;
  font-family: "Poppins", sans-serif;
  font-size: 1.6rem;
  font-weight: bold;
`;
const Code = styled.p`
  margin-top: 5px;
  font-family: "Poppins", sans-serif;
  font-size: 1.2rem;
  font-weight: 400;
  margin-bottom: 12px;
`;
