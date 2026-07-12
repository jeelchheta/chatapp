import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import config from "../api.json";
import constant, { DateFormate, UserStatus } from "../constant/constant";

import Moment from "moment";
import { Avatar } from "../constant/Icon";
import Messeges from "../constant/Messeges";
import { showToast } from "../features/toasts/toastActions";
import { GetData } from "../services/apiUtiles";
import socket from "../socket";
import { getDataFromLocalStorage, getObjectFromLocalData, getRoomName, getRoomNameSplit, getToUserStatus, isUserTypeing } from "../utility";

// const socket = io(config.BASEURL_SOCKET_URL, {
//   autoConnect: false,
// });

const LIMIT = 19;

const ChatLayout = () => {
  const dispatch = useDispatch();
  const { selectedRoom, onlineUsers, userTypeing } = useSelector((state) => state.user);

  const userInfo = getObjectFromLocalData(constant.USERINFO);

  const chatRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  // // =========================
  // // SOCKET CONNECT
  // // =========================
  // useEffect(() => {
  //   const token = getDataFromLocalStorage(constant.AUTHTHOKEN);

  //   socket.auth = { token };

  //   if (!socket.connected) socket.connect();

  //   return () => socket.disconnect();
  // }, []);

  // =========================
  // JOIN ROOM
  // =========================
  useEffect(() => {
    if (!selectedRoom?._id) {
      setMessages([]);
      setPage(1);
      setInitialLoading(false);
      setMessage("")
      return;
    }
    socket.emit("joinRoom", { roomId: selectedRoom._id });

    setMessages([]);
    setPage(1);
    setHasMore(true);
    setInitialLoading(true);
    setMessage("")

    loadMessages(1, true).finally(() => {
      setInitialLoading(false);
    });
  }, [selectedRoom?._id]);

  // =========================
  // LOAD MESSAGES
  // =========================
  const loadMessages = async (pageNo, initial = false) => {
    if (!selectedRoom?._id) return;

    try {
      const token = getDataFromLocalStorage(constant.AUTHTHOKEN);

      const res = await GetData(
        `${config.MESSAGE_API}/${selectedRoom._id}?page=${pageNo}&limit=${LIMIT}`,
        token
      );

      if (res.statuscode !== 200) {
        dispatch(showToast({ message: "Something went wrong" }));
        return;
      }

      const data = res?.response || [];

      if (initial) {
        setMessages(data);

        setTimeout(() => {
          chatRef.current?.scrollTo({
            top: chatRef.current.scrollHeight,
            behavior: "auto",
          });
        }, 50);
      } else {
        setMessages((prev) => [...data, ...prev]);
      }

      if (data.length < LIMIT) setHasMore(false);
    } catch (err) {
      dispatch(showToast({ message: "Something went wrong" }));
    }
  };

  // =========================
  // RECEIVE MESSAGE (REALTIME)
  // =========================
  useEffect(() => {
    const handler = (msg) => {
      if (!selectedRoom?._id) return;

      // prevent duplicate own message
      // if (msg.sender === userInfo?.id) return;

      setMessages((prev) => [...prev, msg]);

      const el = chatRef.current;

      const isNearBottom =
        el &&
        el.scrollHeight - el.scrollTop - el.clientHeight < 120;

      if (isNearBottom) {
        setTimeout(() => {
          el?.scrollTo({
            top: el.scrollHeight,
            behavior: "smooth",
          });
        }, 50);
      }
    };

    socket.on("receiveMessage", handler);

    return () => socket.off("receiveMessage", handler);
  }, [selectedRoom]);

  // =========================
  // SEND MESSAGE
  // =========================
  const sendMessage = () => {
    if (!message.trim()) return;
    // if (!selectedRoom?._id) return;

    socket.emit("sendMessage", {
      roomId: selectedRoom._id,
      receiverUsers: selectedRoom.participants,
      text: message,
      tempId: selectedRoom?.tempId,
      toUserParticipants: [{
        "_id": userInfo?.id,
        "firstname": userInfo?.firstname,
        "lastname": userInfo?.lastname
      }]
    }, () => {
      dispatch(showToast({ message: Messeges.s_wentwrong }))
    });

    setMessage("");
  };

  // =========================
  // SCROLL LOAD MORE
  // =========================
  const handleScroll = async () => {
    const el = chatRef.current;

    if (!el || loadingMore || !hasMore || initialLoading) return;

    if (el.scrollTop <= 20) {
      setLoadingMore(true);

      const next = page + 1;

      await loadMessages(next);

      setPage(next);

      setLoadingMore(false);
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value)
    const roomId = selectedRoom?._id
    const myUserId = userInfo?.id
    if (!roomId || !myUserId) return;

    socket.emit("typing", {
      roomId,
      userId: myUserId,
      receiverUsers: selectedRoom.participants
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", {
        roomId,
        userId: myUserId,
        receiverUsers: selectedRoom.participants
      });
    }, 1000);
  };

  const handleKeyDownTyping = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage()
    }
  }

  // =========================
  // UI
  // =========================
  if (!selectedRoom) {
    return <div className="empty-chat">Select user to chat</div>;
  }

  const roomNameSplit = getRoomNameSplit(selectedRoom);

  return <div class="col-md-9 p-0 chat-col">

    <div class="chat-area">

      {/* <!-- CHAT HEADER --> */}
      <div class="chat-header">

        <div class="d-flex justify-content-between align-items-center">

          <div class="d-flex align-items-center">

            <Avatar firstName={roomNameSplit.firstname} lastName={roomNameSplit.lastname} />

            <div>
              <strong>{getRoomName(selectedRoom)}</strong><br />
              {getToUserStatus(onlineUsers, selectedRoom) ?
                (isUserTypeing(userTypeing, selectedRoom) ?
                  <small class="text-success">
                    {UserStatus.Typing}
                  </small> :
                  <small class="text-success">
                    {UserStatus.Online}
                  </small>
                )
                :
                <small class="text-danger">
                  {UserStatus.Offline}
                </small>}
            </div>

          </div>

          <div>

            <button class="btn btn-light">
              <i class="bi bi-telephone"></i>
            </button>

            <button class="btn btn-light">
              <i class="bi bi-camera-video"></i>
            </button>

            <button class="btn btn-light">
              <i class="bi bi-search"></i>
            </button>

          </div>

        </div>

      </div>

      {/* <!-- CHAT BODY --> */}
      <div class="chat-body"
        ref={chatRef}
        onScroll={handleScroll}>

        {initialLoading && <div>Loading...</div>}

        {messages.map((msg) => (
          <div
            key={msg._id}
            class={`message ${msg.sender === userInfo?.id ? "sent" : "received"}`}>
            <div class="chat-message">{msg.text}</div>
            <div class="time">
              {Moment(msg.updatedAt).format(DateFormate.HHmmA)} {/* ✓✓ */}
            </div>
          </div>
        ))}

      </div>

      {/* <!-- FOOTER --> */}
      <div class="chat-footer">

        <div class="input-group">

          {/* <button class="btn btn-outline-secondary">
            <i class="bi bi-emoji-smile"></i>
          </button>

          <button class="btn btn-outline-secondary">
            <i class="bi bi-paperclip"></i>
          </button>

          <button class="btn btn-outline-secondary">
            <i class="bi bi-camera"></i>
          </button> */}

          <textarea
            type="text"
            class="form-control"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => handleTyping(e)}
            onKeyDown={(e) => handleKeyDownTyping(e)}
          />

          <button
            class="btn btn-primary"
            onClick={sendMessage}>
            <i class="bi bi-send-fill"></i>
          </button>

        </div>

      </div>

    </div>

  </div>


};

export default ChatLayout;