export const TOASTS_UPDATE = 'TOASTS_UPDATE';
export const TOASTS_DELETE = 'TOASTS_DELETE';

export const showToast = ({ message, msgtype }) => dispatch => {
    const id = Date.now() + Math.random();

    dispatch({
        type: TOASTS_UPDATE,
        payload: { "id": id, "message": message, "type": msgtype || "error" }
    });

    setTimeout(() => {
        dispatch({
            type: TOASTS_DELETE,
            payload: id
        });
    }, 3000);
};