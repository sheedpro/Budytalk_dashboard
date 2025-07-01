
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/Redux/store";
import { apiRequests } from "@/context/apiRequests";
import { setPosts } from "@/Redux/slices/PostSlice";

interface User {
  id: string;
  email: string;
  user_name: string | null;
  firstName: string | null;
  lastName: string | null;
  profilePhotoUrl?: string | null;
  // Add other user fields as needed
}

interface PostContent {
  links: string[];
  media: string[];
  text: string;
}

interface Post {
  actor: string;
  author: User;
  content: PostContent | string;
  // Add other post fields as needed
}

export const usePosts = () => {
  const posts = useSelector((state: RootState) => state.posts.posts);

  const makePostCalls = {
    fetchPosts: async (dispatch: AppDispatch) => {
      try {
        const response = await apiRequests.getPosts();
        dispatch(setPosts(response.data.data.activities.results));
        console.log("Fetched posts", response.data.data.activities.results);
        return response.data;
      } catch (error) {
        console.error("Error fetching posts:", error);
        throw error;
      }
    },
    // Add more post-related API calls as needed
  };

  return {
    posts,
    makePostCalls,
  };
};
