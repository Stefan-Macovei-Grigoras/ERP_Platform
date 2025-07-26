import { toast } from 'react-toastify';

export const showSuccess = (message) => {
  toast.success(message, {
    position: 'top-right',
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
  });
};

export const showError = (message) => {
  toast.error(message, {
    position: 'top-right',
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
  });
};

export const showInfo = (message) => {
  toast.info(message, {
    position: 'top-right',
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
  });
};
