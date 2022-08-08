import RingLoader from "react-spinners/HashLoader";
import Backdrop from "@material-ui/core/Backdrop";
import { useDispatch, useSelector } from "react-redux";
import CoursesList from "../components/home/CoursesList";
import colors from "../utils/colors";

export default function Home() {
  const userInfo = useSelector(state => state.user.userInfo);

  if (userInfo == null) {
    return (
      <Backdrop
        open
        style={{ zIndex: 1000, backgroundColor: "rgba(0,0,0,0.8)" }}>
        <RingLoader color={colors.MAIN_COLOR} size={70} />
      </Backdrop>
    );
  }

  return <CoursesList />;
}
