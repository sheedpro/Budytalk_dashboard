import React, { useState, useEffect } from "react";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import { apiRequests } from "@/context/apiRequests";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface CustomJwtPayload extends JwtPayload {
  scopes: string[];
}

interface ProfileData {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  phone: string;
  gender: string;
  country: string;
  region: string;
}

export default function ProfileRegistrationForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [, setUserScopes] = useState<string[]>([]);

  useEffect(() => {
    const getUserScopes = () => {
      try {
        const token = apiRequests.getToken();
        if (token) {
          const decodedToken = jwtDecode<CustomJwtPayload>(token);
          if (decodedToken.scopes && Array.isArray(decodedToken.scopes)) {
            setUserScopes(decodedToken.scopes);
          }
        }
      } catch (error) {
        console.error("Error getting user scopes:", error);
      }
    };

    getUserScopes();
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

  const handleCountryChange = (value: string) => {
    setCountry(value);
    if (!value) {
      setRegion("");
    }
  };

  const handleRegionChange = (value: string) => {
    setRegion(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!validatePhone(phone)) {
      setErrorMessage("Please enter a valid phone number");
      return;
    }
  
    try {
      const profileData: ProfileData = {
        first_name: firstName,
        last_name: lastName,
        date_of_birth: dateOfBirth,
        phone,
        gender,
        country,
        region,
      };

      await apiRequests.addProfileDetails(profileData);
      
      setSuccessMessage("Profile registered successfully");
      setErrorMessage("");

      // if (userScopes.length > 0) {
      //   navigate('/dashboard');
      // } else {
      //   setErrorMessage("No valid roles found for redirection");
      // }
    } catch (error) {
      console.error("Error during profile update:", error);
      setErrorMessage((error as any).message || "An error occurred");
      setSuccessMessage("");
    }
  };

  return (
    <div className="bg-white border-4 border-gray-200 rounded-lg shadow-lg mx-10 my-10">
      <div className="flex items-start justify-between p-5 border-b border-gray-200 rounded-t">
        <h3 className="text-xl font-semibold text-gray-800">
          Complete Profile Registration
        </h3>
      </div>
      <div className="p-6 space-y-6">
        <form onSubmit={handleSubmit} method="POST">
          <div className="grid grid-cols-6 gap-6">
            {/* First Name */}
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="first_name"
                className="block mb-2 text-sm font-medium text-purple-900"
              >
                First Name
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                className="w-full p-2.5 bg-purple-50 border border-purple-300 rounded-lg text-sm text-purple-900 focus:ring-purple-600 focus:border-purple-600 shadow-sm"
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
                className="block mb-2 text-sm font-medium text-purple-900"
              >
                Last Name
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                className="w-full p-2.5 bg-purple-50 border border-purple-300 rounded-lg text-sm text-purple-900 focus:ring-purple-600 focus:border-purple-600 shadow-sm"
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
                className="block text-sm font-medium text-purple-700 mb-2"
              >
                Date of Birth
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="date"
                  name="date"
                  className="block w-full rounded-lg border border-purple-300 bg-purple-50 text-sm text-purple-800 focus:border-purple-500 focus:ring-purple-500 p-3 shadow-sm"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  required
                  style={{ height: '44px' }}
                />
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-purple-400"
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
                className="block mb-2 text-sm font-medium text-purple-900"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="w-full p-2.5 bg-purple-50 border border-purple-300 rounded-lg text-sm text-purple-900 focus:ring-purple-600 focus:border-purple-600 shadow-sm"
                placeholder="+1 234 567 8900"
                value={phone}
                onChange={handlePhoneChange}
                required
                style={{ height: '44px' }}
              />
              <p className="mt-1 text-xs text-purple-500">Format: +[country code] [number]</p>
            </div>

            {/* Gender */}
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="gender"
                className="block mb-2 text-sm font-medium text-purple-900"
              >
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                className="w-full p-2.5 bg-purple-50 border border-purple-300 rounded-lg text-sm text-purple-900 focus:ring-purple-600 focus:border-purple-600 shadow-sm"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
                style={{ height: '44px' }}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Country */}
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="country"
                className="block mb-2 text-sm font-medium text-purple-900"
              >
                Country
              </label>
              <CountryDropdown
                id="country"
                name="country"
                value={country}
                onChange={handleCountryChange}
                className="w-full p-2.5 bg-purple-50 border border-purple-300 rounded-lg text-sm text-purple-900 focus:ring-purple-600 focus:border-purple-600 shadow-sm"
                style={{ height: '44px' }}
                required
              />
            </div>

            {/* Region */}
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="location"
                className="block mb-2 text-sm font-medium text-purple-900"
              >
                Region
              </label>
              <RegionDropdown
                country={country}
                value={region}
                onChange={handleRegionChange}
                className="w-full p-2.5 bg-purple-50 border border-purple-300 rounded-lg text-sm text-purple-900 focus:ring-purple-600 focus:border-purple-600 shadow-sm"
                style={{ height: '44px' }}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6 border-t border-purple-200 pt-6">
            <button
              type="submit"
              className="w-full px-5 py-2.5 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:ring-4 focus:ring-purple-200"
            >
              Save
            </button>
            {errorMessage && (
              <p className="text-sm text-red-500 mt-2">{errorMessage}</p>
            )}
            {successMessage && (
              <p className="text-sm text-purple-500 mt-2">{successMessage}</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}