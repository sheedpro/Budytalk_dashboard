import { BusinessProfile } from "./types";

const BusinessProfileSection = ({ profile, type }: { profile: BusinessProfile, type: 'buyer' | 'seller' }) => {
  const bgColor = type === 'buyer' ? 'bg-[#e9d8f0] dark:bg-[#50266f]' : 'bg-[#d9c4e6] dark:bg-[#50266f]';
  const titleColor = type === 'buyer' ? 'text-[#50266f] dark:text-[#d9c4e6]' : 'text-[#50266f] dark:text-[#d9c4e6]';

  const capitalize = (text: string) => {
    if (!text) return ''; // Check to handle null or undefined values
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  return (
    <div className={`p-6 rounded-lg ${bgColor} mt-6`}>
      <h2 className={`text-xl font-semibold mb-4 ${titleColor}`}>
        {type === 'buyer' ? 'Buyer' : 'Seller'} Profile
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Business Name</h3>
            <p>{capitalize(profile.b_name)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Business Email</h3>
            <p>{profile.b_email}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Business Phone</h3>
            <p>{capitalize(profile.b_phone)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Business Type</h3>
            <p>{capitalize(profile.b_type)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Website</h3>
            <p>{profile.b_website || 'Not provided'}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Contact Person</h3>
            <p>{capitalize(profile.p_full_name)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Job Title</h3>
            <p>{capitalize(profile.p_job_title)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</h3>
            <p>{capitalize(profile.p_phone)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">WhatsApp</h3>
            <p>{capitalize(profile.p_whatsap_number)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</h3>
            <p>{capitalize(profile.p_physical_address)}</p>
          </div>
        </div>

        <div className="md:col-span-2 space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Business Description</h3>
            <p className="mt-1">{capitalize(profile.b_description)}</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Employees</h3>
              <p>{profile.b_number_of_employee}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Established</h3>
              <p>{profile.b_year_of_established}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Registration</h3>
              <p>Stage {profile.registration_stage}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Found via</h3>
              <p>{capitalize(profile.noticed_us_from)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessProfileSection;