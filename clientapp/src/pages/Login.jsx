import { useState } from "react";
import { useDispatch } from "react-redux";
import APIJSON from "../api.json";
import Spinner from "../components/spinner";
import constant, { RoutesStrings } from "../constant/constant";
import Messeges from "../constant/Messeges";
import { showToast } from "../features/toasts/toastActions";
import { PostData } from "../services/apiUtiles";
import withRouter, {
  storeInLocalData,
  storeObjectInLocalData,
} from "../utility";
import { Link } from "react-router-dom";

const Login = (props) => {
  const dispatch = useDispatch();
  const [userfields, setUserfields] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isActive, setIsActive] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserfields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateInput = () => {
    let errors = {};
    let validateInputs = true;

    if (!userfields.username?.trim()) {
      validateInputs = false;
      errors.username = Messeges.v_username;
    }

    if (!userfields.password?.trim()) {
      validateInputs = false;
      errors.password = Messeges.v_password;
    }

    setErrors(errors);
    return validateInputs;
  };

  const callLoginAPI = async (postData) => {
    setIsActive(true);

    PostData(APIJSON.LOGIN_API, "", postData)
      .then((response) => {
        let responseData = response?.response;

        if (responseData?.token) {
          storeInLocalData(constant.AUTHTHOKEN, responseData.token);

          storeObjectInLocalData(constant.USERINFO, {
            id: responseData?.id,
            firstname: responseData?.firstname,
            lastname: responseData?.lastname,
            uid: responseData?.uid,
            role: responseData?.role,
          });

          props.navigate({
            pathname: RoutesStrings.Chat,
          });
        } else {
          dispatch(showToast({ message: Messeges.s_wentwrong }))
        }

        setIsActive(false);
      })
      .catch((err) => {
        setIsActive(false);
        dispatch(showToast({ message: Messeges.s_wentwrong }))
      });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (validateInput()) {
      callLoginAPI(userfields);
    }
  };

  const toastClose = () => {
    setErrors({});
  };


  return <div class="container">
    <div class="row justify-content-center align-items-center vh-100">
      <div class="col-md-5 col-lg-4">
        <div class="card shadow-lg border-0 rounded-4">
          <div class="card-body p-4">

            <h2 class="text-center mb-4">Sign In</h2>

            <form onSubmit={handleLogin}>
              {/* <!-- Email --> */}
              <div class="mb-3">
                <label for="email" class="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  class={`form-control ${errors.username ? "error" : ""}`}
                  id="email"
                  placeholder="Enter your email"
                  name="username"
                  value={userfields.username}
                  onChange={handleChange} />
                <div className="error-msg">{errors.username}</div>
              </div>

              {/* <!-- Password --> */}
              <div class="mb-3">
                <label for="password" class="form-label">
                  Password
                </label>

                <div class={`input-group ${errors.password ? "error" : ""}`}>
                  <input
                    type={showPassword ? "text" : "password"}
                    class="form-control"
                    id="password"
                    placeholder="Enter your password"
                    name="password"
                    value={userfields.password}
                    onChange={handleChange} />

                  <button
                    class="btn btn-outline-secondary"
                    type="button"
                    id="togglePassword" onClick={() => setShowPassword(!showPassword)}>
                    <i class={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                  </button>
                </div>
                <div className="error-msg">{errors.password}</div>
              </div>

              {/* <!-- Remember Me --> */}
              <div class="d-flex justify-content-between align-items-center mb-3">
                {/* <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="remember" />
                  <label class="form-check-label" for="remember">
                    Remember Me
                  </label>
                </div> */}

                <Link to={RoutesStrings.ForgotPassword} class="text-decoration-none">
                  Forgot Password?
                </Link>
              </div>

              {/* <!-- Login Button --> */}
              <button type="submit" class="btn btn-primary w-100">
                Sign In
              </button>

              {/* <!-- Signup Link --> */}
              <p class="text-center mt-3 mb-0">
                Don't have an account?
                <Link to={RoutesStrings.SignUp} class="text-decoration-none">
                  Sign Up
                </Link>
              </p>

            </form>

          </div>
        </div>
      </div>
    </div>
  </div>
};

export default withRouter(Login);