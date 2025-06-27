import { inngest } from "@/inngest/client";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req:any){
    try {
        const {userInput}=await req.json();
        const resultIds=await inngest.send({
            name:'AiCareerAgent',
            data: {
                userInput:userInput
            }
        });
        const runId=resultIds?.ids?.[0];
        if (!runId) {
            console.error('No runId returned from inngest.send', resultIds);
            return NextResponse.json({ error: 'No runId returned from inngest.send' }, { status: 500 });
        }
        let runStatus;
        let attempts = 0;
        while(true){
            runStatus = await getRuns(runId);
            if(runStatus?.data?.[0]?.status === 'Completed')
                break;
            attempts++;
            if (attempts > 40) { // 20 seconds max
                console.error('Timeout waiting for run completion', runStatus);
                return NextResponse.json({ error: 'Timeout waiting for run completion' }, { status: 504 });
            }
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        return NextResponse.json(runStatus.data?.[0].output?.output[0]);
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error?.message || 'Internal Server Error' }, { status: 500 });
    }
}

export async function getRuns(runId: string) {
    const result = await axios.get(
        process.env.INNGEST_SERVER_HOST + '/v1/events/' + runId + '/runs',
        {
            headers: { Authorization: `Bearer ${process.env.INNGEST_API_KEY}` }
        }
    );
    return result.data;
}

