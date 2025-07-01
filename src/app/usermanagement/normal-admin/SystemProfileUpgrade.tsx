import React, { useState, useEffect } from "react";
import { apiRequests } from "@/context/apiRequests";
import { useNavigate } from "react-router-dom";

export default function SystemProfileUpgrade() {
  const [firstName, setFirstName] = useState(""); // Changed from fullName
  const [lastName, setLastName] = useState("");   // Added lastName
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await apiRequests.getUserProfile();
        const profileData = response.profile;
        
        // Split full_name into first_name and last_name if full_name exists
        const fullName = profileData.full_name || "";
        const nameParts = fullName.trim().split(" ");
        const firstNameFromFull = nameParts[0] || "";
        const lastNameFromFull = nameParts.slice(1).join(" ") || "";

        setFirstName(profileData.first_name || firstNameFromFull);
        setLastName(profileData.last_name || lastNameFromFull);
        setDateOfBirth(profileData.date_of_birth || "");
        setPhone(profileData.phone || "");
        setGender(profileData.gender || "");
        setCountry(profileData.country || "");
        setRegion(profileData.region || "");
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setErrorMessage("Failed to load profile data");
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const validatePhone = (phoneNumber: string) => {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phoneNumber);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const sanitizedValue = value.replace(/[^\d\s-+]/g, '');
    setPhone(sanitizedValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePhone(phone)) {
      setErrorMessage("Please enter a valid phone number");
      return;
    }

    try {
      const profileData = {
        first_name: firstName, // Send first_name instead of full_name
        last_name: lastName,   // Send last_name
        date_of_birth: dateOfBirth,
        phone,
        gender,
        country,
        region,
      };
      
      const response = await apiRequests.addProfileDetails(profileData);
      console.log("Profile update response:", response);
      setSuccessMessage("Profile updated successfully");
      setErrorMessage("");
      navigate("/system-admin-profile");
    } catch (error) {
      console.error("Profile update error:", error);
      setErrorMessage((error as any).message || "An error occurred while updating");
      setSuccessMessage("");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-[#50266f]">Loading profile data...</div>
      </div>
    );
  }

  return (
    <div className="bg-white border-4 border-gray-200 rounded-lg shadow-lg mx-10 my-10">
      <div className="flex items-start justify-between p-5 border-b border-gray-200 rounded-t">
        <h3 className="text-xl font-semibold text-gray-800">
          Edit Profile Details
        </h3>
      </div>
      <div className="p-6 space-y-6">
        <form onSubmit={handleSubmit} method="POST">
          <div className="grid grid-cols-6 gap-6">
            {/* First Name */}
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="first_name"
                className="block mb-2 text-sm font-medium text-[#50266f]"
              >
                First Name
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                className="w-full p-2.5 bg-[#50266f]/10 border border-[#50266f]/30 rounded-lg text-sm text-[#50266f] focus:ring-[#50266f] focus:border-[#50266f] shadow-sm"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                style={{ height: '44px' }}
              />
            </div>

            {/* Last Name */}
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="last_name"
                className="block mb-2 text-sm font-medium text-[#50266f]"
              >
                Last Name
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                className="w-full p-2.5 bg-[#50266f]/10 border border-[#50266f]/30 rounded-lg text-sm text-[#50266f] focus:ring-[#50266f] focus:border-[#50266f] shadow-sm"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                style={{ height: '44px' }}
              />
            </div>

            {/* Date of Birth */}
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="date"
                className="block text-sm font-medium text-[#50266f] mb-2"
              >
                Date of Birth
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="date"
                  name="date"
                  className="block w-full rounded-lg border border-[#50266f]/30 bg-[#50266f]/10 text-sm text-[#50266f] focus:border-[#50266f] focus:ring-[#50266f] p-3 shadow-sm"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  style={{ height: '44px' }}
                />
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-[#50266f]/70"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 9h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Phone Number */}
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="phone"
                className="block mb-2 text-sm font-medium text-[#50266f]"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="w-full p-2.5 bg-[#50266f]/10 border border-[#50266f]/30 rounded-lg text-sm text-[#50266f] focus:ring-[#50266f] focus:border-[#50266f] shadow-sm"
                placeholder="+1 234 567 8900"
                value={phone}
                onChange={handlePhoneChange}
                required
                style={{ height: '44px' }}
              />
              <p className="mt-1 text-xs text-[#50266f]">Format: +[country code] [number]</p>
            </div>

            {/* Gender */}
            {/* <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="gender"
                className="block mb-2 text-sm font-medium text-[#50266f]"
              >
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                className="w-full p-2.5 bg-[#50266f]/10 border border-[#50266f]/30 rounded-lg text-sm text-[#50266f] focus:ring-[#50266f] focus:border-[#50266f] shadow-sm"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                style={{ height: '44px' }}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div> */}

            {/* Country */}
            {/* <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="country"
                className="block mb-2 text-sm font-medium text-[#50266f]"
              >
                Country
              </label>
              <input
                type="text"
                id="country"
                name="country"
                className="w-full p-2.5 bg-[#50266f]/10 border border-[#50266f]/30 rounded-lg text-sm text-[#50266f] focus:ring-[#50266f] focus:border-[#50266f] shadow-sm"
                placeholder="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                style={{ height: '44px' }}
              />
            </div> */}

            {/* Region */}
            {/* <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="region"
                className="block mb-2 text-sm font-medium text-[#50266f]"
              >
                Region
              </label>
              <input
                type="text"
                id="region"
                name="region"
                className="w-full p-2.5 bg-[#50266f]/10 border border-[#50266f]/30 rounded-lg text-sm text-[#50266f] focus:ring-[#50266f] focus:border-[#50266f] shadow-sm"
                placeholder="Region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                style={{ height: '44px' }}
              />
            </div> */}
          </div>

          {/* Submit Button */}
          <div className="mt-6 border-t border-[#50266f]/20 pt-6">
            <button
              type="submit"
              className="w-full px-5 py-2.5 text-sm font-medium text-white bg-[#50266f] rounded-lg hover:bg-[#3d1c55] focus:ring-4 focus:ring-[#50266f]/20"
            >
              Update Profile
            </button>
            {errorMessage && (
              <p className="text-sm text-red-500 mt-2">{errorMessage}</p>
            )}
            {successMessage && (
              <p className="text-sm text-[#50266f] mt-2">{successMessage}</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}