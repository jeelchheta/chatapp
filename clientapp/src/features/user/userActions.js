import config from '../../api.json';
import Messeges from '../../constant/Messeges';
import { GetData } from '../../services/apiUtiles';
import { showToast } from '../toasts/toastActions';

export const FETCH_USERS_REQUEST = 'FETCH_USERS_REQUEST';
export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS';
export const FETCH_USERS_FAIL = 'FETCH_USERS_FAIL';
export const FETCH_USERS_STATUS = 'FETCH_USERS_STATUS';
export const USER_TYPEING = "USER_TYPEING";

export const ROOM_ADD = 'ROOM_ADD';
export const ROOM_SELECT = 'ROOM_SELECT';
export const ROOM_ADD_SELECT = 'ROOM_ADD_SELECT';
export const ROOM_TEMP_REPLACE = 'ROOM_TEMP_REPLACE';

export const FETCH_ROOM_REQUEST = 'FETCH_ROOM_REQUEST';
export const FETCH_ROOM_SUCCESS = 'FETCH_ROOM_SUCCESS';
export const ROOM_ADD_OR_UPDATE = 'ROOM_ADD_OR_UPDATE';

export const fetchUsers =
    ({ token, search }) =>
        async (dispatch) => {
            try {
                dispatch({
                    type: FETCH_USERS_REQUEST
                });

                const res = await GetData(
                    config.SEARCHUSERS_API + search,
                    token
                );

                if (res.statuscode == 200) {
                    dispatch({
                        type: FETCH_USERS_SUCCESS,
                        payload: res?.response ? res.response : []
                    });
                }
                else {
                    dispatch(showToast({ message: Messeges.s_wentwrong }))
                    dispatch({ type: FETCH_USERS_FAIL })
                }

            } catch (error) {
                dispatch(showToast({ message: Messeges.s_wentwrong }))
                dispatch({ type: FETCH_USERS_FAIL })
            }
        };

export const fetchRooms =
    ({ token }) =>
        async (dispatch) => {
            try {
                dispatch({
                    type: FETCH_ROOM_REQUEST
                });

                const res = await GetData(
                    config.ROOMLIST_API,
                    token
                );

                if (res.statuscode == 200) {
                    dispatch({
                        type: FETCH_ROOM_SUCCESS,
                        payload: res?.response ? res.response : []
                    });
                }
                else {
                    dispatch(showToast({ message: Messeges.s_wentwrong }))
                }

            } catch (error) {
                dispatch(showToast({ message: Messeges.s_wentwrong }))
            }
        };