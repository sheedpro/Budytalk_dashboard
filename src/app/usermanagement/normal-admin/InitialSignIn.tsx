import React, { useState } from "react";
import { apiRequests } from "@/context/apiRequests";
import { useNavigate } from "react-router-dom";

export default function AdminSignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Added loading state
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("Attempting login with:", { email, password });
      const response = await apiRequests.login({ email, password });
      const token = response.data.token;
      const user = response.data.user;

      // Store token and user data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Store roles if they exist in the response
      if (response.data.user && response.data.user.roles) {
        const userRoles = response.data.user.roles.map((role: { name: any }) => role.name);
        localStorage.setItem("user_roles", JSON.stringify(userRoles));
      } else if (response.data.roles) {
        // Alternative format in case roles are directly in response.data
        localStorage.setItem("user_roles", JSON.stringify(response.data.roles));
      }

      // Navigate to reset password
      navigate('/reset-password', { replace: true });

    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
      <div className="w-full mt-20 p-6 m-auto bg-white rounded-md shadow-md lg:max-w-xl">
        <h1 className="text-3xl font-semibold text-center text-purple-900 underline">
          Admin Login
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="mt-6">
          <div className="mb-2">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-800"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="block w-full px-4 py-2 mt-2 text-purple-900 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>

          <div className="mb-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-800"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full px-4 py-2 mt-2 text-purple-900 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className={`w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-900 rounded-md ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-800 focus:bg-purple-800'
              } focus:outline-none`}
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
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}