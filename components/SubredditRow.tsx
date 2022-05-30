import React from 'react'
import {  ChevronUpIcon} from '@heroicons/react/outline';
import Avatar from './Avatar';
import Link from 'next/link';

type Props = {
  topic: string;
  index: number;
}

function SubredditRow({ index, topic }: Props) {
  return (
    <div className="flex items-center px-4 py-2 space-x-2 bg-white border-t last:rounded-b">
    <p>{index + 1}</p>
    <ChevronUpIcon className="flex-shrink-0 w-4 h-4 text-blue-400" />
    <Avatar seed={`/subreddit/${topic}`} />
    <p className="flex-1 truncate">r/{topic}</p>
    <Link href={`/subreddit/${topic}`}>
      <div className="px-3 text-white bg-blue-500 rounded-full cursor-pointer">View</div>
    </Link>
  </div>
  )
}

export default SubredditRow