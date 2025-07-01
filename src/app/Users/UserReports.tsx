import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  PieChart,
  MapPin,
  ShoppingBag,
  Briefcase,
  GraduationCap,
  Globe,
} from "lucide-react";

export default function UserReports() {
  const [searchTerm] = useState("");
  
  const navigate = useNavigate();

  // Report categories with their respective reports
  const reportCategories = [
    {
      id: "demographic",
      name: "Demographic Insights",
      icon: <Users size={20} />,
      description: "Understand your user base by age, gender, income, and more",
      reports: [
        {
          id: "age-distribution",
          name: "Age Distribution",
          icon: <PieChart size={16} />,
          path: "/user-reports/demographic/age-distribution",
        },
        {
          id: "gender-breakdown",
          name: "Gender Breakdown",
          icon: <PieChart size={16} />,
          path: "/user-reports/demographic/gender-breakdown",
        },
        {
          id: "education-levels",
          name: "Education Levels",
          icon: <GraduationCap size={16} />,
          path: "/user-reports/demographic/education-levels",
        },
        {
          id: "occupation-analysis",
          name: "Occupation Analysis",
          icon: <Briefcase size={16} />,
          path: "/user-reports/demographic/occupation-analysis",
        },
      ],
    },

    {
      id: "behavioral",
      name: "Behavioral Analytics",
      icon: <ShoppingBag size={20} />,
      description:
        "Track user actions, purchase patterns, and engagement metrics",
      reports: [
       
        {
          id: "behavioral-analytics",
          name: "Behavioral Analytics",
          icon: <PieChart size={16} />,
          path: "/user-reports/behavioral-analytics",
        },
        
      ],
    },
    // {
    //   id: "firmographic",
    //   name: "Business & Firmographic",
    //   icon: <Building2 size={20} />,
    //   description: "Analyze business customers by industry, size, and revenue",
    //   reports: [
    //     {
    //       id: "company-size",
    //       name: "Company Size Distribution",
    //       icon: <Users size={16} />,
    //       path: "/user-reports/firmographic/company-size",
    //     },
    //     {
    //       id: "industry-breakdown",
    //       name: "Industry Breakdown",
    //       icon: <Briefcase size={16} />,
    //       path: "/user-reports/firmographic/industry-breakdown",
    //     },
    //     {
    //       id: "job-function",
    //       name: "Job Function Analysis",
    //       icon: <Briefcase size={16} />,
    //       path: "/user-reports/firmographic/job-function",
    //     },
    //     {
    //       id: "annual-revenue",
    //       name: "Annual Revenue Segments",
    //       icon: <DollarSign size={16} />,
    //       path: "/user-reports/firmographic/annual-revenue",
    //     },
    //     {
    //       id: "business-type",
    //       name: "Business Type Categories",
    //       icon: <Building2 size={16} />,
    //       path: "/user-reports/firmographic/business-type",
    //     },
    //   ],
    // },
    {
      id: "geographic",
      name: "Geographic Distribution",
      icon: <MapPin size={20} />,
      description:
        "View user distribution across regions, countries, and cities",
      reports: [
        {
          id: "country-distribution",
          name: "Country & Regional Distribution",
          icon: <Globe size={16} />,
          path: "/user-reports/geographic",
        },
      ],
    },
    // {
    //   id: "psychographic",
    //   name: "Psychographic Profiles",
    //   icon: <Lightbulb size={20} />,
    //   description:
    //     "Understand user interests, values, and lifestyle preferences",
    //   reports: [
    //     {
    //       id: "interest-categories",
    //       name: "Interest Categories",
    //       icon: <Heart size={16} />,
    //       path: "/user-reports/psychographic/interest-categories",
    //     },
    //     {
    //       id: "lifestyle-segments",
    //       name: "Lifestyle Segments",
    //       icon: <Heart size={16} />,
    //       path: "/user-reports/psychographic/lifestyle-segments",
    //     },
    //     {
    //       id: "hobby-clusters",
    //       name: "Hobby Clusters",
    //       icon: <Heart size={16} />,
    //       path: "/user-reports/psychographic/hobby-clusters",
    //     },
    //   ],
    // },
  ];

  // Filter reports based on search term
  const filteredCategories = reportCategories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.reports.some((report) =>
        report.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            User Reports
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Comprehensive analytics and insights about user base
          </p>
        </div>

        {/* <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full md:w-64 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
          />
        </div> */}
      </div>

      {/* Featured Reports Section */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Featured Reports
        </h2>
        
      </div>

      {/* Report Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <div
            key={category.id}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden"
          >
            <div className="p-5 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-2">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mr-3">
                  {category.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {category.name}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {category.description}
              </p>
            </div>

            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {category.reports.map((report) => (
                <button
                  key={report.id}
                  onClick={() => report.path && navigate(report.path)}
                  className="w-full text-left px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div className="text-gray-500 dark:text-gray-400 mr-3">
                      {report.icon}
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {report.name}
                    </span>
                  </div>
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
