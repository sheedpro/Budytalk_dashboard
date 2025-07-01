import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Vote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog } from "@/components/ui/dialog";
import { DialogContent } from "@/components/ui/dialog";
import { usePosts } from "@/hooks/usePosts";
import { useDispatch } from "react-redux";

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
  UserProfile?: Record<string, unknown> | null;
  following?: { id: string; isConnectionAccepted: boolean }[];
  followers?: { id: string; isConnectionAccepted: boolean }[];
}

interface ReactionData {
  optionIndex: string;
  user: {
    about: string | null;
    firstName: string | null;
    id: string;
    lastName: string | null;
    position: string;
    profilePhoto: string;
    username: string | null;
  };
}

interface Reaction {
  created_at: string;
  updated_at: string;
  id: string;
  user_id: string;
  kind: string;
  activity_id: string;
  data: ReactionData;
  parent: string;
  latest_children: Record<string, unknown[]>;
  children_counts: Record<string, number>;
}

interface Poll {
  actor: string;
  author: User;
  content: string;
  foreign_id: string;
  id: string;
  latest_reactions: Record<string, Reaction[]>;
  latest_reactions_extra: Record<string, { next: string }>;
  object: string;
  origin: string | null;
  poll_id?: string;
  options?: string[];
  questionSettings?: {
    pollDuration: string;
    visibility: string;
  };
  reaction_counts: Record<string, number>;
  target: string;
  time: string;
  verb: string;
}

// Poll Card Component
const PollCard: React.FC<{ poll: Poll; onView: () => void }> = ({ poll, onView }) => {
  return (
    <Card className="w-full hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage src={poll.author.profilePhotoUrl || ""} alt={poll.author.firstName || "User"} />
          <AvatarFallback>{poll.author.firstName?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{poll.author.firstName} {poll.author.lastName}</p>
          <p className="text-sm text-gray-500">{new Date(poll.time).toLocaleString()}</p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-800 font-semibold">{poll.content}</p>
        <div className="mt-2 space-y-2">
          {poll.options?.map((option, index) => (
            <div key={index} className="p-2 bg-gray-100 rounded-md">
              {option}
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-4">
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <Vote className="h-4 w-4" /> {poll.reaction_counts.vote || 0}
          </Button>
          <Button variant="outline" size="sm" className="ml-auto" onClick={onView}>
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Poll Detail Component
const PollDetail: React.FC<{ poll: Poll | null }> = ({ poll }) => {
  if (!poll) return null;
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage src={poll.author.profilePhotoUrl || ""} alt={poll.author.firstName || "User"} />
          <AvatarFallback>{poll.author.firstName?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{poll.author.firstName} {poll.author.lastName}</p>
          <p className="text-sm text-gray-500">{new Date(poll.time).toLocaleString()}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-800 font-semibold">{poll.content}</p>
        <div className="space-y-2">
          {poll.options?.map((option, index) => (
            <div key={index} className="p-2 bg-gray-100 rounded-md flex justify-between">
              <span>{option}</span>
              <span>{poll.latest_reactions.vote?.filter(v => v.data.optionIndex === index.toString()).length || 0} votes</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <Vote className="h-4 w-4" /> {poll.reaction_counts.vote || 0} Total Votes
        </div>
        <p className="text-sm text-gray-500">Poll Duration: {poll.questionSettings?.pollDuration} days</p>
      </CardContent>
    </Card>
  );
};

// Polls Table Component
const PollsTable: React.FC<{ polls: Poll[]; onView: (poll: Poll) => void }> = ({ polls, onView }) => (
  <Card className="w-full">
    <CardHeader>
      <CardTitle>Polls</CardTitle>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Author</TableHead>
            <TableHead>Question</TableHead>
            <TableHead>Votes</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {polls.map((poll) => (
            <TableRow key={poll.id}>
              <TableCell>{poll.author.firstName} {poll.author.lastName}</TableCell>
              <TableCell>{poll?.content?.slice(0, 50)}...</TableCell>
              <TableCell>{poll.reaction_counts.vote || 0}</TableCell>
              <TableCell>{new Date(poll.time).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" onClick={() => onView(poll)}>View</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

// Main Polls Dashboard Component
const PollsDashboard: React.FC = () => {
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);
  const [open, setOpen] = useState(false);
  const { posts, makePostCalls } = usePosts();
  const dispatch = useDispatch();
  const polls = posts?.filter((post) => post.verb === "poll") as Poll[];

  useEffect(() => {
    makePostCalls.fetchPosts(dispatch);
  }, []);

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Polls Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {polls?.map((poll) => (
          <PollCard key={poll.id} poll={poll} onView={() => {
            setSelectedPoll(poll);
            setOpen(true);
          }} />
        ))}
      </div>
      <PollsTable polls={polls || []} onView={setSelectedPoll} />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <PollDetail poll={selectedPoll} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PollsDashboard;