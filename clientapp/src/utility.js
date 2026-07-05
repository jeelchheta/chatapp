import { useLocation, useNavigate, useParams } from 'react-router-dom';
import constant from './constant/constant';

export function storeInLocalData(key, value) {
  localStorage.setItem(key, value)
}

export function storeObjectInLocalData(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function getDataFromLocalStorage(key) {
  let value = null;
  try {
    value = localStorage.getItem(key)
  }
  catch (err) {
    console.error("err in getDataFromLocalStorage")
  }
  return value
}

export function getObjectFromLocalData(key) {
  let value = null;
  try {
    value = JSON.parse(localStorage.getItem(key))
  }
  catch (err) {
    console.error("err in getObjectFromLocalData")
  }
  return value
}

export function removelocalData(key) {
  localStorage.removeItem(key)
}

// for sign
export async function signout() {
  for (let i in constant) {
    removelocalData(constant[i])
  }
}

export function emailValidate(str) {
  try {
    return /\S+@\S+\.\S+/.test(str);
  }
  catch (err) {

  }
  return false
}

export function digitValidate(str) {
  try {
    return /^[0-9]?$/.test(str);
  }
  catch (err) {

  }
  return false
}

export function isPositiveFloatIntWithZero(value) {
  try {
    value = Number(value);
    return typeof value === 'number' &&
      Number.isFinite(value) &&
      value >= 0;
  }

  catch (err) {
  }
  return false
}

export function isPositiveFloatInt(value) {
  try {
    value = Number(value);
    return typeof value === 'number' &&
      Number.isFinite(value) &&
      value > 0;
  }

  catch (err) {

  }
  return false
}

export function randomDigitsID(length) {
  const max = 10 ** length;
  const n = Math.floor(Math.random() * max);
  return String(n).padStart(length, '0');
}

export function getRoomName(obj) {
  const noOfParticipants = obj?.participants?.length;
  if (noOfParticipants > 1) {
    return obj?.participants?.map(e => `${e.firstname} ${e.lastname}`)?.join("") + (noOfParticipants - 1)
  }
  return obj?.participants?.map(e => `${e.firstname} ${e.lastname}`)?.join("")
}

export function getRoomNameSplit(obj) {
  return { firstname: obj?.participants?.[0]?.firstname, lastname: obj?.participants?.[0]?.lastname };
}

export function getFromUserId(obj) {
  const noOfParticipants = obj?.participants?.length;
  if (noOfParticipants > 1) {
    return null
  }
  return obj?.participants?.map(e => e._id)?.toString();
}

export function getToUserStatus(onlineUsers, obj) {
  const noOfParticipants = obj?.participants?.length;
  if (noOfParticipants > 1) {
    return null
  }
  const id = obj?.participants?.map(e => e._id)?.toString();
  return Object.hasOwn(onlineUsers, id)
}

export function isUserTypeing(userTypeing, obj) {
  let fromUserId = getFromUserId(obj);
  return userTypeing?.[obj?._id]?.[fromUserId]
}

export function truncateString(str, length = 10) {
  return str?.length > length ? str?.slice(0, length) + "..." : str;
}

export function getUserFullName(obj) {
  try {
    return `${obj?.firstname} ${obj?.lastname} (${obj?.uid})`
  }
  catch (err) {

  }
  return;
}

export const getColor = (name) => {
  const colors = [
    "#0d6efd",
    "#198754",
    "#dc3545",
    "#fd7e14",
    "#6f42c1",
    "#20c997",
    "#6610f2",
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash += name.charCodeAt(i);
  }

  return colors[hash % colors.length];
};

// history acc
const withRouter = (Component) => {
  const Wrapper = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();

    return (
      <Component
        {...props}
        navigate={navigate}
        location={location}
        params={params}
      />
    );
  };

  return Wrapper;
};

export default withRouter;
