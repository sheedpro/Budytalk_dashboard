import { useState, useEffect } from "react";
import { apiRequests } from "@/context/apiRequests";
import { useNavigate } from "react-router-dom";

const SystemAdmin = () => {
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await apiRequests.getUserProfile();
      console.log("Profile data received:", response); // Log full response

      // Use `response.profile` instead of `response.data`
      const profileData = response.profile; // Matches your API structure

      // Ensure profileData exists before accessing properties
      if (!profileData) {
        throw new Error("Profile data not found in response");
      }

      // Use full_name directly from the API, or construct it from first_name and last_name if full_name is empty
      const fullName = profileData.full_name || `${profileData.first_name || ""} ${profileData.last_name || ""}`.trim();

      setProfile({
        full_name: fullName,
        email: profileData.email || "",
        phone: profileData.phone || "",
      });

      setError("");
    } catch (err) {
      setError("Failed to fetch profile data");
      console.error("Profile fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Function to display name with proper fallbacks
  const displayName = () => {
    if (profile.full_name && profile.full_name.trim() !== "") {
      return capitalizeFirstLetter(profile.full_name);
    } else if (profile.email) {
      return capitalizeFirstLetter(profile.email.split('@')[0]);
    } else {
      return "Not specified";
    }
  };

  const capitalizeFirstLetter = (string: string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-800 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full p-8 transition-all duration-300 animate-fade-in">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 text-center mb-8 md:mb-0">
            <h1 className="text-2xl font-bold text-[#50266f] dark:text-white mb-2">
              {displayName()}
            </h1>
            <button
              onClick={() => navigate("/system-profile-upgrade")}
              className="mt-4 bg-[#50266f] text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors duration-300"
            >
              Edit Profile
            </button>
          </div>

          <div className="md:w-2/3 md:pl-8">
            <h2 className="text-xl font-semibold text-[#50266f] dark:text-white mb-4">
              Basic Information
            </h2>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300 mb-6">
              <li>
                <strong>Full Name: </strong>
                {profile.full_name ? capitalizeFirstLetter(profile.full_name) : "Not specified"}
              </li>
            </ul>

            <h2 className="text-xl font-semibold text-[#50266f] dark:text-white mb-4">
              Contact Information
            </h2>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              {profile.email && (
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-[#50266f] dark:text-[#50266f]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  {profile.email}
                </li>
              )}
              {profile.phone && (
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-[#50266f] dark:text-[#50266f]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 011.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  {profile.phone}
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemAdmin;