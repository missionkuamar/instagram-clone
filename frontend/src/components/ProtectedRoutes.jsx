import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoutes = ({ children }) => {
    const { user, isLoading } = useSelector(store => store.auth);
    const navigate = useNavigate();

    useEffect(() => {
        // Don't redirect while still loading auth state
        if (!isLoading && !user) {
          //  console.log('🔒 No user found, redirecting to login');
            navigate("/login");
        }
    }, [user, isLoading, navigate]);

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // If user exists, render children
    return user ? children : null;
};

export default ProtectedRoutes;