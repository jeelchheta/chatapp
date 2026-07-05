import { useSelector } from "react-redux";

function ToastProvider() {
    const { toasts } = useSelector(
        (state) => state.toast
    );

    return (
        <div className="customtoast-container">
            {toasts.map((toast) => (
                <div key={toast.id} className={`customtoast ${toast.type}`}>
                    {toast.message}
                </div>
            ))}
        </div>
    );
}

export default ToastProvider