import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { MessageSquare, ThumbsUp, Share2, Bookmark } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePosts } from "@/hooks/usePosts";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { DialogContent } from "@/components/ui/dialog";
import { Dialog } from "@/components/ui/dialog";

// Types
interface User {
  id: string;
  email: string;
  user_name: string | null;
  firstName: string | null;
  lastName: string | null;
  password?: string;
  country?: string | null;
  position?: string | null;
  company?: string | null;
  role?: string;
  about?: string | null;
  userBio?: string | null;
  birthDate?: string | null;
  profilePhotoUrl?: string | null;
  gender?: string | null;
  coverPhotoUrl?: string | null;
  phone_Number?: string | null;
  location?: string | null;
  userHeadline?: string | null;
  username?: string | null;
  currentPosition?: string | null;
  industry?: string | null;
  websiteUrl?: string | null;
  fcm_token?: string | null;
  authenticationSource?: string;
  dateCreated?: string;
  headLine?: string | null;
  city?: string | null;
  UserProfile?: any | null;
  following?: { id: string; isConnectionAccepted: boolean }[];
  followers?: { id: string; isConnectionAccepted: boolean }[];
}

interface Reaction {
  created_at: string;
  updated_at: string;
  id: string;
  user_id: string;
  kind: string;
  activity_id: string;
  data: any;
  parent: string;
  latest_children: Record<string, any[]>;
  children_counts: Record<string, number>;
}

interface PostContent {
  links: string[];
  media: string[];
  text: string;
}

interface PostSettings {
  commentSettings: string;
  visibility: string;
}

interface Post {
  actor: string;
  author: User;
  content: PostContent | string;
  foreign_id: string;
  id: string;
  latest_reactions: Record<string, Reaction[]>;
  latest_reactions_extra: Record<string, { next: string }>;
  object: string;
  origin: string | null;
  postSettings: PostSettings;
  post_id: string;
  reaction_counts: Record<string, number>;
  target: string;
  time: string;
  totalLikes: number;
  totalcomments: number;
  verb: string;
}

