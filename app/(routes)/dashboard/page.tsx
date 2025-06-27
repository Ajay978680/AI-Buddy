import React from 'react'
import AItools from './_components/AITools'
import { Button } from '@/components/ui/button'
import History from './_components/History'

function Dashboard() {
    return (
        <>
         <div className='p-5 bg-gradient-to-tr from-[#BE575f] via-[#A338E3] t0-[#A338E4] rounded-xl shadow-lg'>
                <h2 className='font-bold text-2xl text-white '>AI Carrer Coach Agent</h2>
                <p>Smarter Career decisions start here - get tailor made suggestion and growth on ur life</p>
                <Button variant={'outline'} className='mt-3'>Let's Get Started</Button>
        </div>
        <div>
            <AItools />
        </div>
        <div>
            <History /> 
        </div>
        </>
       
    )
}

export default Dashboard