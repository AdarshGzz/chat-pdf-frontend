"use client"
// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';

// interface Message {
//     sender: 'user' | 'api' | 'loading'; // Add loading as a sender type
//     text: string;
// }

// const formatMessage = (text: string) => {
//     let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<i>$1</i>');
//     let eformattedText = formattedText.replace(/\*(.*?)\*/g, '<br/>$1');
//     return eformattedText;
// };

// const Chat: React.FC = () => {
//     const [messages, setMessages] = useState<Message[]>([]);
//     const [input, setInput] = useState<string>('');
//     const [isLoading, setIsLoading] = useState<boolean>(false); // State for loading status
//     const messagesEndRef = useRef<HTMLDivElement>(null);

//     const scrollToBottom = () => {
//         if (messagesEndRef.current) {
//             messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
//         }
//     };

//     useEffect(() => {
//         scrollToBottom();
//     }, [messages]); // Scroll to bottom whenever messages change

//     const handleSend = async () => {
//         if (input.trim()) {
//             const userMessage: Message = { sender: 'user', text: input };
//             setMessages([...messages, userMessage]);
//             setInput('');
//             setIsLoading(true); // Set loading to true when sending request

//             try {
//                 const response = await axios.post<{ question: string; answer: string }>('http://localhost:3001/ask-question', {
//                     "pdfId": "665068bb20d5ab9442009e8c",
//                     "question": input
//                 });
//                 const { answer } = response.data;
//                 const apiMessage: Message = { sender: 'api', text: `\n${answer}` };
//                 setMessages(prevMessages => [...prevMessages, apiMessage]);
//             } catch (error) {
//                 console.error('Error fetching response:', error);
//             } finally {
//                 setIsLoading(false); // Set loading to false when response is received
//             }
//         }
//     };

//     return (
//         <div className="h-[90vh] w-screen flex flex-col relative">
//             <div className="flex-grow overflow-y-scroll p-4 border border-gray-300 pb-20">
//                 {messages.map((message, index) => (
//                     <div
//                         key={index}
//                         className={`text-md font-bold p-2 rounded-lg my-2 ${message.sender === 'user' ? 'self-end bg-green-200' : message.sender === 'loading' ? 'self-center' : 'self-start bg-gray-200'}`}
//                     >
//                         {isLoading ? (
//                             <span>Loading...</span>
//                         ) : (
//                             <span dangerouslySetInnerHTML={{ __html: formatMessage(message.text) }} />
//                         )}
//                     </div>
//                 ))}
//                 <div ref={messagesEndRef} /> {/* Empty div for scrolling to bottom */}
//             </div>
//             <div className="flex justify-center absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-300">
//                 <input
//                     type="text"
//                     value={input}
//                     onChange={e => setInput(e.target.value)}
//                     onKeyPress={e => e.key === 'Enter' && handleSend()}
//                     className="p-2 border border-gray-300 rounded-md w-3/4"
//                 />
//                 <button
//                     onClick={handleSend}
//                     className="ml-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
//                 >
//                     Send
//                 </button>
//             </div>
//         </div>
//     );
// }

// export default Chat;
// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import useUploadStore from '@/context/uploadStore'; // Update the path accordingly
// import { RxPaperPlane } from "react-icons/rx";
// import Image from 'next/image';
// import lod from '@/public/loding.svg'
// import { FaFilePdf } from "react-icons/fa6";



// interface Message {
//     sender: 'user' | 'api' | 'loading';
//     text: string;
// }

// const formatMessage = (text: string) => {
//     let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<i>$1</i>');
//     let eformattedText = formattedText.replace(/\*(.*?)\*/g, '<br/>$1');
//     return eformattedText;
// };

// const Chat: React.FC = () => {
//     const [messages, setMessages] = useState<Message[]>([]);
//     const [input, setInput] = useState<string>('');
//     const [isLoading, setIsLoading] = useState<boolean>(false);
//     const messagesEndRef = useRef<HTMLDivElement>(null);
//     const { uploadResponse } = useUploadStore();

