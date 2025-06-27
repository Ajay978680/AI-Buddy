import { desc } from 'drizzle-orm';
import AiToolCard from './AiToolCard';
import React from 'react'

const aiToolsList = [
  {     name: 'AI Career Q&A Chat',
        desc:'Ask Career Related Questions.',
        icon: '/chatbot.png',
        button: 'Lets Chat',
        path:'/ai-tools/ai-chat'
  },
  {
         name: 'AI Resume Analyzer',
        desc:'Improve Your resume with AI',
        icon: '/resume.png',
        button: 'Analyze Now',
        path:'/ai-resume-analyzer'
  },
  {
        name: 'Carrer Path Generator',
        desc:'Build Your roadmap',
        icon: '/roadmap.png',
        button: 'Generate now',
        path:'/carrer-roadmap-generator',
  },
  {
        name: 'Cover Letter Generator',
        desc:'Write a cover letter',
        icon: '/cover.png',
        button: 'Create Now',
        path:'/cover-letter-generator',
  }
];                                           

const AITools = () => {
  return (
    <div className='mt-7 p-5 bg-white rounded-xl shadow-lg  '>
        <h1 className='font-bold text-lg'>Available AI Tools</h1>
        <p>Start Building and Shape ur carrer with exciting AI Tools</p>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5'>
            {aiToolsList.map((tool:any, index) => (
                    <AiToolCard tool={tool} key={index}/>
            ))}
        </div>
    </div>
  )
}

export default AITools