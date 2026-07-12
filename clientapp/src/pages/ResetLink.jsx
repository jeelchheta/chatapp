import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import APIJSON from "../api.json";
import Spinner from "../components/spinner";
import { RoutesStrings } from "../constant/constant";
import Messeges from "../constant/Messeges";
import { showToast } from "../features/toasts/toastActions";
import { PostData } from "../services/apiUtiles";
import withRouter from "../utility";

const ResetLink = (props) => {
    const dispatch = useDispatch();
    const [userfields, setUserfields] = useState({
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({});
    const [isActive, setIsActive] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const URLToken = props?.params?.token;

    useEffect(() => {
        document.body.style.overflow = "auto"

        return () => {
            document.body.style.overflow = "hidden"
        }
    }, [])


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
        return valid && URLToken;
    };

    const handleSaveNewPassword = (e) => {
        e.preventDefault();

        if (validateInput()) {
            handleSaveNewPasswordAPI({
                token: URLToken,
                password: userfields.password
            });
        }
    }

    const handleSaveNewPasswordAPI = async (postData) => {
        setIsActive(true);

        await PostData(APIJSON.SETNEWPASSWORD_API, "", postData)
            .then((response) => {

                if (response?.statuscode === 200) {
                    props.navigate({
                        pathname: RoutesStrings.Base
                    });
                }
                else if (response?.statuscode === 404) {
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

    return <div class="container">
        <div class="row justify-content-center align-items-center vh-100">
            <div class="col-md-5 col-lg-4">
                <div class="card shadow-lg border-0 rounded-4">
                    <div class="card-body p-4">
                        <h2 class="text-center mb-4">Reset Password</h2>
                        <form onSubmit={handleSaveNewPassword}>
                            <div className="row">
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
                                    <Spinner isActive={isActive} text={"Save"} />
                                </button>

                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
};

export default withRouter(ResetLink);