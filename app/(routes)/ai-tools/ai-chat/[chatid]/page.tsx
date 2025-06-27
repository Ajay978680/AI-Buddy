"use client"
import { Button } from '@/components/ui/button'
import { LoaderCircle, LoaderIcon, Send } from 'lucide-react'
// import { Input } from 'postcss'
import { Input } from '@/components/ui/input'
import React,{useEffect, useState} from 'react'
import EmptyState from '../_components/EmptyState'
import axios from 'axios'
import ReactMarkdown from 'react-markdown';
import { useParams } from 'next/navigation'

type messages = {
  content: string,
  role: string,
  type: string
}

const page = () => {

  const[userInput, setUserInput] = useState<string>("");
  const[loading, setLoading] = useState<boolean>(false);
  const[messageList, setMessageList] = useState<messages[]>([]);
  const{chatid}=useParams();

  console.log(chatid)

  const onSend=async()=>{
    if (!userInput.trim()) return;
    setLoading(true);
    // Add user message to the right
    const userMsg = { content: userInput, role: 'user', type: 'text' };
    setMessageList((prev) => [
      ...prev,
      userMsg
    ]);
    setUserInput("");
    try {
      const result = await axios.post('/api/ai-career-chat-agent', {
        userInput: userMsg.content
      });
      // Add assistant response to the left
      let assistantMsg = result.data;
      // If the response is an object, try to extract the content property
      if (typeof assistantMsg === 'object' && assistantMsg !== null) {
        if ('content' in assistantMsg && typeof assistantMsg.content === 'string') {
          assistantMsg = assistantMsg.content;
        } else {
          assistantMsg = JSON.stringify(assistantMsg);
        }
      }
      setMessageList((prev) => [
        ...prev,
        { content: assistantMsg, role: 'assistant', type: 'text' }
      ]);
    } finally {
      setLoading(false);
    }
  }

  console.log(messageList);
  
  useEffect(()=>{
    //save message into database
  },[messageList])

  return (
    <div className='px-10 md:px-24 lg:px-36 xl:px-48'>
      <div className='flex items-center justify-between gap-8 mb-4'>
        <div>
          <h2 >AI Carrer Q&A Chat</h2>
          <p>Smarter carrer decisions - get tailored made suggesstions for acheiving in ur life.</p>
        </div>
        <Button>+ New Chat</Button>
      </div>
      <div className='flex flex-col h-[75vh] '>
        {messageList.length<=0 &&
        <div>
          {/* Empty State Option */}
          <EmptyState selectedQuestion={(question:string)=>setUserInput(question)}/>
        </div>
          }

        <div className='flex-1 overflow-y-auto scrollbar-none'>
          {/* Message List */}
          {messageList?.map((message, index) => (
            <div
              key={index}
              className={`flex mb-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`p-3 rounded-lg gap-2 min-w-[120px] max-w-[80%] whitespace-pre-line shadow-md ${
                  message.role === 'user'
                    ? 'bg-gray-200 text-black rounded-lg'
                    : 'bg-white text-black border border-gray-200'
                }`}
                style={{ wordBreak: 'break-word' }}
              >
                <span className="block text-xs font-semibold mb-1 text-gray-500">
                  {message.role === 'assistant' && 'Assistant Msg'}
                </span>
                {message.role === 'assistant' ? (
                  <div className="prose prose-sm max-w-none text-base leading-relaxed">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                ) : (
                  <span className="text-base leading-relaxed">{message.content}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className='flex justify-between items-center gap-6 mt-4'>
          {/* Input List */}
          <Input placeholder='Type here' value={userInput}
          onChange={(event) => setUserInput(event.target.value)}
          />
          <Button onClick={onSend} disabled={loading} ><Send/></Button>
        </div>

      </div>
    </div>
  )
}

export default page

//1:43