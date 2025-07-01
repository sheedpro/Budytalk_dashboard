import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { apiRequests } from "@/context/apiRequests";

const RequestOtp: React.FC = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Trigger the OTP request API
            await apiRequests.post("password/send-otp", { email });

            // Redirect to the OTP verification page with the email as a prop
            navigate("/verify-otp", { state: { email } });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to send OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-purple-50">
            <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-lg border border-purple-100">
                <h1 className="text-2xl text-purple-900 font-bold text-center">Reset Password</h1>

                {/* Add error message display */}
                {error && (
                    <div className="p-3 rounded-md bg-red-50 border border-red-200">
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
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
                            required
                        />
                    </div>

                    <div className="mt-6">
                        <Button
                            type="submit"
                            className="w-full bg-purple-900 hover:bg-purple-800 text-white"
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
                                    Sending OTP...
                                </div>
                            ) : (
                                "Send OTP"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RequestOtp;