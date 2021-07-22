import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Story } from '../types'

interface Props {
  story: Story,
  myStack: boolean,
  deleteFunc?: (id: number) => Promise<void>
}

const StoryCard: React.FC<Props> = ({story, myStack, deleteFunc}) => {

  // format date to DD Mon YYYY ie. 20 Jun 2018
  const dateFormat = (dateStr: string) => {
    let dt = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    return dt.toLocaleDateString('en-gb', options);
  }

  return (
    <article className={`p-4 shadow-md rounded flex flex-col justify-between mt-4 sm:mt-0 border border-gray-200 ${story.photo_url !== null && 'row-span-2'}`}>

      <div>

        {/* avatar, user and date of story */}
        {!myStack && (
          <div className="flex justify-center mb-4">
            <div className="flex align-center">
              <svg viewBox="0 0 100 100" height="24" width="24" xmlns="http://www.w3.org/2000/svg" fill={story.avatar_color}>
                <circle cx="50%" cy="50%" r="50%" />
              </svg>
              <h3 className="inline-block ml-3">{story.email?.split('@')[0]}</h3>
            </div>
            <time className="ml-auto text-gray-400 text-sm">{dateFormat(story.date_added)}</time>
          </div>
        )}

        {/* title and content */}
        <h2 className="text-lg font-semibold mb-4">{story.title}</h2>

        {/* Photo */}
        { story.photo_url !== null && (
          <div className="mb-4 h-60 rounded overflow-hidden flex align-middle justify-center bg-gray-200">
            { console.log(story.photo_url)}
            {/* Next.js is having a problem with optimizing s3 images. https://github.com/vercel/next.js/issues/23523 supposed to be
            fixed with the next release of Next@canary for now, use unoptimized image.*/}
            <Image src={story.photo_url} alt="post's image" width={350} height={200} unoptimized={true} objectFit="contain" />
          </div>
        )}

        <pre style={{font: "inherit"}} className="mb-4 whitespace-pre-wrap">{story.content}</pre>

      </div>

      { myStack && (
        <div className="flex justify-center">
          <button className="rounded bg-red-200 text-gray-800 py-1 px-4 w-32 hover:bg-red-400 mr-8" onClick={() => deleteFunc!(story.id)}>Delete</button>
          <Link href={`/editpost/${story.id}`}><a className="rounded flex justify-center bg-blue-200 hover:bg-blue-500 text-gray-800 py-1 px-4 w-32">
            Edit
          </a></Link>
        </div>
      )}
    </article>
  )
}

export default StoryCard