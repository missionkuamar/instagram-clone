import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError, selectIsLoading, selectAuthError, selectIsAuthenticated } from '@/features/auth/authSlice';

const Signup = () => {
    const [input, setInput] = useState({
        username: "",
        email: "",
        password: ""
    });
    
    const isLoading = useSelector(selectIsLoading);
    const error = useSelector(selectAuthError);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
       // console.log('📝 Input changed:', e.target.name, '=', e.target.value);
        setInput({ ...input, [e.target.name]: e.target.value });
        if (error) dispatch(clearError());
    }

    const signupHandler = async (e) => {
        e.preventDefault();
        
       // console.log('🚀 Signup form submitted');
       // console.log('📊 Form data:', input);
        
        // Validation
        if (!input.username || !input.email || !input.password) {
         //   console.log('❌ Validation failed: Missing fields');
            toast.error('Please fill in all fields');
            return;
        }
        
        if (input.password.length < 6) {
          //  console.log('❌ Validation failed: Password too short');
            toast.error('Password must be at least 6 characters');
            return;
        }
        
        //console.log('✅ Validation passed, dispatching registerUser...');
        
        try {
            const result = await dispatch(registerUser(input)).unwrap();
           // console.log('🎉 Registration successful! Result:', result);
            
            toast.success('Account created successfully! Please login.');
            navigate("/login");
            setInput({ username: "", email: "", password: "" });
        } catch (error) {
            console.error('💥 Registration failed with error:', error);
            // Error is already handled by the slice and service
        }
    }

    useEffect(() => {
      //  console.log('📝 Signup component mounted');
        if (isAuthenticated) {
          ///  console.log('👤 User already logged in, redirecting to home');
            navigate("/");
        }
        
        return () => {
          //  console.log('🔚 Signup component unmounted');
        };
    }, [isAuthenticated, navigate]);

    return (
        <div className='flex items-center w-screen h-screen justify-center bg-gray-50'>
            <form onSubmit={signupHandler} className='shadow-lg flex flex-col gap-5 p-8 bg-white rounded-lg w-96'>
                <div className='my-4'>
                    <h1 className='text-center font-bold text-2xl'>📸 Instagram</h1>
                    <p className='text-sm text-center text-gray-600 mt-2'>
                        Signup to see photos & videos from your friends
                    </p>
                </div>
                
                <div>
                    <span className='font-medium'>Username</span>
                    <Input
                        type="text"
                        name="username"
                        value={input.username}
                        onChange={changeEventHandler}
                        placeholder="Choose a username"
                        className="focus-visible:ring-transparent my-2"
                        disabled={isLoading}
                    />
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
                        placeholder="Create a password"
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
                        Creating account...
                    </Button>
                ) : (
                    <Button type='submit' className='w-full bg-gray-200'>
                        Signup
                    </Button>
                )}
                
                <span className='text-center text-sm'>
                    Already have an account? <Link to="/login" className='text-blue-600 hover:underline'>Login</Link>
                </span>
            </form>
        </div>
    );
};

export default Signup;