import { Fragment, useEffect } from "react";
import { useSelector } from "react-redux";
import EmptyChatState from '../components/EmptyChatState';
import Sidemenu from '../components/Sidemenu';
import TopHeader from "../components/TopHeader";
import constant from "../constant/constant";
import socket from "../socket";
import { getDataFromLocalStorage } from "../utility";

const MainLayout = ({ children }) => {
  const { selectedRoom } = useSelector(state => state.user);

  useEffect(() => {
    const token = getDataFromLocalStorage(constant.AUTHTHOKEN);

    socket.auth = { token };

    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  return <Fragment>
    <TopHeader />
    <div class="container-fluid main-wrapper">
      <div class="row h-100">
        <Sidemenu />
        {selectedRoom ? children : <EmptyChatState />}
      </div>
    </div>

  </Fragment>
};

export default MainLayout;
