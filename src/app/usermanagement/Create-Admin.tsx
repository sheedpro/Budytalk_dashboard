import { useState } from "react";
import { apiRequests } from "@/context/apiRequests";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const roleAliases: { [key: string]: string } = {
  user_accounts_manager: "User Accounts Manager",
  product_stock_manager: "Inventory & Stock Manager",
  order_placement_manager: "Order Management",
  order_fulfillment_manager: "Fulfillment Manager",
  returns_refunds_manager: "Returns & Refunds",
  customer_success_manager: "Customer Success",
  promotions_loyalty_manager: "Promotions & Loyalty",
  content_editorial_manager: "Content & Editorial",
  general_manager: "General Manager",
  "super-admin": "Systems Administrator"
};

const roles = [
  "user_accounts_manager",
  "product_stock_manager",
  "order_placement_manager",
  "order_fulfillment_manager",
  "returns_refunds_manager",
  "customer_success_manager",
  "promotions_loyalty_manager",
  "content_editorial_manager",
  "general_manager",
  "super-admin",
];

export default function AddAdmins() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([roles[0]]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: { target: { value: any; }; }) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (!validateEmail(newEmail)) {
      setEmailError("Invalid email address");
    } else {
      setEmailError("");
    }
  };

  const handleRoleToggle = (roleName: string) => {
    setSelectedRoles(prev => {
      if (prev.includes(roleName)) {
        return prev.filter(r => r !== roleName);
      } else {
        return [...prev, roleName];
      }
    });
  };

  const addAdministrator = async(
    first_name: string,
    last_name: string,
    email: string,
    role: string
  ) => {
    setLoading(true);
    try {
      const response = await apiRequests.post('add', {first_name, last_name, email, role});
      return response.data;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  }

  const handleAddAdmin = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (selectedRoles.length === 0) {
      setError("Please select at least one role");
      return;
    }
    setError("");
    setSuccess("");
    try {
      const response = await addAdministrator(
        firstName,
        lastName,
        email,
        selectedRoles[0]
      );
      console.log("Add admin response:", response);
      setSuccess("Admin registered successfully");
      setFirstName("");
      setLastName("");
      setEmail("");
      setSelectedRoles([roles[0]]);
    } catch (err: any) {
      console.error("Add admin error:", err);
      if (err instanceof Error) {
        setError(err.message || "Registration failed");
      } else {
        setError("Registration failed");
      }
    }
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-r from-white-600 to-gray-600 dark:from-white-900 dark:to-gray-900 px-4 py-8">
      <Card className="max-w-4xl w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-extrabold">Register Admin</CardTitle>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Add a new admin to your system. Ensure you use accurate details.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddAdmin} className="space-y-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:outline-none dark:bg-gray-700 dark:text-white transition-colors duration-200"
                    placeholder="Enter first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:outline-none dark:bg-gray-700 dark:text-white transition-colors duration-200"
                    placeholder="Enter last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:outline-none dark:bg-gray-700 dark:text-white transition-colors duration-200"
                  placeholder="Enter email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                />
                {emailError && <p className="text-sm text-red-500 dark:text-red-400 mt-2">{emailError}</p>}
              </div>
            </div>

            {/* Roles - Now below the personal info and horizontal */}
            <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Administrative Roles
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Select the appropriate roles for this administrator
              </p>
              <div className="flex flex-wrap gap-3">
                {roles.map((roleName) => (
                  <label
                    key={roleName}
                    className={`flex items-center p-3 rounded-lg transition-colors duration-200 cursor-pointer
                      ${selectedRoles.includes(roleName)
                        ? 'bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-500'
                        : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 border-2 border-transparent'
                      }`}
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={roleName}
                        name="roles"
                        value={roleName}
                        checked={selectedRoles.includes(roleName)}
                        onChange={() => handleRoleToggle(roleName)}
                        className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700"
                      />
                      <div className="ml-3">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {roleAliases[roleName]}
                        </span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Status and Submit Button */}
            <div className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}
              {success && (
                <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                  {success}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-purple-600 text-white font-bold text-lg rounded-xl shadow-md hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#50266f" }}
              >
                {loading ? "Registering..." : "Register Admin"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}