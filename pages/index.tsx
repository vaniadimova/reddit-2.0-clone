import { useQuery } from '@apollo/client';
import type { NextPage } from 'next'
import Head from 'next/head'
import { GET_SUBREDDIT_WITH_LIMIT } from '../apollo/queries'
import Feed from '../components/Feed'
import SubredditRow from '../components/SubredditRow';
import PostBox from '../components/PostBox'



const Home: NextPage = () => {
  const { data } = useQuery(GET_SUBREDDIT_WITH_LIMIT, {
    variables: {
      limit: 10
    }
  })

const subreddits: Subreddit[] = data?.getSubredditListLimit;
   
  return (
<div className="max-w-5xl mx-auto my-7">
<Head>
    <title>Reddit 2.0 Clone</title>
     <link rel="icon" href="/favicon.ico" />
  </Head>
<PostBox />
<div className='flex'>
  <Feed />
  <div className="sticky top-36 mx-5 mt-5 hidden h-fit min-w-[300px] rounded-md border border-gray-300 bg-white lg:inline">
    <p className="p-4 pb-3 mb-1 font-bold text-md">Top Communities</p> 
    <div>
      {/* List subreddits */}
      {subreddits?.map((subreddit, i) => (
              <SubredditRow key={subreddit.id} topic={subreddit.topic} index={i} />
            ))}   
    </div>
  </div>
  </div>
</div>
  )
}

export default Home
