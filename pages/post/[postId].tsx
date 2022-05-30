
import { useMutation, useQuery } from '@apollo/client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { ADD_COMMENT } from '../../apollo/mutations';
import { GET_POST_BY_POST_ID } from '../../apollo/queries';
import Avatar from '../../components/Avatar';
import Post from '../../components/Post';
import TimeAgo from 'react-timeago';
import Head from 'next/head';

type FormData = {
    comment: string;
  };

function PostPage() {
    const router = useRouter();
    const { data: session } = useSession();

const [addComment] = useMutation(ADD_COMMENT, {
    refetchQueries: [GET_POST_BY_POST_ID, 'getPostByPostId']
})
    
    const {data} = useQuery(GET_POST_BY_POST_ID, {
        variables: {
            post_id: router.query.postId
        }
    })

const  post: Post = data?.getPostListByPostId;

const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const notification = toast.loading('Posting Your Comment...');

    await addComment({
        variables: {
          post_id: router.query.postId,
          username: session?.user?.name,
          text: data.comment
        }  
  })
  
  setValue('comment', '')
  toast.success('Comment Successfully Posted!', {
       id: notification 
    });
  }
  console.log(data)

return (
<div className="max-w-5xl mx-auto my-7">
<Head>
    <title>Reddit - {post?.title}</title>
</Head>   
<Post post={post} />

<div className="p-5 pl-16 -mt-1 bg-white border border-t-0 border-gray-300 rounded-b-md">
<p className="text-sm">
     Comment as <span className="text-red-500">{session?.user?.name}</span>
</p>   
<form onSubmit={handleSubmit(onSubmit)}   className="flex flex-col space-y-2">
    <textarea 
     {...register('comment')}
     disabled={!session}
     className="h-24 p-2 pl-4 border border-gray-200 rounded-md outline-none disabled:bg-gray-50"  
     placeholder={session ? 'What are your thought?' : 'Please sign in to comment.'} 
    />
 <button
    disabled={!session}
    type="submit"
    className="p-3 font-semibold text-white bg-red-500 rounded-full disabled:bg-gray-200">
        Comment
</button>   
</form>
</div>
<div className="px-10 py-5 -mt-5 bg-white border border-t-0 border-gray-300 rounded-b-md">
<hr className="py-2 " />
{post?.comments.map((comment) => (
<div className="relative flex items-center space-x-2 space-y-5" key={comment.id}>
    <hr className="absolute z-0 h-16 border top-10 left-7" />
        <div className="z-50">
              <Avatar seed={comment.username} />
            </div>
            <div className="flex flex-col ">
              <p className="py-2 text-gray-400 text-x5">
            <span className="font-semibold text-gray-600">{comment.username}</span> •{' '}
                <TimeAgo date={comment.created_at} />
              </p>
              <p>{comment.text}</p>
            </div>
          </div>
        ))}
    </div>
</div>
  )
}

export default PostPage