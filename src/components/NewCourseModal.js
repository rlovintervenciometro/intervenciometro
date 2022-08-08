import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Image from "next/image";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import Close from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { useDispatch, useSelector } from "react-redux";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { ClipLoader } from "react-spinners";
import { addDoc, collection } from "firebase/firestore";
import { useRouter } from "next/router";
import { auth, db } from "../../firebase";
import { toggleOpenNewCourseModal } from "../context/reducers/appSlice";
import colors from "../utils/colors";

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const posibleWidth = ["xs", "sm", "md", "lg", "xl"];

export default function NewCourseModal() {
  const router = useRouter();
  const openNewCourseModal = useSelector(state => state.app.openNewCourseModal);
  const userInfo = useSelector(state => state.user.userInfo);
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState(posibleWidth[2]);
  const [selectedCycle, setSelectedCycle] = useState(10);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    cycle: 10,
  });
  const [selectedImageURL, setSelectedImageURL] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const [showErrorSnackbar, setShowErrorSnackbar] = useState(false);
  const user = auth.currentUser;
  const fileInput = useRef(null);
  const dispatch = useDispatch();

  const closeModal = () => {
    dispatch(
      toggleOpenNewCourseModal({
        openNewCourseModal: false,
      }),
    );
  };

  const cycles = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const handleCycle = e => setSelectedCycle(e.target.value);

  const registerCourse = async () => {
    const errors = {};
    if (formData?.name == "" || formData?.code == "") {
      if (formData?.name == "") {
        errors.name = true;
        errors.nameMessage = "El nombre es obligatorio";
      }
      if (formData?.code == "") {
        errors.code = true;
        errors.codeMessage = "El código del curso es obligatorio";
      }
    } else if (userInfo != null) {
      setLoading(true);
      const coursesReference = collection(
        db,
        "organizations",
        userInfo?.organizationId,
        "courses",
      );

      const payload = {
        ownerId: user?.uid,
        name: formData?.name?.toLowerCase()?.trim(),
        code: formData?.code?.trim(),
        cycle: formData?.cycle,
        studentsQuantity: 0,
      };

      await addDoc(coursesReference, payload)
        .then(res => {
          router.push("/");
          setShowSuccessSnackbar(true);
          setLoading(false);
          closeModal();
          setFormData({
            name: "",
            code: "",
            cycle: 10,
          });
        })
        .catch(err => {
          setShowErrorSnackbar(true);
          setLoading(false);
          /* console.log("Ocurrió un error bro: ", err); */
        });
    }
    setFormError(errors);
  };

  const handleFileInput = e => {
    const errors = {};
    const file = e.target.files[0];
    if (file.size > 1048576 * 5) {
      errors.image = true;
      errors.imageMessage = "La imagen no puede exceder 5MB";
    } else {
      setSelectedImageURL(URL.createObjectURL(file));
      setSelectedFile(file);
      setFormError({});
    }
    setFormError(errors);
  };

  const selectImage = e => {
    if (fileInput.current) {
      fileInput.current?.click();
    }
  };

  return (
    <>
      <CustomDialog
        open={openNewCourseModal}
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        scroll="paper"
        onClose={closeModal}
        TransitionComponent={Transition}>
        <Container>
          <Header>
            <Title style={{ flex: 1 }}>Registrar curso</Title>
            <IconButton onClick={closeModal}>
              <Close fontSize="large" />
            </IconButton>
          </Header>
          <Divider
            style={{
              backgroundColor: "#c1c1c1",
              height: "3px",
            }}
          />
          <FormsContainer>
            <LeftForms>
              <ItemContainer style={{ width: "100%" }}>
                <Subtitle>Nombre*</Subtitle>
                <TextField
                  inputProps={{ maxLength: 60 }}
                  value={formData?.name}
                  style={{ width: "100%" }}
                  variant="outlined"
                  placeholder="Nombre del curso"
                  onChange={e => {
                    setFormError({});
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    });
                  }}
                />
                {formError?.name && (
                  <ErrorText style={{ textAlign: "left" }}>
                    {formError?.nameMessage}
                  </ErrorText>
                )}
              </ItemContainer>
              <LeftFormsFooter>
                <ItemContainer style={{ flex: 1, marginRight: "20px" }}>
                  <Subtitle>Código*</Subtitle>
                  <TextField
                    inputProps={{ maxLength: 12 }}
                    value={formData?.code}
                    style={{ width: "100%" }}
                    variant="outlined"
                    placeholder="Código del curso"
                    onChange={e => {
                      setFormError({});
                      setFormData({
                        ...formData,
                        code: e.target.value,
                      });
                    }}
                  />
                  {formError?.code && (
                    <ErrorText style={{ textAlign: "left" }}>
                      {formError?.codeMessage}
                    </ErrorText>
                  )}
                </ItemContainer>
                <ItemContainer>
                  <Subtitle>Ciclo*</Subtitle>
                  <Select
                    style={{
                      width: "120px",
                    }}
                    variant="outlined"
                    value={selectedCycle}
                    onChange={handleCycle}>
                    {cycles.map(item => (
                      <MenuItem value={item}>{item}</MenuItem>
                    ))}
                  </Select>
                </ItemContainer>
              </LeftFormsFooter>
            </LeftForms>
            {/* <RightForms>
            <UploadImageButton onClick={selectImage}>
              {selectedImageURL ? (
                <Image src={selectedImageURL} layout="fill" />
              ) : (
                <>
                  <CloudUploadIcon style={{ fontSize: "4rem" }} />
                  <Text>Sube una imagen</Text>
                </>
              )}
            </UploadImageButton>
            {formError?.image && (
              <ErrorText style={{ textAlign: "left" }}>
                {formError?.imageMessage}
              </ErrorText>
            )}
            <form>
              <input
                style={{ display: "none" }}
                ref={fileInput}
                type="file"
                onChange={handleFileInput}
              />
            </form>
          </RightForms> */}
          </FormsContainer>

          <Footer>
            <CustomButton disabled={loading} onClick={registerCourse}>
              {loading ? (
                <ClipLoader size={30} color="white" />
              ) : (
                <ButtonText>Confirmar</ButtonText>
              )}
            </CustomButton>
          </Footer>
        </Container>
      </CustomDialog>
      <Snackbar
        open={showSuccessSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSuccessSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        key={"bottom" + "center"}>
        <Alert onClose={() => setShowSuccessSnackbar(false)} severity="success">
          Curso creado correctamente
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

const CustomDialog = styled(Dialog)``;
const Container = styled.div``;
const Header = styled.header`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-right: 20px;
`;
const Title = styled.p`
  font-size: 1.5rem;
  font-family: "Poppins", sans-serif;
  font-weight: bold;
  padding-left: 40px;
  padding-top: 30px;
  margin-bottom: 20px;
`;

const FormsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  padding-left: 40px;
  padding-right: 30px;
  padding-top: 20px;
  padding-bottom: 30px;
`;
const LeftForms = styled.div`
  flex: 1;
  margin-right: 20px;
`;
const ItemContainer = styled.div``;
const Subtitle = styled.p`
  margin-bottom: 10px;
`;
const LeftFormsFooter = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 20px;
`;
const RightForms = styled.div``;
const UploadImageButton = styled.div`
  position: relative;
  width: 200px;
  height: 180px;
  border-radius: 10px;
  border: 1px solid #c1c1c1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  padding-bottom: 20px;
  padding-left: 15px;
  padding-right: 15px;
  cursor: pointer;
`;
const Text = styled.p`
  font-size: 0.9rem;
  text-align: center;
`;
const Footer = styled.footer`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding-right: 20px;
  margin-bottom: 20px;
`;
const CustomButton = styled(Button)`
  &&& {
    background-color: ${colors.MAIN_COLOR};
    padding-left: 20px;
    padding-right: 20px;
    width: 130px;
  }
`;
const ButtonText = styled.p`
  text-transform: none;
  color: white;
  font-family: "Poppins", sans-serif;
  font-size: 1.1rem;
`;

const ErrorText = styled.p`
  font-size: 0.9rem;
  color: red;
  margin-top: 10px;
`;
