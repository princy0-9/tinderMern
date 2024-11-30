import { Outlet, useNavigate } from "react-router-dom";
import Footer from "./Footer";

import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { addUser } from "../utils/userSlice";
import NavBar from "./NavBar";
import { BASE_URL } from "../utils/constants";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user);

  const fetchUser = async () => {
    if (userData) return;
    try {
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });
      dispatch(addUser(res.data));
    } catch (err) {
      if (err.status === 401) {
        navigate("/signin");
      }
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div>
      <NavBar />
      <Outlet />
      <Footer/>
    </div>
  );
};
export default Body;
