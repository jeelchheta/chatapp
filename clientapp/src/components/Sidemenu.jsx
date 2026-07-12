import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import constant, { UserStatus } from "../constant/constant.js";
import { Avatar } from "../constant/Icon.js";
import { FETCH_USERS_STATUS, fetchRooms, fetchUsers, ROOM_ADD_OR_UPDATE, ROOM_ADD_SELECT, ROOM_SELECT, USER_TYPEING } from "../features/user/userActions.js";
import socket from "../socket.js";
import { getDataFromLocalStorage, getObjectFromLocalData, getRoomName, getRoomNameSplit, getToUserStatus, isUserTypeing, randomDigitsID, truncateString } from "../utility.js";
import Spinner from "./spinner.jsx";

const ChatSidebar = () => {
  const dispatch = useDispatch();
  const { users, rooms, userloading, roomloading, onlineUsers, userTypeing } = useSelector((state) => state.user);

  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const Userinfo = getObjectFromLocalData(constant.USERINFO);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    socket.emit("getOnlineUsers", (res) => {
      dispatch({
        type: FETCH_USERS_STATUS,
        payload: { ...res.onlineUsers },
      });
    });

    socket.on("onlineUsers", (onlineUsers) => {
      dispatch({
        type: FETCH_USERS_STATUS,
        payload: { ...onlineUsers },
      });
    });

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      socket.off("onlineUsers");
    };
  }, []);

  useEffect(() => {
    socket.on("typing", ({ userId, roomId }) => {
      // setTypingUser(userId);
      const userTypeingTemp = { ...userTypeing };
      userTypeingTemp[roomId] = {
        ...userTypeing[roomId],
        [userId]: userId
      }

      dispatch({
        type: USER_TYPEING,
        payload: userTypeingTemp,
      });
    });

    socket.on("stopTyping", ({ userId, roomId }) => {
      const userTypeingTemp = { ...userTypeing };
      userTypeingTemp[roomId] = {
        ...userTypeing[roomId]
      }
      delete userTypeingTemp[roomId][userId];
      delete userTypeingTemp[roomId];

      dispatch({
        type: USER_TYPEING,
        payload: userTypeingTemp,
      });
    });

    return () => {
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, []);

  // =========================
  // ROOM UPDATE LISTENER
  // =========================
  useEffect(() => {
    const handler = (room) => {
      dispatch({
        type: ROOM_ADD_OR_UPDATE,
        payload: room,
      });
    };

    socket.on("roomUpdated", handler);

    return () => socket.off("roomUpdated", handler);
  }, [dispatch]);

  useEffect(() => {
    let token = getDataFromLocalStorage(constant.AUTHTHOKEN);
    const timer = setTimeout(() => {
      if (search.trim()) {
        dispatch(
          fetchUsers({
            token: token,
            search
          })
        );
      }
    }, 500); // 500ms debounce
    return () => clearTimeout(timer);
  }, [search, dispatch])

  useEffect(() => {
    let token = getDataFromLocalStorage(constant.AUTHTHOKEN);
    dispatch(
      fetchRooms({
        token: token
      })
    );
  }, [dispatch])


  const onSearchUserClick = (user) => {
    setOpen(false);
    let roomTemp = {
      "_id": null, // roomid
      "tempId": `temp_${Userinfo?.id}_${randomDigitsID(10)}_${Date.now()}`,// real data with replace
      "isGroup": false,
      "participants": [user],
      "lastMessage": null
    }
    setTimeout(() => {
      dispatch({
        type: ROOM_ADD_SELECT,
        payload: roomTemp
      });
    }, 150);
  }

  const onUserRoomClick = (room) => {
    setTimeout(() => {
      dispatch({
        type: ROOM_SELECT,
        payload: room
      });
      setSearch("");
      setOpen(false);
    }, 150);
  }



  return <div class="col-md-3 p-0">

    <div class="sidebar">

      <div class="chat-search">
        <input
          type="text"
          class="form-control"
          placeholder="Search chats..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(e.target.value ? true : false);
          }} />
      </div>

      <div class="list-group list-group-flush" style={{ height: "79vh", overflow: "auto" }}>
        {open ?
          (userloading ? <Spinner spinnerColor={"theme-spinnerColor"} isActive={userloading} /> :
            (search.trim() && users?.length > 0 && (
              users.map((user) => (
                <div
                  key={user._id}
                  class="list-group-item user-item"
                  onClick={() => {
                    onSearchUserClick(user)
                  }}>
                  <div class="d-flex align-items-center">

                    <Avatar firstName={user.firstname} lastName={user.lastname} />

                    <div>
                      <strong>{user.firstname} {user.lastname}</strong><br />
                    </div>

                    <div class="online-dot ms-auto"></div>

                  </div>
                </div>
              ))
            )))
          :
          (rooms.map((room) => {
            const roomNameSplit = getRoomNameSplit(room);
            return <div key={room._id}
              class="list-group-item user-item"
              onClick={() => {
                onUserRoomClick(room)
              }}>
              <div class="d-flex align-items-center">
                <Avatar firstName={roomNameSplit?.firstname} lastName={roomNameSplit?.lastname} />
                <div>
                  <strong>{getRoomName(room)}</strong><br />
                  {isUserTypeing(userTypeing, room) ?
                    <small class="text-success">
                      {UserStatus.Typing}
                    </small>
                    :
                    <small class="text-muted">
                      {truncateString(room?.lastMessage?.text)}
                    </small>}
                </div>

                {getToUserStatus(onlineUsers, room) ? <div class="online-dot ms-auto"></div> : ""}

              </div>
            </div>

          }))
        }

      </div>

    </div>

  </div>
};

export default ChatSidebar;