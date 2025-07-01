export const formatTimeDifference = (lastSeen: string | number | Date) => {
    const now = new Date();
    const lastSeenDate = new Date(lastSeen);
    const diffInSeconds = Math.floor((now.getTime() - lastSeenDate.getTime()) / 1000);
  
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minutes ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hours ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} days ago`;
    } else if (diffInSeconds < 2419200) {
      const weeks = Math.floor(diffInSeconds / 604800);
      return `${weeks} weeks ago`;
    } else if (diffInSeconds < 29030400) {
      const months = Math.floor(diffInSeconds / 2419200);
      return `${months} months ago`;
    } else {
      const years = Math.floor(diffInSeconds / 29030400);
      return `${years} years ago`;
    }
  };