// Mock data
const mockPosts: Post[] = [
  {
    actor: "post:1071866c-8219-4cc0-8667-8fe7d67f669f",
    author: {
      about: null,
      email: "san12williams@gmail.com",
      firstName: "williams",
      id: "1071866c-8219-4cc0-8667-8fe7d67f669f",
      lastName: "favourt",
      profilePhotoUrl: "link to url",
      user_name: null,
    },
    content: {
      links: [],
      media: [],
      text: "sfsdfsdf",
    },
    foreign_id: "post:3451747e-b4a9-4751-b387-b866840f55ad",
    id: "af7cfe00-3724-11f0-8080-80017656638b",
    latest_reactions: {},
    latest_reactions_extra: {},
    object: "post:3451747e-b4a9-4751-b387-b866840f55ad",
    origin: null,
    postSettings: {
      commentSettings: "Everyone",
      visibility: "Everyone",
    },
    post_id: "3451747e-b4a9-4751-b387-b866840f55ad",
    reaction_counts: {},
    target: "",
    time: "2025-05-22T15:51:55.104000",
    totalLikes: 0,
    totalcomments: 0,
    verb: "post",
  },
  {
    actor: "post:1071866c-8219-4cc0-8667-8fe7d67f669f",
    author: {
      about: null,
      email: "san12williams@gmail.com",
      firstName: "williams",
      id: "1071866c-8219-4cc0-8667-8fe7d67f669f",
      lastName: "favourt",
      profilePhotoUrl: "link to url",
      user_name: null,
    },
    content: {
      links: [],
      media: [],
      text: "\"Without him I don't know where we'd be\" 🌟\n\nPlayer-of-the-match Alisson and match-winner Harvey Elliott look back on Liverpool's performance against PSG, and the advantage they take back to Anfield 🏟️\n",
    },
    foreign_id: "post:f032fdb3-0aea-4e7c-8434-4b76a41eac86",
    id: "4fd07380-28b8-11f0-8080-800070c2d273",
    latest_reactions: {
      comment: [
        {
          created_at: "2025-05-07T13:36:02.638170Z",
          updated_at: "2025-05-07T13:36:02.638170Z",
          id: "15e15caa-9670-4bc6-95bc-bf8a350428b7",
          user_id: "1071866c-8219-4cc0-8667-8fe7d67f669f",
          kind: "comment",
          activity_id: "4fd07380-28b8-11f0-8080-800070c2d273",
          data: {
            text: { text: "@williams how do u say soo" },
            user: {
              about: null,
              firstName: "williams",
              id: "1071866c-8219-4cc0-8667-8fe7d67f669f",
              lastName: "favourt",
              position: "software",
              profilePhoto: "link to url",
              username: null,
            },
          },
          parent: "",
          latest_children: {
            reply: [
              {
                created_at: "2025-05-07T13:36:47.127111Z",
                updated_at: "2025-05-07T13:36:47.127111Z",
                id: "aec36087-f20c-44c9-9304-3bef1efc7ae0",
                user_id: "1071866c-8219-4cc0-8667-8fe7d67f669f",
                kind: "reply",
                activity_id: "4fd07380-28b8-11f0-8080-800070c2d273",
                data: {
                  text: { text: "@williams yeah" },
                  user: {
                    id: "1071866c-8219-4cc0-8667-8fe7d67f669f",
                    profilePhoto: "link to url",
                    username: null,
                  },
                },
                parent: "15e15caa-9670-4bc6-95bc-bf8a350428b7",
                latest_children: {},
                children_counts: {},
              },
            ],
          },
          children_counts: { reply: 1 },
        },
        {
          created_at: "2025-05-07T13:35:47.017821Z",
          updated_at: "2025-05-07T13:35:47.017821Z",
          id: "a1b3bc54-955b-4982-bf42-8f24f817d440",
          user_id: "1071866c-8219-4cc0-8667-8fe7d67f669f",
          kind: "comment",
          activity_id: "4fd07380-28b8-11f0-8080-800070c2d273",
          data: {
            text: { text: "thiis is not true" },
            user: {
              about: null,
              firstName: "williams",
              id: "1071866c-8219-4cc0-8667-8fe7d67f669f",
              lastName: "favourt",
              position: "software",
              profilePhoto: "link to url",
              username: null,
            },
          },
          parent: "",
          latest_children: {},
          children_counts: {},
        },
      ],
      like: [
        {
          created_at: "2025-05-17T16:10:38.269414Z",
          updated_at: "2025-05-17T16:10:38.269414Z",
          id: "c358e16d-5214-4539-8c16-ee46ef5d1357",
          user_id: "1071866c-8219-4cc0-8667-8fe7d67f669f",
          kind: "like",
          activity_id: "4fd07380-28b8-11f0-8080-800070c2d273",
          data: {
            likeType: "love",
            user: {
              about: null,
              firstName: "williams",
              id: "1071866c-8219-4cc0-8667-8fe7d67f669f",
              lastName: "favourt",
              position: "software",
              profilePhoto: "link to url",
              username: null,
            },
          },
          parent: "",
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: "2025-05-17T16:10:33.455413Z",
          updated_at: "2025-05-17T16:10:33.455413Z",
          id: "805cb17d-adf5-4574-9d8e-3030707a49af",
          user_id: "1071866c-8219-4cc0-8667-8fe7d67f669f",
          kind: "like",
          activity_id: "4fd07380-28b8-11f0-8080-800070c2d273",
          data: {
            likeType: "love",
            user: {
              about: null,
              firstName: "williams",
              id: "1071866c-8219-4cc0-8667-8fe7d67f669f",
              lastName: "favourt",
              position: "software",
              profilePhoto: "link to url",
              username: null,
            },
          },
          parent: "",
          latest_children: {},
          children_counts: {},
        },
      ],
      rePostWithComment: [
        {
          created_at: "2025-05-05T05:20:22.967793Z",
          updated_at: "2025-05-05T05:20:22.967793Z",
          id: "cb7c85e2-1d8d-4c29-b515-9ca6068b326f",
          user_id: "07b0b9d8-5c66-4ddc-9692-c15ff15c8b75",
          kind: "rePostWithComment",
          activity_id: "4fd07380-28b8-11f0-8080-800070c2d273",
          data: {
            text: "this is a repost",
            user: {
              about: null,
              firstName: "Tester",
              id: "07b0b9d8-5c66-4ddc-9692-c15ff15c8b75",
              lastName: "Userr",
              position: "Software dev",
              profilePhoto: "https://hvovlppbabgyvicrvczi.supabase.co/storage/v1/object/public/profilePictures/thedeveloperbl0og@gmail.com/1737993218244.jpeg",
              username: "testguy",
            },
          },
          parent: "",
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: "2025-05-05T05:15:29.440607Z",
          updated_at: "2025-05-05T05:15:29.440607Z",
          id: "17cd3939-f0bc-464e-8286-250104693641",
          user_id: "07b0b9d8-5c66-4ddc-9692-c15ff15c8b75",
          kind: "rePostWithComment",
          activity_id: "4fd07380-28b8-11f0-8080-800070c2d273",
          data: {
            text: "this is a repost",
            user: {
              about: null,
              authenticationSource: "Self",
              birthDate: null,
              city: null,
              company: "Company",
              country: "uganda",
              coverPhotoUrl: null,
              currentPosition: null,
              dateCreated: "2025-01-27T12:52:58.565Z",
              email: "thedeveloperbl0og@gmail.com",
              fcm_token: null,
              firstName: "Tester",
              gender: null,
              headLine: null,
              id: "07b0b9d8-5c66-4ddc-9692-c15ff15c8b75",
              lastName: "Userr",
              location: null,
              password: "$2b$12$uMl3VXLFKrqRZe1mvtVZUOBMV3uhLlxjuHTmak./5PGAXfQWNA7UC",
              phone_Number: "0774323035",
              position: "Software dev",
              profilePhotoUrl: "https://hvovlppbabgyvicrvczi.supabase.co/storage/v1/object/public/profilePictures/thedeveloper- bl0og@gmail.com/1737993218244.jpeg",
              role: "User",
              userBio: "About",
              userHeadline: null,
              user_name: "testguy",
              username: null,
              websiteUrl: null,
            },
          },
          parent: "",
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: "2025-05-04T08:32:22.505678Z",
          updated_at: "2025-05-04T08:32:22.505678Z",
          id: "6113478d-41f4-488e-8832-180b02c22dd1",
          user_id: "1071866c-8219-4cc0-8667-8fe7d67f669f",
          kind: "rePostWithComment",
          activity_id: "4fd07380-28b8-11f0-8080-800070c2d273",
          data: { text: "This is the" },
          parent: "",
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: "2025-05-04T08:11:56.796418Z",
          updated_at: "2025-05-04T08:11:56.796418Z",
          id: "45192f7d-c532-4fd9-9fad-940f961b8239",
          user_id: "1071866c-8219-4cc0-8667-8fe7d67f669f",
          kind: "rePostWithComment",
          activity_id: "4fd07380-28b8-11f0-8080-800070c2d273",
          data: { text: "this is a repost" },
          parent: "",
          latest_children: {},
          children_counts: {},
        },
      ],
      reShare: [
        {
          created_at: "2025-05-05T04:45:15.321578Z",
          updated_at: "2025-05-05T04:45:15.321578Z",
          id: "49664dec-dff4-4114-b627-dc7c42279a73",
          user_id: "1071866c-8219-4cc0-8667-8fe7d67f669f",
          kind: "reShare",
          activity_id: "4fd07380-28b8-11f0-8080-800070c2d273",
          data: {},
          parent: "",
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: "2025-05-04T08:32:03.934741Z",
          updated_at: "2025-05-04T08:32:03.934741Z",
          id: "27994b98-a402-40f7-b5d9-6a0d90faa9a8",
          user_id: "1071866c-8219-4cc0-8667-8fe7d67f669f",
          kind: "reShare",
          activity_id: "4fd07380-28b8-11f0-8080-800070c2d273",
          data: {},
          parent: "",
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: "2025-05-04T08:20:35.243340Z",
          updated_at: "2025-05-04T08:20:35.243340Z",
          id: "bdb772b9-a405-41d0-b11f-c321492d7990",
          user_id: "1071866c-8219-4cc0-8667-8fe7d67f669f",
          kind: "reShare",
          activity_id: "4fd07380-28b8-11f0-8080-800070c2d273",
          data: {},
          parent: "",
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: "2025-05-04T08:17:00.483864Z",
          updated_at: "2025-05-04T08:17:00.483864Z",
          id: "c7287520-70d5-47bb-a6bc-714560404c9f",
          user_id: "1071866c-8219-4cc0-8667-8fe7d67f669f",
          kind: "reShare",
          activity_id: "4fd07380-28b8-11f0-8080-800070c2d273",
          data: {},
          parent: "",
          latest_children: {},
          children_counts: {},
        },
      ],
      save: [
        {
          created_at: "2025-05-07T13:32:44.119183Z",
          updated_at: "2025-05-07T13:32:44.119183Z",
          id: "4707bb18-a176-4ff8-9bf9-42dac070b707",
          user_id: "1071866c-8219-4cc0-8667-8fe7d67f669f",
          kind: "save",
          activity_id: "4fd07380-28b8-11f0-8080-800070c2d273",
          data: {},
          parent: "",
          latest_children: {},
          children_counts: {},
        },
      ],
    },
    latest_reactions_extra: {
      comment: { next: "" },
      like: { next: "" },
      rePostWithComment: { next: "" },
      reShare: { next: "" },
      save: { next: "" },
    },
    object: "post:f032fdb3-0aea-4e7c-8434-4b76a41eac86",
    origin: null,
    postSettings: {
      commentSettings: "Everyone",
      visibility: "Everyone",
    },
    post_id: "f032fdb3-0aea-4e7c-8434-4b76a41eac86",
    reaction_counts: {
      comment: 2,
      like: 2,
      rePostWithComment: 4,
      reShare: 4,
      save: 1,
    },
    target: "",
    time: "2025-05-04T07:20:52.664000",
    totalLikes: 0,
    totalcomments: 0,
    verb: "post",
  },
];

