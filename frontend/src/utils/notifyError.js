import { toast, Bounce } from 'react-toastify';

const notifyError = (textError) => {
  toast.error(textError, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
    transition: Bounce,
  });
};

export default notifyError;
