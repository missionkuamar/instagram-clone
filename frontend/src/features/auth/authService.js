import axiosInstance from '../../services/axiosInstance';
import { handleApiError, showSuccess } from '../../services/errorHandler';

export const authService = {
    register: async (userData) => {
        console.log('🔵 [SERVICE] Register function called with data:', userData);
        
        try {
            console.log('📝 [SERVICE] Register attempt:', { 
                ...userData, 
                password: '***' 
            });
            
            const response = await axiosInstance.post('/user/register', userData);
            
            console.log('✅ [SERVICE] Registration successful:', {
                status: response.status,
                message: response.data.message,
                fullResponse: response.data
            });
            
            showSuccess(response.data.message);
            return { 
                success: true, 
                data: response.data,
                message: response.data.message 
            };
        } catch (error) {
            console.error('❌ [SERVICE] Registration failed:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            
            const errorMessage = handleApiError(error);
            return { 
                success: false, 
                error: errorMessage,
                data: null 
            };
        }
    },

    login: async (credentials) => {
        console.log('🔵 [SERVICE] Login function called with:', credentials.email);
        
        try {
            console.log('🔐 [SERVICE] Login attempt:', { 
                email: credentials.email,
                timestamp: new Date().toISOString()
            });
            
            const response = await axiosInstance.post('/user/login', credentials);
            
            console.log('✅ [SERVICE] Login successful:', {
                status: response.status,
                user: response.data.user,
                message: response.data.message
            });
            
            showSuccess(response.data.message);
            return { 
                success: true, 
                data: response.data,
                user: response.data.user,
                message: response.data.message 
            };
        } catch (error) {
            console.error('❌ [SERVICE] Login failed:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            
            const errorMessage = handleApiError(error);
            return { 
                success: false, 
                error: errorMessage,
                data: null 
            };
        }
    },

    logout: async () => {
    console.log('🔵 [SERVICE] Logout function called');
    
    try {
        console.log('🚪 [SERVICE] Logout attempt');
        
        const response = await axiosInstance.post('/user/logout');
        
        console.log('✅ [SERVICE] Logout successful:', {
            status: response.status,
            message: response.data.message,
            fullResponse: response.data
        });
        
        showSuccess(response.data.message);
        return { 
            success: true, 
            data: response.data,
            message: response.data.message 
        };
    } catch (error) {
        console.error('❌ [SERVICE] Logout failed - FULL ERROR:', error);
        console.error('Error response:', error.response);
        console.error('Error status:', error.response?.status);
        console.error('Error data:', error.response?.data);
        console.error('Error message:', error.message);
        
        // Don't use handleApiError yet, log the actual error first
        const errorMessage = error.response?.data?.message || error.message || 'Logout failed';
        
        return { 
            success: false, 
            error: errorMessage,
            data: null 
        };
    }
}
};