import {
  TOASTS_DELETE,
  TOASTS_UPDATE
} from './toastActions.js';

const initialState = {
  toasts: [],
  notificationToasts: [] // implement soon
};

const toastReducer = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case TOASTS_UPDATE:
      return {
        ...state,
        toasts: [...state.toasts, action.payload]
      };
    case TOASTS_DELETE:
      return {
        ...state,
        toasts: state.toasts.filter((toast) => toast.id !== action.payload)
      };
    default:
      return state;
  }
};

export default toastReducer;