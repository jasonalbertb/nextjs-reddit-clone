import React from 'react'
import {Navbar} from "../Navbar";
import { PageWrapper } from './PageWrapper';

type Props = {
  children : React.ReactNode
}
export const NavPageWrapper = ({children}: Props) => {
  return (
    <PageWrapper>
      <div className='fixed top-0 left-0 w-full z-[1000]'>
        <Navbar />
      </div>
      <div className='pt-12 min-h-screen '>
        {children instanceof Array?
            (<>
              {children[2]}
              <div className='flex max-w-5xl mx-auto'>
                <div className='flex-1 p-3'>
                  {children[0]}
                </div>
                <div className='w-[350px] p-3 hidden lg-2:block'>
                  {children[1]}
                </div>
              </div>
            </>):
            children
         }
      </div>
    </PageWrapper>
  )
}

