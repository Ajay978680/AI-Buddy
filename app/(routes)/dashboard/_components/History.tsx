"use client";
import React,{useState} from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button';

const History = () => {

    const [userHistory, setUserHistory] = useState([])

  return (
    <div className='mt-5 p-5 border rounded-xl'>
        <h2 className='font-bold text-lg'>Previous History</h2>
        <p className=''>Your Previous work on, you can find here</p>
        {userHistory?.length==0 &&
         <div className='flex items-center justify-center mt-5 flex-col mt-6'>
        <Image src={'/idea.png'} alt="Idea icon" width={50} height={50} />
         <h2>You dont have previous History </h2>
         <Button className='mt-2'>Explore AI Tools</Button>
          </div>
            }
    </div>
  )
}

export default History