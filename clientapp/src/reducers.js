import { combineReducers } from 'redux';
import toastReducer from '../src/features/toasts/toastReducer';
import userReducer from '../src/features/user/userReducer';

const rootReducer = combineReducers({
  user: userReducer,
  toast: toastReducer
});

export default rootReducer;