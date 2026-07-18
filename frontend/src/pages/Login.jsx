import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError, selectIsLoading, selectAuthError, selectIsAuthenticated } from '@/features/auth/authSlice';

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: ""
    });
    
    const isLoading = useSelector(selectIsLoading);
    const error = useSelector(selectAuthError);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
        if (error) dispatch(clearError());
    }

    const loginHandler = async (e) => {
        e.preventDefault();
        
        if (!input.email || !input.password) {
            toast.error('Please fill in all fields');
            return;
        }

        const result = await dispatch(loginUser(input)).unwrap();
        
        if (result) {
            navigate("/");
            setInput({ email: "", password: "" });
        }
    }

    useEffect(() => {
      //  console.log('🔄 Login component mounted');
        if (isAuthenticated) {
          //  console.log('👤 User already logged in, redirecting to home');
            navigate("/");
        }
        
        return () => {
           // console.log('🔚 Login component unmounted');
        };
    }, [isAuthenticated, navigate]);

    return (
        <div className='flex items-center w-screen h-screen justify-center bg-gray-50'>
            <form onSubmit={loginHandler} className='shadow-lg flex flex-col gap-5 p-8 bg-white rounded-lg w-96'>
                <div className='my-4'>
                    <h1 className='text-center font-bold text-2xl'>📸 Instagram</h1>
                    <p className='text-sm text-center text-gray-600 mt-2'>
                        Login to see photos & videos from your friends
                    </p>
                </div>
                
                <div>
                    <span className='font-medium'>Email</span>
                    <Input
                        type="email"
                        name="email"
                        value={input.email}
                        onChange={changeEventHandler}
                        placeholder="Enter your email"
                        className="focus-visible:ring-transparent my-2"
                        disabled={isLoading}
                    />
                </div>
                
                <div>
                    <span className='font-medium'>Password</span>
                    <Input
                        type="password"
                        name="password"
                        value={input.password}
                        onChange={changeEventHandler}
                        placeholder="Enter your password"
                        className="focus-visible:ring-transparent my-2"
                        disabled={isLoading}
                    />
                </div>
                
                {error && (
                    <div className='text-red-500 text-sm text-center bg-red-50 p-2 rounded'>
                        {error}
                    </div>
                )}
                
                {isLoading ? (
                    <Button disabled>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Please wait...
                    </Button>
                ) : (
                    <Button type='submit' className='w-full bg-gray-200'>
                        Login
                    </Button>
                )}

                <span className='text-center text-sm'>
                    Don't have an account? <Link to="/signup" className='text-blue-600 hover:underline'>Signup</Link>
                </span>
            </form>
        </div>
    );
};

export default Login;