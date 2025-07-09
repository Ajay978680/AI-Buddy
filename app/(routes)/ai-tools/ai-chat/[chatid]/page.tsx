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
    // Add user message
    const newUserMessage = {content: userInput, role: 'user', type: 'text'};
    const updatedList = [...messageList, newUserMessage];
    setMessageList(updatedList);
    setUserInput("");

    let newAssistantMessage;
    try {
      const result = await axios.post('/api/ai-career-chat-agent', {
        userInput: userInput
      });
      // If the API returns an error, show it as a message
      if (result.data?.error) {
        newAssistantMessage = { content: "Error: " + result.data.error, role: 'assistant', type: 'text' };
      } else if (typeof result.data === 'object') {
        newAssistantMessage = { content: JSON.stringify(result.data), role: 'assistant', type: 'text' };
      } else {
        newAssistantMessage = { content: result.data, role: 'assistant', type: 'text' };
      }
    } catch (err) {
      newAssistantMessage = { content: "Sorry, something went wrong with the assistant.", role: 'assistant', type: 'text' };
    }

    const finalList = [...updatedList, newAssistantMessage];
    setMessageList(finalList);
    await updateMessageList(finalList);
    setLoading(false);
  }

  useEffect(() => {
    const fetchHistory = async () => {
      if (!chatid) return;
      try {
        const res = await axios.get(`/api/history?recordId=${chatid}`);
        if (res.data && Array.isArray(res.data.content)) {
          setMessageList(res.data.content);
        }
      } catch (err) {
        console.error('Failed to fetch chat history:', err);
      }
    };
    fetchHistory();
  }, [chatid])


  console.log(messageList);
  
  useEffect(()=>{
    //save message into database
    messageList.length>0 && updateMessageList();
  },[messageList])

  // Update updateMessageList to accept a list
  const updateMessageList = async (list = messageList) => {
    try {
      await axios.put(`/api/history`,{
        content: list,
        recordId: chatid
      });
    } catch (err) {
      console.error('Error updating history:', err);
    }
  }

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

        <div className='flex-1 overflow-y-auto scrollbar-none py-4'>
          {/* Message List */}
          {messageList?.map((message, index) => (
            <div
              key={index}
              className={`flex mb-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={
                  `max-w-[70%] p-4 rounded-2xl shadow ` +
                  (message.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-900 border border-gray-200 rounded-bl-none')
                }
                style={{ wordBreak: 'break-word' }}
              >
                <div className="mb-1 text-xs font-semibold opacity-70">
                  {message.role === 'assistant' ? 'AI Assistant' : 'You'}
                </div>
                {message.role === 'assistant' ? (
                  <div className="prose prose-sm max-w-none text-base leading-relaxed whitespace-pre-line">
                    <ReactMarkdown>{String(message.content)}</ReactMarkdown>
                  </div>
                ) : (
                  <span className="text-base leading-relaxed whitespace-pre-line">{message.content}</span>
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

//2:07