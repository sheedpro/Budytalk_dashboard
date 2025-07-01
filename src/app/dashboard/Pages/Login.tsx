import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { apiRequests } from "@/context/apiRequests";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Add loading state


    const handleLogin = async (email: string, password: string) => {
        setLoading(true);
        try{
         const response = await apiRequests.post('login', {email, password});
         localStorage.setItem('token', response.data.token);
         
         // Add these lines to store roles
         if (response.data.user && response.data.user.roles) {
           const userRoles = response.data.user.roles.map((role: { name: any; }) => role.name);
           localStorage.setItem('user_roles', JSON.stringify(userRoles));
         }
         
         navigate('/');
         return response.data;
        }catch(error){
         setError(error instanceof Error ? error.message : 'Login failed');
         throw error;
        }finally {
         setLoading(false);
        }
     };

    return (
        <div className="flex min-h-screen items-center justify-center bg-purple-50">
            <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-lg border border-purple-100">
                <h1 className="text-2xl text-purple-900 font-bold text-center">Farmsell Admin Login</h1>

                {/* Add error message display */}
                {error && (
                    <div className="p-3 rounded-md bg-red-50 border border-red-200">
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-purple-900">
                            Email Address
                        </label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="mt-1 text-black w-full focus:border-purple-600 focus:ring-purple-600"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-purple-900">
                            Password
                        </label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="mt-1 text-black w-full focus:border-purple-600 focus:ring-purple-600"
                        />
                    </div>

                    <div className="text-right">
                        <a href="/request-otp" className="text-sm text-purple-600 hover:underline">Forgot Password?</a>
                    </div>
                </div>

                <div className="mt-6">
                    <Button 
                        className="w-full bg-purple-900 hover:bg-purple-800 text-white" 
                        onClick={() => handleLogin(email, password)} 
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <svg
                                    className="animate-spin h-5 w-5 mr-3 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Logging in...
                            </div>
                        ) : (
                            "Login"
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Login;