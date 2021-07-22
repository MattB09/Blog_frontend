import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface Props {
  page: number,
  pages: number,
}

const Paginator: React.FC<Props> = ({page, pages}) => {
  const router = useRouter()

  const pagesArr = Array.from({ length: pages }, (_:any, i:number) => (i + 1))
  pagesArr.length === 0 ? pagesArr.push(1) : pagesArr

  return (
    <nav className="mt-10 w-full flex justify-center">
      <Link href={`${router.pathname}?page=${page - 1}`}>
        <a className={`${page === 1 ? 'opacity-50 pointer-events-none bg-gray-300' : ''} mx-5 py-1 px-2 border border-blue-200 hover:border-blue-400 rounded flex align-center justify-center`}>
          <Image src="/left_arrow.png" alt="previous page" height="12" width="7.41" />
        </a>
      </Link>

      <div className="" >
        {pagesArr.map((p) => (
          <Link href={`${router.pathname}?page=${p}`} key={p}>
            <a className={`${p === page ? 'pointer-events-none font-bold' : ""} text-center mr-3 last:mr-0`}>
              {p}
            </a>
          </Link>
        ))}
      </div>

      <Link href={`${router.pathname}?page=${page + 1}`}>
        <a className={`${page >= pages ? 'opacity-50 pointer-events-none bg-gray-300' : ""} mx-5 py-1 px-2 border border-blue-200 hover:border-blue-400 rounded flex align-center justify-center`}>
          <Image src="/right_arrow.png" alt="previous page" height="12" width="7.41" />
        </a>
      </Link>

    </nav>
  )
}

export default Paginator