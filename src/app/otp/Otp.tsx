import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import OtpInput from "react-otp-input";
import { apiRequests } from "@/context/apiRequests";
import { Button } from "@/components/ui/button";

const AdminOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(59);
  const [inputSize, setInputSize] = useState({ width: 56, height: 56 }); // Dynamic size in pixels

  // Dynamically adjust input size based on screen width
  useEffect(() => {
    const updateInputSize = () => {
      const screenWidth = window.innerWidth;

      // Calculate input size based on screen width
      if (screenWidth < 400) {
        setInputSize({ width: 40, height: 40 }); // Very small screens
      } else if (screenWidth < 640) {
        setInputSize({ width: 48, height: 48 }); // Mobile screens
      } else if (screenWidth < 1024) {
        setInputSize({ width: 56, height: 56 }); // Tablets and small desktops
      } else {
        setInputSize({ width: 64, height: 64 }); // Larger screens
      }
    };

    updateInputSize();
    window.addEventListener("resize", updateInputSize);

    return () => {
      window.removeEventListener("resize", updateInputSize);
    };
  }, []);

  // Timer functionality
  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds((prev) => prev - 1);
      } else if (minutes > 0) {
        setMinutes((prev) => prev - 1);
        setSeconds(59);
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds, minutes]);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await apiRequests.post("password/verify-otp", { email, otp });
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    if (minutes > 0 || seconds > 0) return;

    setLoading(true);
    try {
      await apiRequests.post("password/send-otp", { email });
      setMinutes(1);
      setSeconds(59);
      setError("");
      alert("OTP has been resent to your email");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  // Responsive spacing adjustments
  const containerClass = inputSize.width < 48 ? "gap-0.5" : "gap-1";
  const separatorClass = inputSize.width < 48 ? "mx-0.5" : "mx-1";

  return (
    <div className="flex min-h-screen items-center justify-center bg-purple-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg space-y-6 rounded-2xl bg-white p-6 sm:p-8 shadow-lg border border-purple-100">
        <h1 className="text-2xl sm:text-3xl text-purple-900 font-bold text-center tracking-tight">
          Verify OTP
        </h1>

        {error && (
          <div className="p-3 rounded-md bg-red-50 border border-red-200">
            <p className="text-red-600 text-sm text-center">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <p className="text-purple-900 text-sm sm:text-base text-center">
            OTP sent to: <strong>{email}</strong>
          </p>

          <div className="flex justify-center">
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderSeparator={<span className={separatorClass}>-</span>}
              containerStyle={`flex ${containerClass} justify-center`}
              shouldAutoFocus={true}
              inputType="tel"
              renderInput={(props) => (
                <input
                  {...props}
                  className="border-2 border-gray-300 rounded-lg text-center text-lg 
                  focus:border-purple-600 focus:ring-2 focus:ring-purple-600 focus:outline-none
                  transition-all duration-200 
                  hover:border-purple-400"
                  style={{
                    width: `${inputSize.width}px`,
                    height: `${inputSize.height}px`,
                    borderRadius: "8px",
                    fontSize: inputSize.width < 48 ? "16px" : "18px", // Adjust font size for smaller inputs
                  }}
                  maxLength={1}
                  aria-label="OTP digit input"
                />
              )}
            />
          </div>

          <div className="text-purple-900 text-sm sm:text-base text-center">
            {minutes > 0 || seconds > 0 ? (
              <p>
                Time Remaining:{" "}
                <span className="font-semibold">
                  {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                </span>
              </p>
            ) : (
              <p className="text-red-600">Time expired! Request a new OTP.</p>
            )}
          </div>

          <div className="space-y-3">
            <Button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-purple-900 hover:bg-purple-800 text-white disabled:opacity-70 rounded-lg py-3 text-base sm:text-lg font-medium transition-all duration-200"
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
                  Verifying...
                </div>
              ) : (
                "Verify OTP"
              )}
            </Button>

            <Button
              type="button"
              onClick={resendOTP}
              disabled={minutes > 0 || seconds > 0 || loading}
              className={`w-full ${
                minutes > 0 || seconds > 0 || loading
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-purple-100 hover:bg-purple-200 text-purple-900"
              } rounded-lg py-3 text-base sm:text-lg font-medium transition-all duration-200`}
            >
              Resend OTP
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminOtp;