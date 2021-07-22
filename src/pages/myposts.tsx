import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import StoryCard from '../components/StoryCard'
import Paginator from '../components/Paginator'
import { useAuthContext } from '../components/auth/AuthProvider'
import API from '../utils/api'
import { Story, StoriesData } from '../types'

const MyPosts: React.FC = () => {
  const [stories, setStories] = useState<StoriesData | null>(null)
  const { user, status, accessToken } = useAuthContext()
  const router = useRouter()
  const { query } = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }

    if (status === 'authenticated') {
      (async () => {
        let page: number = (router.query.page === undefined) ? 1 : Number(router.query.page)

        let result = await API.get(`/users/${user}?page=${page}`, {headers: {'Authorization': `${accessToken}`}, withCredentials: true})

        setStories(result.data)
      })()
    }
  }, [status, query, router, accessToken, user])

  const handleDeleteClicked = async (id: number) => {
    let deleted = await API.delete(`/stories/${id}`, {headers: {'Authorization': `${accessToken}`}, withCredentials: true})

    let page: number = (router.query.page === undefined) ? 1 : Number(router.query.page)

    let result = await API.get(`/users/${user}?page=${page}`, {headers: {'Authorization': `${accessToken}`}, withCredentials: true})

    setStories(result.data)
  }

  return (
    <div className="max-w-screen-xl px-8 mx-auto">
      {status === 'authenticated' && (
        <>
          <h1 className="font-bold text-4xl tracking-wide block text-center text-blue-800 mt-4">MyPosts</h1>
          <main className="mx-auto mt-4">
            <div className="sm:grid sm:gap-x-8 sm:gap-y-8 md:grid-cols-2 xl:grid-cols-3">
              {stories !== null && stories!.rows.map((story: Story) => (
                <StoryCard key={story.id} story={story} myStack={true} deleteFunc={handleDeleteClicked} />
              ))}
            </div>
            <Paginator pages={stories ? Number(stories.total.pages) : 1} page={stories ? Number(stories.page) : 1} />
          </main>
        </>
      )}
    </div>
  )

}

export default MyPosts