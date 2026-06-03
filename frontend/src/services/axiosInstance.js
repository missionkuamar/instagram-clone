import axios from 'axios';
import { toast } from 'sonner';

const API_BASE_URL = 'http://localhost:8000/api/v1';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Request interceptor - FIXED LOGGING
axiosInstance.interceptors.request.use(
    (config) => {
        // ✅ Don't log FormData as it will be empty in console
        const logData = config.data instanceof FormData 
            ? 'FormData (cannot display)' 
            : config.data;
            
        console.log('🚀 [AXIOS REQUEST]', {
            method: config.method?.toUpperCase(),
            url: config.url,
            data: logData,
            headers: config.headers
        });
        
        // ✅ If data is FormData, remove the Content-Type header
        // Let browser set it with proper boundary
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }
        
        return config;
    },
    (error) => {
        console.error('❌ [AXIOS REQUEST ERROR]', error);
        return Promise.reject(error);
    }
);

// Response interceptor - FIXED LOGGING
axiosInstance.interceptors.response.use(
    (response) => {
        console.log('✅ [AXIOS RESPONSE]'
            ,
             {
            status: response.status,
            url: response.config.url,
            data: response.data
        });
        return response;
    },
    (error) => {
        console.error('❌ [AXIOS RESPONSE ERROR]', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            url: error.config?.url
        });

        if (error.response) {
            const { status, data } = error.response;
            
            switch (status) {
                case 401:
                    if (!window.location.pathname.includes('/login') && 
                        !window.location.pathname.includes('/signup')) {
                        toast.error('Session expired. Please login again.');
                        window.dispatchEvent(new CustomEvent('auth-logout'));
                    }
                    break;
                case 403:
                    toast.error('Access forbidden');
                    break;
                case 404:
                    toast.error('Resource not found');
                    break;
                case 500:
                    toast.error('Server error. Please try again later');
                    break;
                default:
                    if (data?.message) {
                        toast.error(data.message);
                    } else {
                        toast.error(error.message || 'Something went wrong');
                    }
            }
        } else if (error.request) {
            console.error('No response received:', error.request);
            toast.error('Network error. Please check your connection');
        } else {
            toast.error('Something went wrong. Please try again');
        }
        
        return Promise.reject(error);
    }
);

export default axiosInstance;