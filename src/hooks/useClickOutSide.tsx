import { useEffect } from "react";


export const useClickOutside = (ref: React.RefObject<HTMLElement>, callback: () => void) => {
    useEffect(() => {
      const handleClick = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          callback();
          console.log("is outside click")
        }
      };
  
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }, [ref, callback]);
  };
