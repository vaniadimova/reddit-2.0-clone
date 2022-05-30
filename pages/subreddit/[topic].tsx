import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import Avatar from '../../components/Avatar';
import Feed from '../../components/Feed';
import PostBox from '../../components/PostBox';

function Subreddit() {
  const {
    query: { topic }
  } = useRouter();

  return (
    <div className={`h-24 bg-red-400 p-8`}>
      <Head>
        <title>Reddit - r/{topic}</title>
      </Head>
      <div className="mt-10 -mx-8 bg-white">
        <div className="flex items-center max-w-5xl pb-3 mx-auto space-x-4">
          <div className="-mt-5">
            <Avatar seed={topic as string} large />
          </div>
          <div className="py-2">
            <h1 className="text-3xl font-semibold">Welcome to the r/{topic} subreddit</h1>
            <p className="text-sm text-gray-400">r/{topic}</p>
          </div>
        </div>
      </div>
      <div className="max-w-5xl pb-10 mx-auto mt-8">
        <PostBox subreddit={topic as string} />
        <Feed topic={topic as string} />
      </div>
    </div>
  );
}

export default Subreddit;