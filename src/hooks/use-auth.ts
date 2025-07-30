import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../state/store";
import axiosInstance from "../api/axios-instance";
import { loginSuccess, logout } from "../state/slice/auth-slice";
import { LoginCredentials } from "../config/types";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
  const dispatch: AppDispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const login = async ({ username, password }: LoginCredentials) => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        username,
        password,
      });
      const { token } = response.data;
      dispatch(loginSuccess(token));
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  const getDataFromToken = (token: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const decoded: any = jwtDecode(token);
      return decoded;
    } catch (error) {
      console.error("Invalid token", error);
      return null;
    }
  };

  return { isAuthenticated, login, logoutUser, getDataFromToken };
};

export default useAuth;
