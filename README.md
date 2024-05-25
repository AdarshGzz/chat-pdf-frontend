Sure! Below is a README documentation for the provided app codes.

---

# Chat Application

## Overview

This is a simple chat application that allows users to upload a PDF file, ask questions about its content, and receive responses using a backend API. The application is built using Next.js, React, and TypeScript.

## Features

- **File Upload**: Users can upload PDF files.
- **Chat Interface**: Users can ask questions and receive answers from the backend API.
- **Loading State**: Displays a loading indicator while processing requests.
- **Error Handling**: Provides feedback for unsupported file types and sizes.

## Components

- **Home**: Main component that renders the `Navbar` and `Chat` components.
- **Navbar**: Contains the application logo and the `Upload` component.
- **Upload**: Handles file upload, validation, and submission to the backend.
- **Chat**: Manages the chat interface, displaying messages and handling user input.

## Code Details

### Home Component

This component renders the main structure of the application, including the navigation bar and the chat interface.

```javascript
import Chat from "@/components/Chat";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className="h-screen w-screen">
      <div>
        <Navbar />
      </div>
      <Chat />
    </main>
  );
}
```

### Navbar Component

The navigation bar includes the application logo and the file upload component.

```javascript
import Image from 'next/image';
import React from 'react';
import Logo from '@/public/ailogo.svg';
import Upload from './Upload';

const Navbar = () => {
  return (
    <div className='w-screen py-2 border-black top-0 shadow-md flex flex-row items-center justify-between px-10 gap-3'>
      <Image height={100} width={120} className='md:w-[7rem] w-20' alt='logo' src={Logo} />
      <div>
        <Upload />
      </div>
    </div>
  );
};

export default Navbar;
```

### Upload Component

Handles file selection, validation, and submission to the backend API.

```javascript
"use client"

import React, { useState, useRef } from 'react';
import { FiPlusCircle } from "react-icons/fi";
import { MdOutlineFileCopy } from "react-icons/md";
import useUploadStore from '@/context/uploadStore';
import lodingGig from '@/public/loding.svg';
import Image from 'next/image';

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadResponse, setUploadResponse } = useUploadStore();

  const submit = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);

    try {
      const response = await fetch(`https://chatf-api.onrender.com/upload-pdf`, {
        method: 'POST',
        body: formData,
        mode: 'cors',
      });

      if (response.ok) {
        const data = await response.json();
        setUploadResponse(data);
      } else {
        setError('File upload failed');
      }
    } catch (error) {
      setError('Error uploading file');
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setError(null);

    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError('File type not allowed. Please upload a PDF file.');
        return;
      }
      if (selectedFile.size > 3 * 1024 * 1024) {
        setError('File size should be less than 3MB.');
        return;
      }
      setFile(selectedFile);
      submit(selectedFile);
    }
  };

  return (
    <div>
      {loading ? (
        <div className='pr-20'>
          <Image height={100} width={100} className=' w-10' alt='loading' src={lodingGig} />
        </div>
      ) : (
        <form>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {!loading && (
            <div className='flex flex-row gap-5 items-center'>
              {uploadResponse && (
                <div className='flex flex-row items-center gap-2'>
                  <MdOutlineFileCopy className='h-7 w-7 text-[#0FA858] bg-[#0fa85950] rounded-lg p-1' />
                  <div className='hidden md:block'>{uploadResponse.filename}</div>
                </div>
              )}
              <button
                className='rounded-lg p-2 border border-black font-semibold flex flex-row items-center gap-4'
                type="button"
                onClick={handleButtonClick}
                disabled={loading}
              >
                <FiPlusCircle />{file ? <p className='md:block hidden'>Change PDF</p> : <p className='md:block hidden'>Upload PDF</p>}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                name="file"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default Upload;
```

### Chat Component

Manages the chat interface, allowing users to input questions and display responses from the API.

```javascript
"use client"

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
    text = text.replace(/\n\n/g, '<br><br>');
    text = text.replace(/(\d+)\.\s/g, '<li>$1. ');
    text = text.replace(/(<li>\d+\..*?)<br><br>/g, '$1</li><br><br>');
    text = text.replace(/(<li>\d+\..*?)(?=<li>)/g, '$1</li>');
    text = text.replace(/\n\*/g, '<li>');
    text = text.replace(/(<li>.*?)(?=<li>)/g, '$1</li>');
    text = text.replace(/<\/li><br><br>/g, '</li>');
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
                <div className="flex-grow overflow-y-scroll p-4 border border-gray-300 pb-20 px-[10%]

">
                    {messages.map((message, index) => (
                        <div key={index} className={`my-2 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`rounded-lg p-2 px-3 max-w-[70%] text-white break-words whitespace-pre-wrap ${message.sender === 'user' ? 'bg-[#00a67e]' : 'bg-[#e4e6eb] text-black'}`}>
                                <div className='flex flex-row gap-2 items-start'>
                                    {message.sender !== 'user' && <Image height={35} width={35} src={message.sender === 'api' ? bot : lod} alt={message.sender === 'api' ? 'bot' : 'loading'} className='rounded-full' />}
                                    <p className={`${message.sender === 'user' && 'order-first'} ${message.sender === 'api' && 'order-2'}`} dangerouslySetInnerHTML={{ __html: formatMessage(message.text) }}></p>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef}></div>
                </div>
            }
            <div className='w-[80%] fixed bottom-0 mb-4 flex gap-3'>
                <input
                    className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring focus:border-blue-300"
                    type="text"
                    placeholder="Type your message here..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button
                    className="bg-[#00a67e] text-white p-2 rounded-lg"
                    onClick={handleSend}
                >
                    <RxPaperPlane />
                </button>
            </div>
        </div>
    );
};

export default Chat;
```

### Custom Hooks and Context

To manage the upload response state across components, we use a custom hook and context.

### Upload Store Context

Defines the context and provides the state management for the upload response.

```javascript
import create from 'zustand';

// Define the store using Zustand
const useUploadStore = create((set) => ({
    uploadResponse: null,
    setUploadResponse: (response) => set({ uploadResponse: response }),
}));

export default useUploadStore;
```

## Setup and Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the development server**:

   ```bash
   npm run dev
   ```

4. **Access the application**:

   Open your browser and navigate to `http://localhost:3000`.

## Usage

1. **Upload a PDF file**:

   Click the "Upload PDF" button in the navigation bar and select a PDF file. The file should be less than 3MB in size.

2. **Ask a question**:

   Type your question in the input box at the bottom of the chat interface and press Enter or click the send button. The response will be displayed in the chat.

## Dependencies

- **React**: A JavaScript library for building user interfaces.
- **Next.js**: A React framework for server-side rendering and static site generation.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
- **Zustand**: A small, fast, and scalable bearbones state-management solution.
- **Axios**: Promise-based HTTP client for the browser and Node.js.
- **react-icons**: A collection of popular icons for React applications.
- **next/image**: Image optimization component for Next.js.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.
