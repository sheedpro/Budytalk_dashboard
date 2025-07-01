import { ReactNode, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Share2, Filter } from 'lucide-react';
import { 
  FacebookShareButton, 
  TwitterShareButton, 
  LinkedinShareButton, 
  WhatsappShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
  EmailIcon
} from 'react-share';

interface ReportLayoutProps {
  title: string;
  description: string;
  category: string;
  children: ReactNode;
}

export default function ReportLayout({
  title,
  description,
  category,
  children
}: ReportLayoutProps) {
  const [lastUpdated, setLastUpdated] = useState<string>(() => {
    const savedTime = localStorage.getItem('lastUpdated');
    return savedTime ? savedTime : 'Never';
  });

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const shareUrl = window.location.href;

  useEffect(() => {
    const currentTime = new Date().toLocaleString();
    setLastUpdated(currentTime);
    localStorage.setItem('lastUpdated', currentTime);
  }, []);

  const toggleShareModal = () => {
    setIsShareModalOpen(!isShareModalOpen);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            to="/user-reports"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span>Back to Reports</span>
          </Link>
        </div>

        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">{category}</div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{description}</p>
              <div className="text-sm text-gray-500 dark:text-gray-500 mt-2">Last updated: {lastUpdated}</div>
            </div>

            <div className="flex space-x-3">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </button>
              <button
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                onClick={toggleShareModal}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </button>
             
            </div>
          </div>
        </div>

        {/* Share Modal */}
        {isShareModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Share this Report</h2>
              <div className="flex justify-center space-x-4">
                <FacebookShareButton url={shareUrl}>
                  <FacebookIcon size={40} round />
                </FacebookShareButton>
                <TwitterShareButton url={shareUrl} title={title}>
                  <TwitterIcon size={40} round />
                </TwitterShareButton>
                <LinkedinShareButton url={shareUrl} title={title} summary={description}>
                  <LinkedinIcon size={40} round />
                </LinkedinShareButton>
                <WhatsappShareButton url={shareUrl} title={title}>
                  <WhatsappIcon size={40} round />
                </WhatsappShareButton>
                <EmailShareButton url={shareUrl} subject={title} body={description}>
                  <EmailIcon size={40} round />
                </EmailShareButton>
              </div>
              <div className="mt-4 flex justify-center">
                <button
                  onClick={toggleShareModal}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          {children}
        </div>
      </div>
    </div>
  );
}