import { toast } from "react-toastify";




export const showToast = (type: "success" | "error" | "info", message: string) => {
    switch (type) {
        case "success":
            toast.success(message);
            break;
        case "error":
            toast.error(message);
            break;
        case "info":
            toast.info(message);
            break;
        default:
            toast(message); // Notifica di default
            break;
    }
};
