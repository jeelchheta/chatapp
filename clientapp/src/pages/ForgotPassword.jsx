import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import APIJSON from "../api.json";
import Spinner from "../components/spinner";
import Messeges from "../constant/Messeges";
import { showToast } from "../features/toasts/toastActions";
import { PostData } from "../services/apiUtiles";
import withRouter, {
    emailValidate
} from "../utility";

const ForgotPassword = (props) => {
    const dispatch = useDispatch();
    const [userfields, setUserfields] = useState({
        username: ""
    });

    const [errors, setErrors] = useState({});
    const [isActive, setIsActive] = useState(false);

    const [page, setPage] = useState(0);
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
        if (page != 1) return;

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
    }, [page, timerKey]);

    const handleResendOTP = async () => {
        if (!canResend) return;

        await handleRequestPasswordResetAPI(userfields);

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

        if (!userfields.username.trim()) {
            errors.username = Messeges.v_username;
            valid = false;
        } else if (!emailValidate(userfields.username)) {
            errors.username = Messeges.v_username1;
            valid = false;
        }

        setErrors(errors);

        return valid;
    };

    const handleRequestPasswordReset = (e) => {
        e.preventDefault();

        if (validateInput()) {
            handleRequestPasswordResetAPI({ username: userfields.username });
        }
    }

    const handleRequestPasswordResetAPI = async (postData) => {
        setIsActive(true);

        await PostData(APIJSON.FORGOTPASSWORD_API, "", postData)
            .then((response) => {

                if (response?.statuscode == 200) {
                    setPage(1);
                }
                else if (response?.statuscode == 404) {
                    dispatch(showToast({ message: Messeges.s_Email1 }))
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


    const handleVerifyOTP = (e) => {
        e.preventDefault();
        setPage(0);
    }

    return <div class="container">
        <div class="row justify-content-center align-items-center vh-100">
            <div class="col-md-5 col-lg-4">
                <div class="card shadow-lg border-0 rounded-4">
                    <div class="card-body p-4">

                        <h2 class="text-center mb-4">Forgot Password</h2>

                        {page == 0 &&
                            (<form onSubmit={handleRequestPasswordReset}>

                                <div className="row">

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

                                    <button className="btn btn-primary w-100">
                                        <Spinner isActive={isActive} text={"Request password reset"} />
                                    </button>

                                </div>

                            </form>)}
                        {page == 1 &&
                            (<div className="text-center mt-4">
                                <p class="text-center mt-3 mb-0">
                                    {canResend ? (
                                        <a tabIndex="-1" role="button" class="text-decoration-none"
                                            onClick={handleResendOTP}>
                                            Resend Link
                                        </a>) :
                                        (
                                            <p className="text-muted">
                                                Resend Link in {timer}s
                                            </p>
                                        )}
                                </p>

                                <button
                                    className="btn btn-primary mt-3"
                                    onClick={handleVerifyOTP}
                                >
                                    Back
                                </button>
                            </div>
                            )}
                    </div>
                </div>
            </div>
        </div>
    </div>
};

export default withRouter(ForgotPassword);