// Post Card Component
const PostCard: React.FC<{ post: Post; onView: () => void }> = ({ post, onView }) => {
  const content = typeof post?.content === "string" ? post.content : post?.content?.text;
  return (
    <Card className="w-full hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage src={post?.author?.profilePhotoUrl || ""} alt={post?.author?.firstName || "User"} />
          <AvatarFallback>{post?.author?.firstName?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{post?.author?.firstName} {post?.author?.lastName}</p>
          <p className="text-sm text-gray-500">{new Date(post.time).toLocaleString()}</p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-800 whitespace-pre-line">{content}</p>
        <div className="flex gap-4 mt-4">
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <ThumbsUp className="h-4 w-4" /> {post?.reaction_counts.like || 0}
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" /> {post.reaction_counts.comment || 0}
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <Share2 className="h-4 w-4" /> {post?.reaction_counts.reShare || 0}
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <Bookmark className="h-4 w-4" /> {post?.reaction_counts.save || 0}
          </Button>
          <Button variant="outline" size="sm" className="ml-auto" onClick={onView}>
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Post Detail Component
const PostDetail: React.FC<{ post: Post | null} > = ({ post }) => {
  if (!post) return null;
  const content = typeof post.content === "string" ? post.content : post.content.text;
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage src={post.author.profilePhotoUrl || ""} alt={post.author.firstName || "User"} />
          <AvatarFallback>{post.author.firstName?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{post.author.firstName} {post.author.lastName}</p>
          <p className="text-sm text-gray-500">{new Date(post.time).toLocaleString()}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-800 whitespace-pre-line">{content}</p>
        <div className="flex gap-4">
          <div className="flex items-center gap-1">
            <ThumbsUp className="h-4 w-4" /> {post.reaction_counts.like || 0} Likes
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" /> {post.reaction_counts.comment || 0} Comments
          </div>
          <div className="flex items-center gap-1">
            <Share2 className="h-4 w-4" /> {post.reaction_counts.reShare || 0} Shares
          </div>
          <div className="flex items-center gap-1">
            <Bookmark className="h-4 w-4" /> {post.reaction_counts.save || 0} Saves
          </div>
        </div>
        {post.latest_reactions.comment?.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold">Comments</h3>
            {post.latest_reactions.comment.map((comment) => (
              <div key={comment.id} className="p-2 bg-gray-50 rounded-md">
                <p className="text-sm">{comment.data.text.text}</p>
                {comment.latest_children.reply?.map((reply) => (
                  <p key={reply.id} className="text-sm text-gray-600 ml-4">↳ {reply.data.text.text}</p>
                ))}
              </div>
            ))}
          </div>
        )}
        {/* <Button onClick={onClose}>Close</Button> */}
      </CardContent>
    </Card>
  );
};

// Posts Table Component
const PostsTable: React.FC<{ posts: Post[]; onView: () => void }> = ({ posts, onView }) => (
  <Card className="w-full">
    <CardHeader>
      <CardTitle>Posts</CardTitle>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Author</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Likes</TableHead>
            <TableHead>Comments</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell>{post?.author?.firstName} {post?.author?.lastName}</TableCell>
              <TableCell>{typeof post?.content === "string" ? post?.content?.slice(0, 50) : post?.content?.text?.slice(0, 50)}...</TableCell>
              <TableCell>{post?.reaction_counts?.like || 0}</TableCell>
              <TableCell>{post?.reaction_counts?.comment || 0}</TableCell>
              <TableCell>{new Date(post?.time).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" onClick={onView}>View</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

// Main Posts Dashboard Component
const PostsDashboard: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [open, setOpen] = useState(false);
  const { posts, makePostCalls } = usePosts();
  const dispatch = useDispatch();
  useEffect(() => {
    makePostCalls.fetchPosts(dispatch);
  }, []);

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Posts Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts?.map((post) => (
          <PostCard key={post.id} post={post} onView={() => {
            setSelectedPost(post);
            setOpen(true);
          }} />
        ))}
      </div>
      <PostsTable posts={posts} onView={() => {
        setSelectedPost(selectedPost);
        setOpen(true);
      }} />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent> 
        <PostDetail post={selectedPost} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PostsDashboard;