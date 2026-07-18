import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
    logoutUser, 
    selectUser, 
    selectIsAuthenticated,
    selectIsLoading,
    clearUser
} from '@/features/auth/authSlice';

export const useAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const user = useSelector(selectUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const isLoading = useSelector(selectIsLoading);

    const logout = useCallback(async () => {
        try {
            await dispatch(logoutUser()).unwrap();
            navigate('/login');
        } catch (error) {
           // console.error('Logout failed:', error);
           
        }
    }, [dispatch, navigate]);

    const clearSession = useCallback(() => {
        dispatch(clearUser());
        navigate('/login');
    }, [dispatch, navigate]);

    return {
        user,
        isAuthenticated,
        isLoading,
        logout,
        clearSession
    };
};