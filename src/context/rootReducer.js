import { combineReducers } from "redux";
import appReducer from "./reducers/appSlice";
import userReducer from "./reducers/userInfo";

const rootReducer = combineReducers({
  app: appReducer,
  user: userReducer,
});

export default rootReducer;
