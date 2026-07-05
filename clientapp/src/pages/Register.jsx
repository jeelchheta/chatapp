import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import APIJSON from "../api.json";
import Spinner from "../components/spinner";
import { RoutesStrings } from "../constant/constant";
import Messeges from "../constant/Messeges";
import { showToast } from "../features/toasts/toastActions";
import { PostData } from "../services/apiUtiles";
import withRouter, {
  digitValidate,
  emailValidate
} from "../utility";

const Register = (props) => {
  const dispatch = useDispatch();
  const [userfields, setUserfields] = useState({
    firstname: "",
    lastname: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isActive, setIsActive] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOTP] = useState("");
  const [timer, setTimer] = useState(30);
  const [timerKey, setTimerKey] = useState(0);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "auto"

    return () => {
      document.body.style.overflow = "hidden"
    }
  }, [])

  useEffect(() => {
    if (!showOTP) return;

    setTimer(30);
    setCanResend(false);

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showOTP, timerKey]);

  const handleResendOTP = async () => {
    if (!canResend) return;

    await callRegisterAPI(userfields);

    setTimerKey((prev) => prev + 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserfields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateInput = () => {
    let errors = {};
    let valid = true;

    if (!userfields.firstname.trim()) {
      errors.firstname = Messeges.v_firstName;
      valid = false;
    }

    if (!userfields.lastname.trim()) {
      errors.lastname = Messeges.v_lastName;
      valid = false;
    }

    if (!userfields.username.trim()) {
      errors.username = Messeges.v_username;
      valid = false;
    } else if (!emailValidate(userfields.username)) {
      errors.username = Messeges.v_username1;
      valid = false;
    }

    if (!userfields.password) {
      errors.password = Messeges.v_password;
      valid = false;
    }
    else if (userfields.password.length < 6) {
      errors.password = Messeges.v_password1;
      valid = false;
    }
    else {
      if (userfields.confirmPassword.length < 6) {
        errors.confirmPassword = Messeges.v_password1;
        valid = false;
      }

      if (userfields.confirmPassword !== userfields.password) {
        errors.confirmPassword = Messeges.v_password2;
        valid = false;
      }
    }


    setErrors(errors);

    return valid;
  };

  const callRegisterAPI = async (postData) => {
    setIsActive(true);

    await PostData(APIJSON.REGISTER_API, "", postData)
      .then((response) => {

        if (response?.statuscode == 201) {
          setShowOTP(true);
        }
        else if (response?.statuscode == 409) {
          dispatch(showToast({ message: Messeges.s_Email }))
        } else {
          dispatch(showToast({ message: Messeges.s_wentwrong }))
        }

        setIsActive(false);
      })
      .catch((err) => {
        setIsActive(false);
        dispatch(showToast({ message: Messeges.s_wentwrong }))
      });

    return
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (validateInput()) {
      callRegisterAPI(userfields);
    }
  }

  const onChangeOTP = (e, index) => {
    const val = e.target.value;

    if (!digitValidate(val)) return;

    const otpArr = otp.split("");

    otpArr[index] = val;

    const newOtp = otpArr.join("");
    setOTP(newOtp);

    if (val && e.target.nextSibling) {
      e.target.nextSibling.focus();
    }
  }

  const onKeyDownOTP = (e, index) => {
    if (e.key === "Backspace" && !otp[index]) {
      if (e.target.previousSibling) {
        e.target.previousSibling.focus();
      }
    }
  }

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    if (otp) {
      callVerifyOTPAPI({ otp: otp, username: userfields.username });
    }
  }

  const callVerifyOTPAPI = async (postData) => {
    setIsActive(true);

    PostData(APIJSON.VERIFYOTP_API, "", postData)
      .then((response) => {

        if (response?.statuscode == 200) {
          props.navigate({
            pathname: RoutesStrings.Base
          });
        }
        else if (response?.statuscode == 400) {
          dispatch(showToast({ message: Messeges.s_OTP }))
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

  return <div class="container">
    <div class="row justify-content-center align-items-center vh-100">
      <div class="col-md-5 col-lg-4">
        <div class="card shadow-lg border-0 rounded-4">
          <div class="card-body p-4">

            <h2 class="text-center mb-4">Sign Up</h2>

            {!showOTP ?
              (<form onSubmit={handleRegister}>

                <div className="row">

                  <div className="col-md-6 mb-3">
                    <label>First Name</label>
                    <input
                      className={`form-control ${errors.firstname ? "error" : ""}`}
                      name="firstname"
                      value={userfields.firstname}
                      onChange={handleChange}
                    />
                    <div className="error-msg">{errors.firstname}</div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label>Last Name</label>
                    <input
                      className={`form-control ${errors.lastname ? "error" : ""}`}
                      name="lastname"
                      value={userfields.lastname}
                      onChange={handleChange}
                    />
                    <div className="error-msg">{errors.lastname}</div>
                  </div>

                  <div className="mb-3">
                    <label>Email</label>
                    <input
                      type="email"
                      className={`form-control ${errors.username ? "error" : ""}`}
                      name="username"
                      value={userfields.username}
                      onChange={handleChange}
                    />
                    <div className="error-msg">{errors.username}</div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Password</label>

                    <div className={`input-group ${errors.password ? "error" : ""}`}>
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        name="password"
                        value={userfields.password}
                        onChange={handleChange}
                      />

                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                      </button>
                    </div>

                    <div className="error-msg">{errors.password}</div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Confirm Password</label>

                    <div className={`input-group ${errors.confirmPassword ? "error" : ""}`}>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className="form-control"
                        name="confirmPassword"
                        value={userfields.confirmPassword}
                        onChange={handleChange}
                      />

                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        <i
                          className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"
                            }`}
                        ></i>
                      </button>
                    </div>

                    <div className="error-msg">{errors.confirmPassword}</div>
                  </div>

                  <button className="btn btn-primary w-100">
                    <Spinner isActive={isActive} text={"Sign Up"} />
                  </button>
                  {/* <!-- SignIn Link --> */}
                  <p class="text-center mt-3 mb-0">
                    Don't have an account?
                    <Link to={RoutesStrings.Base} class="text-decoration-none">
                      Sign In
                    </Link>
                  </p>

                </div>

              </form>)
              :
              (
                <div className="text-center mt-4">
                  <h5>Enter OTP</h5>

                  <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                    {[...Array(6)].map((_, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength="1"
                        value={otp[index] || ""}
                        onChange={(e) => onChangeOTP(e, index)}
                        onKeyDown={(e) => onKeyDownOTP(e, index)}
                        style={{
                          width: "45px",
                          height: "45px",
                          textAlign: "center",
                          fontSize: "18px",
                          border: "1px solid #ccc",
                          borderRadius: "6px",
                        }}
                      />
                    ))}
                  </div>

                  <p class="text-center mt-3 mb-0">
                    {canResend ? (
                      <a tabIndex="-1" role="button" class="text-decoration-none"
                        onClick={handleResendOTP}>
                        Resend OTP
                      </a>) :
                      (
                        <p className="text-muted">
                          Resend OTP in {timer}s
                        </p>
                      )}
                  </p>

                  <button
                    className="btn btn-primary mt-3"
                    disabled={otp.length !== 6}
                    onClick={handleVerifyOTP}
                  >
                    <Spinner isActive={isActive} text={"Verify OTP"} />
                  </button>
                </div>
              )}

          </div>
        </div>
      </div>
    </div>
  </div>
};

export default withRouter(Register);