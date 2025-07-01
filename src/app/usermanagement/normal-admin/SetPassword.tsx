import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequests } from "@/context/apiRequests";

export default function PasswordReset() {
  const [fullName, setFullName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const response = await apiRequests.getUserProfile();
        console.log("Profile data:", response.profile); // Debug log
        setFullName(response.profile.full_name);
        console.log("Set full name to:", response.profile.full_name); // Debug log
      } catch (error) {
        console.error("Get user profile error:", error);
        setErrorMessage((error as any).message || "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  const validatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 9) strength += 30;
    if (/[A-Z]/.test(password)) strength += 10;
    if (/[a-z]/.test(password)) strength += 10;
    if (/[0-9]/.test(password)) strength += 10;
    if (/[^A-Za-z0-9]/.test(password)) strength += 10;
    setPasswordStrength(strength);
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setNewPassword(newPassword);
    validatePasswordStrength(newPassword);
    if (newPassword !== confirmNewPassword) {
      setErrorMessage("Passwords do not match");
    } else {
      setErrorMessage("");
    }
  };

  const handleConfirmNewPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newConfirmPassword = e.target.value;
    setConfirmNewPassword(newConfirmPassword);
    if (newConfirmPassword !== newPassword) {
      setErrorMessage("Passwords do not match");
    } else {
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiRequests.updatePassword({
        new_password: newPassword,
        new_password_confirmation: confirmNewPassword,
      });
      console.log("Update password response:", response); // Log the response
      setSuccessMessage(response.message);
      setErrorMessage("");
      navigate("/profile-update");
    } catch (error) {
      console.error("Update password error:", error); // Log the error
      setErrorMessage((error as any).message || "An error occurred");
      setSuccessMessage("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <main id="content" role="main" className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-2xl dark:bg-purple-900 px-8 py-6 max-w-md w-full transform transition-all duration-300 hover:scale-[1.01] animate-fade-in">
          <h1 className="text-3xl font-bold text-center mb-8 text-purple-800 dark:text-gray-200">
            Welcome {isLoading ? "..." : fullName}
          </h1>
          <h1 className="text-1xl font-bold text-center mb-8 text-indigo-800 dark:text-gray-200">
            Update Your Password
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-indigo-900 dark:text-gray-300 mb-2"
              >
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                className="shadow-sm rounded-lg w-full px-4 py-2.5 border border-purple-200 dark:border-purple-800 dark:text-purple-900 placeholder-purple-400 focus:outline-none focus:ring-2 dark:focus:ring-purple-900 transition-all duration-300"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={handleNewPasswordChange}
              />
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${
                      passwordStrength >= 60 ? "bg-purple-500" : "bg-red-500"
                    }`}
                    style={{ width: `${passwordStrength}%` }}
                  ></div>
                </div>
                <p className="text-sm text-red-500 mt-2">{errorMessage}</p>
              </div>
            </div>
            <div>
              <label
                htmlFor="confirmNewPassword"
                className="block text-sm font-medium text-indigo-900 dark:text-gray-300 mb-2"
              >
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmNewPassword"
                name="confirmNewPassword"
                className="shadow-sm rounded-lg w-full px-4 py-2.5 border border-purple-200 dark:border-purple-800 dark:text-purple-900 placeholder-purple-400 focus:outline-none focus:ring-2 dark:focus:ring-purple-900 transition-all duration-300"
                placeholder="Confirm your new password"
                value={confirmNewPassword}
                onChange={handleConfirmNewPasswordChange}
              />
              <p className="text-sm text-red-500 mt-2">{errorMessage}</p>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-800 hover:bg-purple-900 text-white font-bold py-2.5 rounded-lg transition-all duration-300"
              disabled={passwordStrength < 60 || errorMessage !== ""}
            >
              Update Password
            </button>
            {successMessage && (
              <p className="text-sm text-purple-500 mt-2">{successMessage}</p>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}