//     const scrollToBottom = () => {
//         if (messagesEndRef.current) {
//             messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
//         }
//     };

//     useEffect(() => {
//         scrollToBottom();
//     }, [messages]);

//     console.log(uploadResponse)

//     const handleSend = async () => {
//         if (input.trim()) {
//             const userMessage: Message = { sender: 'user', text: input };
//             setMessages([...messages, userMessage]);
//             setInput('');

//             try {
//                 setIsLoading(true);
//                 const response = await axios.post<{ question: string; answer: string }>('http://localhost:3001/ask-question', {
//                     "pdfId": uploadResponse.id,
//                     "question": input
//                 });
//                 const { answer } = response.data;
//                 const apiMessage: Message = { sender: 'api', text: `\n${answer}` };
//                 setMessages(prevMessages => [...prevMessages.filter(m => m.sender !== 'loading'), apiMessage]);
//             } catch (error) {
//                 console.error('Error fetching response:', error);
//             } finally {
//                 setIsLoading(false);
//             }
//         }
//     };

//     return (
//         <div className="h-[90vh] w-screen flex flex-col relative">
//             {!uploadResponse?
//                 <div className='flex items-center justify-center h-full capitalize  flex-col gap-2  '>
//                     <FaFilePdf className='w-[20%] h-[20%] text-[#0FA858]' />
//                     <div className='font-semibold text-[#0FA858]'>upload pdf to start</div>
//                 </div>
//                 :
//                 <div className="flex-grow overflow-y-scroll p-4 border border-gray-300 pb-20">
//                     {messages.map((message, index) => (
//                         <div
//                             key={index}
//                             className={`text-md font-bold p-2 rounded-lg my-2 w-max max-w-full ${message.sender === 'user' ? 'self-end bg-green-200' : 'self-start bg-gray-200'}`}
//                         >
//                             {message.sender === 'loading' ? (
//                                 <span>Loading...</span>
//                             ) : (
//                                 <span dangerouslySetInnerHTML={{ __html: formatMessage(message.text) }} />
//                             )}
//                         </div>
//                     ))}
//                     <div className={isLoading ? ` block text-md font-bold p-2 rounded-lg my-2 w-max max-w-full self-start bg-gray-200` : ` hidden text-md font-bold p-2 rounded-lg my-2 w-max max-w-full self-start bg-gray-200`}>
//                         <img height={100} width={100} className='w-10' alt='loding' src={lod.src} />
//                     </div>

//                     <div ref={messagesEndRef} /> {/* Empty div for scrolling to bottom */}
//                 </div>
//             }
            
//             <div className="flex justify-center absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-300">
//                 <input
//                     type="text"
//                     value={input}
//                     onChange={e => setInput(e.target.value)}
//                     onKeyPress={e => e.key === 'Enter' && handleSend()}
//                     className="p-2 border border-gray-300 rounded-md w-3/4"
//                     disabled={!uploadResponse || isLoading} // Disable input if uploadResponse is not available or loading is true
//                 />

//                 <button
//                     onClick={handleSend}
//                     className={!uploadResponse || isLoading ? ` ml-2 p-2 bg-[#E4E7EB] text-[#909295] rounded-md hover:bg-[#E4E7EB]` : ` ml-2 p-2 bg-[#C0E4CB] text-[#0fa851] rounded-md hover:bg-[#91dca7]`}
//                     disabled={!uploadResponse || isLoading} // Disable button if uploadResponse is not available or loading is true
//                 >
//                     <RxPaperPlane className='w-10'/>
//                 </button>
//             </div>
//         </div>
//     );
// }

// export default Chat;


import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import useUploadStore from '@/context/uploadStore'; // Update the path accordingly
import { RxPaperPlane } from "react-icons/rx";
import Image from 'next/image';
import lod from '@/public/loding.svg';
import { FaFilePdf } from "react-icons/fa6";
import bot from "@/public/GreenBot.png";
import user from "@/public/user.jpeg";

interface Message {
    sender: 'user' | 'api' | 'loading';
    text: string;
}

