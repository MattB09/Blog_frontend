import React, { useState, useEffect } from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import API from '../utils/api'
import { Story } from '../types'
import StoryCard from '../components/StoryCard'
import Paginator from '../components/Paginator'


export const getServerSideProps: GetServerSideProps = async (context) => {
  let result

  if (context.query.page === undefined) {
    result = await API.get('/stories')
  } else {
    result = await API.get(`/stories/?page=${context.query.page}`)
  }

  return {
    props: {stories: result.data}
  }
}

const Home: React.FC = ({stories}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  // const [columns, setColumns] = useState<number>(1)
  // const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth)

  // useEffect(() => {
  //   window.addEventListener('resize', () => {
  //     setWindowWidth(window.innerWidth)
  //   })
  //   if (windowWidth < 640) setColumns(1)
  //   else if (windowWidth < 1024) setColumns(2)
  //   else setColumns(3)
  // }, [windowWidth])

  return (
    <div className="max-w-screen-xl px-8 mx-auto">
      <h1 className="font-bold text-4xl tracking-wide block text-center text-blue-800 mt-4">All Posts</h1>
      <main className="mx-auto mt-4">
        <div className="sm:grid sm:gap-x-8 sm:gap-y-8 md:grid-cols-2 xl:grid-cols-3" >
          {stories.rows.length > 0 && stories.rows.map((story:Story, ind: number) => (
            <StoryCard key={story.id} story={story} myStack={false} />
          ))}
        </div>
        <Paginator pages={stories.total.pages} page={stories.page} />
      </main>
    </div>
  )
}

export default Home
