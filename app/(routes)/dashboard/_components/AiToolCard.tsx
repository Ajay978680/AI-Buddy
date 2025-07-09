"use client";
import React from 'react'
import Image from 'next/image'
import { TooltipPortal } from '@radix-ui/react-tooltip';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export interface TOOL{
    name: string;
    desc: string;
    icon: string;
    button: string; 
    path:string
}

type AIToolProps={
    tool: TOOL; 
}

const AiToolCard = ({tool}:AIToolProps) => {

  const id=uuidv4();
  const {user}=useUser();
  const router = useRouter();

  const onClickButton=async()=>{
    //create new record to history table
    const result: Response = await fetch('/api/history', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        recordId: id,
        content: [],
        userEmail: user?.primaryEmailAddress?.emailAddress || ""
      }),
    });
    console.log(await result.json());
    router.push(tool.path+"/"+id);
  }

  return (
    <div className='p-3 border rounded-lg'>
        <Image src={tool.icon} alt={tool.name} width={40} height={40} className='w-10 h-10' />
        <h2 className='font-bold mt-2'>{tool.name}</h2>
        <p className='text-gray-400'>{tool.desc}</p>
        <Button className='w-full mt-3' onClick={onClickButton}>{tool.button}</Button>
    </div>
  )
}

export default AiToolCard