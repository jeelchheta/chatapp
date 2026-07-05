
import {
  FETCH_ROOM_REQUEST,
  FETCH_ROOM_SUCCESS,
  FETCH_USERS_FAIL,
  FETCH_USERS_REQUEST,
  FETCH_USERS_STATUS,
  FETCH_USERS_SUCCESS,
  ROOM_ADD_OR_UPDATE,
  ROOM_ADD_SELECT,
  ROOM_SELECT,
  USER_TYPEING
} from "./userActions.js";

const initialState = {
  users: [],
  userloading: false,
  onlineUsers: {},
  userTypeing: {},

  rooms: [],
  selectedRoom: null,
  roomloading: false,
};

// =========================
// HELPERS
// =========================

function getExsistRoom(rooms, payload) {
  let tempRoom = [], exsistroom = null
  for (let room of rooms) {
    if (room?._id) {
      if (room?.participants?.length == 1) {
        if (room?.participants.find(e1 => payload?.participants?.find(e2 => e1._id == e2._id))) {
          exsistroom = room;
        } else {
          tempRoom.push(room);
        }
      }
    }
  }
  return { exsistroom, rooms: tempRoom }
}

const userReducer = (state = initialState, action) => {
  switch (action.type) {

    // =========================
    // USERS
    // =========================
    case FETCH_USERS_REQUEST:
      return {
        ...state,
        userloading: true,
      };

    case FETCH_USERS_SUCCESS:
      return {
        ...state,
        userloading: false,
        users: action.payload,
      };
    case FETCH_USERS_FAIL:
      return {
        ...state,
        userloading: false
      };
    case FETCH_USERS_STATUS:
      return {
        ...state,
        onlineUsers: { ...action.payload },
      };

    case USER_TYPEING:
      return {
        ...state,
        userTypeing: { ...action.payload },
      };

    // =========================
    // ROOMS FETCH
    // =========================
    case FETCH_ROOM_REQUEST:
      return {
        ...state,
        roomloading: true,
      };

    case FETCH_ROOM_SUCCESS:
      return {
        ...state,
        roomloading: false,
        rooms: action.payload,
      };

    // =========================
    // SELECT ROOM
    // =========================
    case ROOM_SELECT:
      return {
        ...state,
        selectedRoom: action.payload,
      };

    // =========================
    // SELECT ROOM
    // =========================
    case ROOM_ADD_SELECT:
      const { rooms, exsistroom } = getExsistRoom(state.rooms, action.payload)
      return {
        ...state,
        selectedRoom: exsistroom ? exsistroom : action.payload,
        rooms: [exsistroom ? exsistroom : action.payload, ...rooms],
      };

    // =========================
    // ROOM ADD OR UPDATE (MAIN FIX)
    // =========================
    case ROOM_ADD_OR_UPDATE: {
      const room = action.payload;
      const { tempId, ...newroom } = room;

      if (tempId) {
        let updatedRooms = [], oldroom = null;

        for (let room of state.rooms) {
          if (room?.tempId) {
            oldroom = room;
          }
          else if (room?._id) {
            updatedRooms.push(room);
          }
        }

        return {
          ...state,
          selectedRoom: { ...newroom },
          rooms: [{ ...newroom }, ...updatedRooms],
        };

      }
      else {
        let updatedRooms = [], oldroom = null;
        for (let i in state.rooms) {
          if (state.rooms[i]._id === newroom._id) {
            oldroom = state.rooms[i];
          }
          else if (state.rooms[i]?._id) {
            updatedRooms.push(state.rooms[i]);
          }
        }
        if (!oldroom) {
          updatedRooms = [newroom, ...updatedRooms]
        }
        else {
          updatedRooms = [{ ...newroom, "participants": oldroom?.participants || [] }, ...updatedRooms]
        }
        return {
          ...state,
          rooms: updatedRooms,
          selectedRoom: state?.selectedRoom ?
            (state?.selectedRoom?.tempId ? { ...updatedRooms[0] } : { ...state?.selectedRoom })
            : null,
        };
      }

    }

    // =========================
    // DEFAULT
    // =========================
    default:
      return state;
  }
};


export default userReducer;