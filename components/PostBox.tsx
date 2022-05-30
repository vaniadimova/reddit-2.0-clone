import { useSession } from 'next-auth/react';
import { LinkIcon, PhotographIcon } from '@heroicons/react/outline';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import toast from 'react-hot-toast';

import Avatar from './Avatar';
import { ADD_POST, ADD_SUBREDDIT } from './../apollo/mutations';
import client from '../apollo/apollo-client';
import { GET_ALL_POST, GET_SUBREDDIT_BY_TOPIC } from '../apollo/queries';

type FormData = {
  postTitle: string;
  postBody: string;
  postImage: string;
  subreddit: string;
};

type Props = {
  subreddit?: string;
};

function PostBox({ subreddit }: Props) {
  const { data: session } = useSession();
  const [imageBoxOpen, setImageBoxOpen] = useState(false);

  const [addPost] = useMutation(ADD_POST, {
    refetchQueries: [GET_ALL_POST, 'getPostList']
  });
  const [addSubreddit] = useMutation(ADD_SUBREDDIT);

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<FormData>();

  const onSubmit = handleSubmit(async (formData) => {
    const notification = toast.loading('Creating new Post...');

    try {
      const {
        data: { getSubredditListByTopic }
      } = await client.query({
        query: GET_SUBREDDIT_BY_TOPIC,
        variables: {
          topic: subreddit || formData.subreddit
        }
      });

      const subredditExist = getSubredditListByTopic.length > 0;

      if (!subredditExist) {
        const {
          data: { insertSubreddit: newSubreddit }
        } = await addSubreddit({
          variables: {
            topic: formData.subreddit
          }
        });
        const image = formData.postImage || '';

        const {
          data: { insertPost: newPost }
        } = await addPost({
          variables: {
            body: formData.postBody,
            image: image,
            subreddit_id: newSubreddit.id,
            title: formData.postTitle,
            username: session?.user?.name
          }
        });
      } else {
        const image = formData.postImage || '';
        const {
          data: { insertPost: newPost }
        } = await addPost({
          variables: {
            body: formData.postBody,
            image: image,
            subreddit_id: getSubredditListByTopic[0].id,
            title: formData.postTitle,
            username: session?.user?.name
          }
        });
      }
      setValue('postBody', '');
      setValue('postTitle', '');
      setValue('postImage', '');
      setValue('subreddit', '');

      toast.success('New Post Created!', {
        id: notification
      });
    } catch (error) {
      toast.error('Whoops! something went wrong.', {
        id: notification
      });
    }
  });

  return (
    <form
      onSubmit={onSubmit}
      className="sticky z-50 p-2 bg-white border border-gray-300 rounded-md top-20">
      <div className="flex items-center space-x-3 ">
        <Avatar seed="vaniadb" />
        <input
          {...register('postTitle', { required: true })}
          disabled={!session}
          className="flex-1 p-2 pl-5 rounded-md outline-none bg-gray-50"
          type="text"
          placeholder={
            session
              ? subreddit
                ? `Create a post in r/${subreddit}`
                : 'Create a post by entering a title!'
              : 'Sign in to post!'
          }
        />
        <PhotographIcon
          onClick={() => setImageBoxOpen(!imageBoxOpen)}
          className={`h-6 cursor-pointer text-gray-300 ${imageBoxOpen && 'text-blue-300'}`}
        />
        <LinkIcon className="h-6 text-gray-300 cursor-pointer" />
      </div>
      {!!watch('postTitle') && (
        <div className="flex flex-col py-2">
          <div className="flex items-center px-2">
            <p className="min-w-[90px]">Body:</p>
            <input
              className="flex-1 p-2 m-2 outline-none bg-blue-50"
              type="text"
              placeholder="Text (Optional)"
              {...register('postBody')}
            />
          </div>
          {!subreddit && (
            <div className="flex items-center px-2">
              <p className="min-w-[90px]">Subreddit:</p>
              <input
                className="flex-1 p-2 m-2 outline-none bg-blue-50"
                type="text"
                placeholder="i.e. reactjs"
                {...register('subreddit', { required: true })}
              />
            </div>
          )}

          {imageBoxOpen && (
            <div className="flex items-center px-2">
              <p className="min-w-[90px]">Image URL:</p>
              <input
                className="flex-1 p-2 m-2 outline-none bg-blue-50"
                type="text"
                placeholder="Optional..."
                {...register('postImage')}
              />
            </div>
          )}
          {Object.keys(errors).length > 0 && (
            <div className="p-2 space-y-2 text-red-500">
              {errors.postTitle?.type === 'required' && <p>- A post Title is required</p>}
              {errors.subreddit?.type === 'required' && <p>- A Subreddit is required</p>}
            </div>
          )}
          {!!watch('postTitle') && (
            <button type="submit" className="w-full p-2 text-white bg-blue-400 rounded-full">
              Create Post
            </button>
          )}
        </div>
      )}
    </form>
  );
}

export default PostBox;