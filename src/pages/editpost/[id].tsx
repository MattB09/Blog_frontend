import React, { useEffect, useState, FormEvent } from "react"
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { useAuthContext } from "../../components/auth/AuthProvider"
import API from '../../utils/api'
import axios from 'axios'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const result = await API.get(`/stories/${context?.params?.id}`)

  return {
    props: { story: result.data }
  }
}

const Edit: React.FC = ({story}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { status, accessToken } = useAuthContext()
  const router = useRouter()
  const [title, setTitle] = useState<string>(story.title)
  const [content, setContent] = useState<string>(story.content)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoName, setPhotoName] = useState<string>(story.photo_url === null ? "" : story.photo_url.split('/').slice(-1))

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  const handlePostSubmit = async (clickEvent: FormEvent<HTMLFormElement>): Promise<void> => {
    clickEvent.preventDefault()

    if (title === '' || content === '') {
      alert("must fill in all required fields")
    }

    let photo_url = null

    if (photoFile !== null) {
      let fd: FormData = new FormData()
      fd.append("file", photoFile)

      let upload_url = await API.get(
        `s3upload/${photoFile!.name}`,
        {headers: {'Authorization': `${accessToken}`}, withCredentials: true}
      );

      let res = await axios({
        url: `${upload_url.data}`,
        method: 'PUT',
        headers: {"Content-Type": "multipart/form-data"},
        data: photoFile
      });

      photo_url = upload_url.data.split('?')[0];      
    } else {
      photo_url = story.photo_url;
    }

    await API.put(`/stories/${story.id}`, { title, content, photo_url }, {headers: {'Authorization': `${accessToken}`}, withCredentials: true})

    router.push(`/myposts`)
  }

  const handleFileChange = (changeEvent: React.ChangeEvent<HTMLInputElement>): void => {
    const files: FileList = changeEvent.target.files!
    let file: File | null = (files.length === 0) ? null : files[0]

    setPhotoFile(file)
    setPhotoName(file !== null ? file.name : "")
  }

  return (
    <main className="flex flex-col justify-center px-4 mt-4 mx-auto sm:w-104">
      {status === 'authenticated' && (
        <>
          <h1 className="font-bold text-4xl tracking-wide block text-blue-800 mt-4">Edit Post</h1>
          <form onSubmit={handlePostSubmit} className="mt-4">

            <label htmlFor="title" className="block text-sm text-gray-600 mb-2">Title  <span className="text-red-400 text-xs">Required</span></label>
            <input id="title" type="text" className="w-full px-4 py-1 rounded" value={title} onChange={(e)=> setTitle(e.target.value)} required /> 

            <label htmlFor="description" className="block text-sm text-gray-600 mb-2 mt-4">Description  <span className="text-red-400 text-xs">Required</span></label>
            <textarea id="description" className="w-full h-48 px-4 py-1 rounded" value={content} onChange={(e)=> setContent(e.target.value)} required >
            </textarea>

            <div className="flex w-full items-center justify-start mt-4 mb-4"> 
              <label className="border border-blue-800 text-gray-600 hover:bg-blue-800 hover:text-gray-100 cursor-pointer py-1 px-4 rounded inline-flex items-center justify-center">
                <span className="text-semibold">{photoName === "" ? "Upload Image" : "Uploaded: "}</span>
                <p className="ml-2 italic">{photoName}</p>
                <input id="upload" className="hidden"
                type="file" accept="image/png, image/jpeg" onChange={handleFileChange} />             
              </label>
            </div>

            <button type="submit" className="bg-blue-800 hover:bg-blue-900 text-gray-100 rounded px-4 py-1 w-full">Save</button> 

          </form>
        </>
      )}
    </main>
  )
}

export default Edit