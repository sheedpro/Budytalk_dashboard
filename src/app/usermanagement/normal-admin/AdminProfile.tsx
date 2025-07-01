import React, { useRef, useState, useEffect } from "react";
import { Upload } from "lucide-react";
import { apiRequests } from "@/context/apiRequests";
import { useNavigate } from "react-router-dom";
import { IMAGE_BASE_URL, PLACEHOLDER_IMAGE_URL } from "@/context/apiRequests";

const AdminProfile = () => {
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    full_name: "",
    date_of_birth: "",
    gender: "",
    country: "",
    region: "",
    email: "",
    phone: "",
    location: "",
    picture: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Basic client-side validation
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        setError('Please upload a valid image (JPEG, PNG, GIF, WEBP)');
        setSuccessMessage('');
        return;
      }

      if (file.size > maxSize) {
        setError('Image size must be less than 5MB');
        setSuccessMessage('');
        return;
      }

      try {
        setLoading(true);
        const result = await apiRequests.uploadProfilePicture(file);

        setSuccessMessage('Profile picture updated successfully');
        setError('');

        // Update the profile picture in state
        setProfile(prev => ({
          ...prev,
          picture: result.picture_url || `${IMAGE_BASE_URL}${result.picture_path}` || PLACEHOLDER_IMAGE_URL
        }));
      } catch (error: any) {
        setError(error.message || 'Failed to upload image');
        setSuccessMessage('');
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await apiRequests.getUserProfile();


      const profileData = response.profile || response.data || response;

      // Use the full_name directly from the API response
      const fullName = profileData.full_name || "";

      // If we need to split full_name into first and last name components
      let firstName = "";
      let lastName = "";

      if (fullName) {
        const nameParts = fullName.split(" ");
        firstName = nameParts[0] || "";
        lastName = nameParts.slice(1).join(" ") || "";
      }


      setProfile({
        first_name: firstName,
        last_name: lastName,
        full_name: fullName, // Use the original full_name from API
        date_of_birth: profileData.date_of_birth || "",
        gender: profileData.gender || "",
        country: profileData.country || "",
        region: profileData.region || "",
        email: profileData.email || "",
        phone: profileData.phone || "",
        location: profileData.location || "",
        picture: profileData.picture
          ? `${IMAGE_BASE_URL}${profileData.picture}`
          : PLACEHOLDER_IMAGE_URL,
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
      // Use email name part as fallback
      return profile.email.split('@')[0];
    } else {
      return "Not specified";
    }
  };

  const capitalizeFirstLetter = (string: string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
            {successMessage}
          </div>
        )}

        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 text-center mb-8 md:mb-0">
            <div className="relative group">
              <div className="relative w-48 h-48 mx-auto">
                <img
                  src={profile.picture || "/api/placeholder/300/300"}
                  alt="Profile Picture"
                  className="rounded-full w-48 h-48 object-cover border-4 border-purple-900 dark:border-purple-800 transition-all duration-300 group-hover:brightness-75"
                />

                <div
                  onClick={handleImageClick}
                  className="absolute inset-0 flex items-center justify-center cursor-pointer bg-transparent group-hover:bg-black/30 transition-all duration-300"
                >
                  <div className="opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            <h1 className="text-2xl font-bold text-purple-900 dark:text-white mb-2">
              {displayName()}
            </h1>
            <button
              onClick={() => navigate("/profile-edit-form")}
              className="mt-4 bg-purple-900 text-white px-4 py-2 rounded-lg hover:bg-purple-800 transition-colors duration-300"
            >
              Edit Profile
            </button>
          </div>

          <div className="md:w-2/3 md:pl-8">
            <h2 className="text-xl font-semibold text-purple-900 dark:text-white mb-4">
              Basic Information
            </h2>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300 mb-6">
              <li>
                <strong>Full Name: </strong>
                {profile.full_name ? capitalizeFirstLetter(profile.full_name) : "Not specified"}
              </li>
              <li>
                <strong>Date of Birth:</strong> {formatDate(profile.date_of_birth)}
              </li>
              <li>
                <strong>Gender:</strong> {profile.gender ? capitalizeFirstLetter(profile.gender) : "Not specified"}
              </li>
              <li>
                <strong>Country:</strong> {profile.country ? capitalizeFirstLetter(profile.country) : "Not specified"}
              </li>
              <li>
                <strong>Region:</strong> {profile.region ? capitalizeFirstLetter(profile.region) : "Not specified"}
              </li>
            </ul>

            <h2 className="text-xl font-semibold text-purple-900 dark:text-white mb-4">
              Contact Information
            </h2>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              {profile.email && (
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-purple-900 dark:text-purple-800"
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
                    className="h-5 w-5 mr-2 text-purple-900 dark:text-purple-800"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 011.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  {profile.phone}
                </li>
              )}
              {profile.region && (
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-purple-900 dark:text-purple-800"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {capitalizeFirstLetter(profile.region)}
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;