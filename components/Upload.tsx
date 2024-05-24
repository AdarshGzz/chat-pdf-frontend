"use client"

import React, { useState, useRef } from 'react'
import { FiPlusCircle } from "react-icons/fi";
import { MdOutlineFileCopy } from "react-icons/md";
import useUploadStore from '@/context/uploadStore';
import lodingGig from '@/public/loding.svg';
import Image from 'next/image';

const Upload = () => {
    const [file, setFile] = useState<File | null>(null);
    // const [uploadResponse, setUploadResponse] = useState<{ id: string; filename: string } | null>(null);
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
                // console.log('File uploaded successfully\n', data);
                setUploadResponse(data);
            } else {
                // console.error('File upload failed');
                setError('File upload failed');
            }
        } catch (error) {
            // console.error('Error uploading file:', error);
            setError('Error uploading file');
        } finally {
            setLoading(false); // End loading
        }
    };

    // console.log(uploadResponse);
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
            if (selectedFile.size > 3 * 1024 * 1024) { // 3MB
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
                    <Image height={100} width={100} className=' w-10' alt='loding' src={lodingGig}/>
                </div>
            ) : (
                <form>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {!loading && (
                      <div className='flex flex-row gap-5 items-center'>
                                {uploadResponse && <div className='flex flex-row items-center gap-2'><MdOutlineFileCopy className='h-7 w-7 text-[#0FA858] bg-[#0fa85950] rounded-lg p-1' /><div className='hidden md:block'>{uploadResponse.filename}</div></div>}
                                <button className='rounded-lg p-2 border border-black font-semibold flex flex-row items-center gap-4' type="button" onClick={handleButtonClick} disabled={loading}>
                                    <FiPlusCircle />{file ? <p className='md:block hidden'>Change PDF</p> :<p className='md:block hidden'>Upload PDF</p>}
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

    )
}

export default Upload