const formatMessage = (text: string) => {

            text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

            // Add line breaks for new lines
            text = text.replace(/\n\n/g, '<br><br>');

            // Handle numbered lists
            text = text.replace(/(\d+)\.\s/g, '<li>$1. ');
            text = text.replace(/(<li>\d+\..*?)<br><br>/g, '$1</li><br><br>');
            text = text.replace(/(<li>\d+\..*?)(?=<li>)/g, '$1</li>');

            // Handle unordered lists
            text = text.replace(/\n\*/g, '<li>');
            text = text.replace(/(<li>.*?)(?=<li>)/g, '$1</li>');
            text = text.replace(/<\/li><br><br>/g, '</li>');

            // Add horizontal rules before each phase
            text = text.replace(/<br><br><strong>(Phase \d:.*?)<\/strong>/g, '<hr><strong>$1</strong>');

            return text;
};

const Chat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { uploadResponse } = useUploadStore();


    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // console.log(uploadResponse);

    const handleSend = async () => {
        if (input.trim()) {
            const userMessage: Message = { sender: 'user', text: input };
            setMessages([...messages, userMessage]);
            setInput('');

            try {
                setIsLoading(true);
                const response = await axios.post<{ question: string; answer: string }>(`https://chatf-api.onrender.com/ask-question`, {
                    "pdfId": uploadResponse.id,
                    "question": input
                });
                const { answer } = response.data;
                const apiMessage: Message = { sender: 'api', text: `\n${answer}` };
                setMessages(prevMessages => [...prevMessages.filter(m => m.sender !== 'loading'), apiMessage]);
            } catch (error) {
                console.error('Error fetching response:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="h-[90vh] w-screen flex flex-col relative">
            {!uploadResponse ?
                <div className='flex items-center justify-center h-full capitalize flex-col gap-2'>
                    <FaFilePdf className='w-[20%] h-[20%] text-[#0FA858]' />
                    <div className='font-semibold text-[#0FA858]'>upload pdf to start</div>
                </div>
                :
                <div className="flex-grow overflow-y-scroll p-4 border border-gray-300 pb-20 px-[10%] md:px-[20%]">
                    
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex items-center my-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex items-start ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <Image
                                    src={message.sender === 'user' ? user : bot}
                                    alt={`${message.sender} Avatar`}
                                    width={40}
                                    height={40}
                                    className="rounded-full m-2  "
                                />
                                <div className={`text-md font-medium p-2 rounded-lg w-[vw] max-w-full ${message.sender === 'user' ? 'bg-green-200' : 'bg-gray-200'}`}>
                                    {message.sender === 'loading' ? (
                                        <span>Loading...</span>
                                    ) : (
                                        <span dangerouslySetInnerHTML={{ __html: formatMessage(message.text) }} />
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-center my-2 justify-start">
                            <Image
                                src={bot}
                                alt="API Avatar"
                                width={40}
                                height={40}
                                className="rounded-full m-2"
                            />
                            <div className="text-md font-bold p-2 rounded-lg w-max max-w-full bg-gray-200">
                                <img height={100} width={100} className='w-10' alt='loading' src={lod.src} />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} /> {/* Empty div for scrolling to bottom */}
                </div>
            }
            <div className="flex justify-center absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-300">
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSend()}
                    className="p-2 border border-gray-300 rounded-md w-3/4"
                    disabled={!uploadResponse || isLoading} // Disable input if uploadResponse is not available or loading is true
                />
                <button
                    onClick={handleSend}
                    className={!uploadResponse || isLoading ? `ml-2 p-2 bg-[#E4E7EB] text-[#909295] rounded-md hover:bg-[#E4E7EB]` : `ml-2 p-2 bg-[#C0E4CB] text-[#0fa851] rounded-md hover:bg-[#91dca7]`}
                    disabled={!uploadResponse || isLoading} // Disable button if uploadResponse is not available or loading is true
                >
                    <RxPaperPlane className='w-10' />
                </button>
            </div>
        </div>
    );
}

export default Chat;
