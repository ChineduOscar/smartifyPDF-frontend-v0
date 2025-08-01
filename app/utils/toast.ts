import { toast, ToastOptions, ToastPosition } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const isClient = typeof window !== 'undefined';

// Get responsive values safely
const getResponsiveValues = () => {
  if (!isClient) {
    return {
      isMobile: false,
      isSmall: false,
      width: { min: '500px', max: '600px' },
      fontSize: '14px',
      padding: '16px 20px',
      height: { min: '50px', max: '100px' },
      lineHeight: '1.4',
    };
  }

  const isMobile = window.innerWidth < 768;
  const isSmall = window.innerWidth < 480;

  return {
    isMobile,
    isSmall,
    width: {
      min: isSmall ? '260px' : isMobile ? '280px' : '500px',
      max: isSmall ? '320px' : isMobile ? '350px' : '600px',
    },
    fontSize: isSmall ? '12px' : isMobile ? '13px' : '14px',
    padding: isSmall ? '8px 12px' : isMobile ? '12px 16px' : '16px 20px',
    height: {
      min: isSmall ? '36px' : isMobile ? '40px' : '50px',
      max: isSmall ? '60px' : isMobile ? '80px' : '100px',
    },
    lineHeight: isSmall ? '1.2' : isMobile ? '1.3' : '1.4',
  };
};

const baseOptions: ToastOptions = {
  position: 'top-center' as ToastPosition,
  autoClose: 3000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: 'colored',
  icon: false,
  closeButton: false,
  style: {
    fontWeight: '500',
    borderRadius: '8px',
    textAlign: 'center' as const,
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
};

const successOptions: ToastOptions = {
  ...baseOptions,
};

const errorOptions: ToastOptions = {
  ...baseOptions,
};

export const showToast = (message: string, type: 'success' | 'error') => {
  const responsive = getResponsiveValues();

  const dynamicStyle = {
    ...baseOptions.style,
    minWidth: responsive.width.min,
    maxWidth: responsive.width.max,
    fontSize: responsive.fontSize,
    padding: responsive.padding,
    minHeight: responsive.height.min,
    maxHeight: responsive.height.max,
    lineHeight: responsive.lineHeight,
  };

  if (type === 'success') {
    toast.success(message, {
      ...successOptions,
      style: {
        ...dynamicStyle,
        backgroundColor: '#32a952',
        color: '#ffffff',
      },
    });
  } else {
    toast.error(message, {
      ...errorOptions,
      style: {
        ...dynamicStyle,
        backgroundColor: '#ef4444',
        color: '#ffffff',
      },
    });
  }
};
