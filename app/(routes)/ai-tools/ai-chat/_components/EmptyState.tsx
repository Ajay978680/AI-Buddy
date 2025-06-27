import React from 'react'

const questionList=[
    'what skills do I need to become a software engineer?',
    'how can I improve my resume for a data science job?'
]

const EmptyState = ({selectedQuestion}:any) => {
  return (
    <div >
        <h2 className='font-bold text-xl text-center mt-10 mb-4'>Ask anything to AI Carrer Agent</h2>
        <div>
            {questionList.map((question,index)=>(
                <h2 className='p-2 text-center border rounded-sm my-3 hover:border-primary cursor-pointer' 
                key={index}
                onClick={()=>selectedQuestion(question)} 
                >{question}</h2>
            ))}
        </div>
    </div>
  )
}

export default EmptyState