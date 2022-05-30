import React, { useEffect, useState } from 'react'
import { 
    ArrowDownIcon, 
    ArrowUpIcon,
    BookmarkIcon,
    ChatAltIcon,
    DotsHorizontalIcon,
    GiftIcon,
    ShareIcon
} from '@heroicons/react/solid'
import TimeAgo from 'react-timeago';
import { Jelly } from '@uiball/loaders';
import Avatar from './Avatar'
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ALL_VOTES_BY_POST_ID } from '../apollo/queries';
import { ADD_VOTE } from '../apollo/mutations';


type Props = {
    post: Post
}

function Post({ post } : Props) {
  const [vote, setVote] = useState<boolean>(); 
  const { data: session } = useSession();

  const { data, loading } = useQuery(GET_ALL_VOTES_BY_POST_ID, {
    variables: {
      post_id: post?.id
    }
  })

const [addVote] = useMutation(ADD_VOTE, {
 refetchQueries: [GET_ALL_VOTES_BY_POST_ID, 'getAllVotesByPostId']
}) 
  
  const upVote = async (isUpvote: boolean) => {
    if (!session) {
      toast('You need to Sign In first!');
      return;
  }

  if (vote && isUpvote) return;
  if (vote === false && !isUpvote) return;

  console.log('voting...', isUpvote)
  
  await addVote({
    variables: {
      post_id: post.id,
      username: session?.user?.name,
      upvote: isUpvote
      }
    });
  }
  
useEffect(() => {
const votes: Vote[] = data?.getVotesByPostId;
  
const vote = votes?.find((vote) => vote.username == session?.user?. name)?.upvote;
  setVote(vote);
  }, [data]);
 
  const displayVotes = (data: any) => {
    const votes: Vote[] = data?.getVotesByPostId;
    const displayNumber = votes?.reduce(
      (total, vote) => (vote.upvote ? (total += 1) : (total -= 1)),
      0
    );

    if (votes?.length === 0) return 0;

    if (displayNumber === 0) {
      return votes[0]?.upvote ? 1 : -1;
    }

    return displayNumber;
  };  
  
  if (!post)
    return (
      <div className="flex items-center justify-center w-full p-10 text-xl">
        <Jelly size={50} color="#ff4501" />
      </div>
    );
    
return (
<Link href={`/post/${post.id}`}>     
<div className="flex bg-white border border-gray-300 rounded-md shadow-sm cursor-pointer hover:border hover:border-gray-600">
    {/* Votes */}
<div className="flex flex-col items-center justify-start w-12 p-4 space-y-1 text-gray-400 rounded-l-md bg-gray-50">
  <ArrowUpIcon 
     onClick={() => upVote(true)}
     className={`voteButtons hover:text-red-400 ${vote && 'text-blue-400'}`} />
    <p className="text-xs font-bold text-black">{displayVotes(data)}</p>
   <ArrowDownIcon 
   onClick={() => upVote(false)} 
   className={`voteButtons hover:text-blue-400 ${vote === false && 'text-red-400'}`}  
   />
</div>
<div className="p-3 pb-1">
     {/* Header */}
     <div className="flex items-center space-x-2">
         <Avatar seed={post.subreddit[0]?.topic} />
         <p className="text-xs text-gray-400 ">
           <Link href={`/subreddit/${post.subreddit[0]?.topic}`}>
               <span className='font-bold text-black hover:text-blue-500 hover:underline'>
                   r/{post.subreddit[0]?.topic}
               </span> 
               </Link>
               . Posted by u/
               {post.username} <TimeAgo date={post.created_at} />
         </p>
     </div>
     
     <div className="py-4">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="mt-2 text-sm font-light">{post.body}</p>
          </div>   
         {/* Image */}
         <div className="" >
            {post.image && (
              <img src={post.image} alt="image" className="" />
            )}
          </div> 
           <div className="flex mt-2 space-x-4 text-gray-400">
            <div className="postButtons">
              <ChatAltIcon className="w-6 h-6" />
              <p>{post.comments.length} Comments</p>
            </div>
            <div className="postButtons">
              <GiftIcon className="w-6 h-6" />
              <p className="hidden sm:inline">{post.comments.length} Award</p>
            </div>
            <div className="postButtons">
              <ShareIcon className="w-6 h-6" />
              <p className="hidden sm:inline">{post.comments.length} Share</p>
            </div>
            <div className="postButtons">
              <BookmarkIcon className="w-6 h-6" />
              <p className="hidden sm:inline">{post.comments.length} Save</p>
            </div>        
      
          <div className="postButtons">
              <DotsHorizontalIcon className="w-6 h-6" />
                </div>
            </div>       
        </div>
    </div>
</Link>
  )  
}

export default Post