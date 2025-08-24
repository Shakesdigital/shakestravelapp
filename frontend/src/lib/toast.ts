import { toast, ToastOptions } from 'react-toastify';

// Default toast options
const defaultOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

// Custom toast methods with consistent styling
export const showToast = {
  success: (message: string, options?: ToastOptions) => {
    toast.success(message, {
      ...defaultOptions,
      ...options,
    });
  },

  error: (message: string, options?: ToastOptions) => {
    toast.error(message, {
      ...defaultOptions,
      ...options,
    });
  },

  warning: (message: string, options?: ToastOptions) => {
    toast.warning(message, {
      ...defaultOptions,
      ...options,
    });
  },

  info: (message: string, options?: ToastOptions) => {
    toast.info(message, {
      ...defaultOptions,
      ...options,
    });
  },

  // Special toasts for booking flow
  bookingSuccess: (bookingId: string) => {
    toast.success(
      `Booking confirmed! Your booking ID is ${bookingId}. Redirecting to confirmation...`,
      {
        ...defaultOptions,
        autoClose: 3000,
      }
    );
  },

  paymentSuccess: () => {
    toast.success('Payment processed successfully! 🎉', {
      ...defaultOptions,
      autoClose: 4000,
    });
  },

  wishlistAdded: (itemName: string) => {
    toast.success(`${itemName} added to your wishlist! ❤️`, {
      ...defaultOptions,
      autoClose: 3000,
    });
  },

  wishlistRemoved: (itemName: string) => {
    toast.info(`${itemName} removed from wishlist`, {
      ...defaultOptions,
      autoClose: 3000,
    });
  },

  tripPlanSaved: (tripName: string) => {
    toast.success(`Trip plan "${tripName}" saved successfully! 🗺️`, {
      ...defaultOptions,
      autoClose: 4000,
    });
  },

  // Loading toast that returns a toast ID for updating
  loading: (message: string) => {
    return toast.loading(message, {
      position: 'top-center',
    });
  },

  // Update a loading toast
  updateLoading: (toastId: any, message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    toast.update(toastId, {
      render: message,
      type,
      isLoading: false,
      autoClose: 5000,
      closeButton: true,
    });
  },
};

// Validation error handler
export const handleValidationErrors = (errors: any) => {
  if (Array.isArray(errors)) {
    errors.forEach((error: any) => {
      showToast.error(typeof error === 'string' ? error : error.message);
    });
  } else if (typeof errors === 'object') {
    Object.values(errors).forEach((error: any) => {
      if (Array.isArray(error)) {
        error.forEach((msg: string) => showToast.error(msg));
      } else {
        showToast.error(typeof error === 'string' ? error : JSON.stringify(error));
      }
    });
  } else {
    showToast.error(errors || 'Validation failed');
  }
};

export default showToast;