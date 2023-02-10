import Head from 'next/head'
import ProgressBar from '@/components/ProgressBar'
import {useState} from 'react'
import {API_URL, NEXT_URL} from '@/config/index'
import axios from "axios";
import {nanoid} from "nanoid";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Link from "next/link";
import {PlusIcon} from "@heroicons/react/24/solid";
import Image from "next/image";

export default function Home() {
    const [percentage, setPercentage] = useState(0)
    const [uid, setUid] = useState(new Date().getTime() + nanoid(5))
    const [uploading, setUploading] = useState(false)
    const [uploaded, setUploaded] = useState(0)

    const uploadFile = async (e) => {
      const file = e.target.files[0]
      console.log(e.target.files)
      const data = new FormData()
      data.append('files.file', file)
      data.append('data', JSON.stringify({ uid: uid }))
      setUploading(true)
      try {
        const upload_res = await axios.post(`${API_URL}/api/documents`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            setPercentage(
              parseInt(
                Math.round((progressEvent.loaded * 100) / progressEvent.total)
              )
            )
          },
        })
        if (upload_res.status === 200) {
          toast.success('File uploaded successfully')
          setUploaded(1)
        } else {
          toast.error('File upload failed')
          setUploaded(2)
        }
      } catch (e) {
        if (e?.response?.status === 413) {
          toast.error('File size too large')
        } else if (e?.response?.status === 400) {
          toast.error('Bad request')
        }
        console.log(e)
      }
    }
    const copyToClipboard = async (e) => {
      e.preventDefault()
      const textToCopy = `${NEXT_URL}/api/documents/${uid}`
      // navigator clipboard api needs a secure context (https)
      if (navigator.clipboard && window.isSecureContext) {
        // navigator clipboard api method'
        return navigator.clipboard
          .writeText(textToCopy)
          .then(function () {
            toast.success('Copied to clipboard')
          })
          .catch(function (err) {
            toast.error('Failed to copy')
            console.log(err)
          })
      } else {
        // text area method
        let textArea = document.createElement('textarea')
        textArea.value = textToCopy
        // make the textarea out of viewport
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        return new Promise((res, rej) => {
          // here the magic happens
          document.execCommand('copy') ? res() : rej()
          textArea.remove()
        })
          .then(() => {
            toast.success('Copied to clipboard')
          })
          .catch((err) => {
            toast.error('Failed to copy')
            console.log(err)
          })
      }
    }

    const resetFile = () => {
      setUploading(false)
      setPercentage(0)
      setUid(new Date().getTime() + nanoid(5))
      setUploaded(0)
    }

    return (
      <>
        <Head>
          <title>IITP File Uploader</title>
          <meta name='description' content='IITP File Uploader' />
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <link rel='icon' href='/iitp_logo.svg' />
        </Head>
        <ToastContainer
          position='top-center'
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
        />
        <main>
          {/* Centered Layout */}
          <div className='max-w-7xl mx-auto py-6 px-2 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-screen'>
            <div className='mb-20'>
              {/*IITP Logo*/}
              <div className='flex justify-center'>
                <Image
                  src='/iitp_logo.svg'
                  width={100}
                  height={100}
                  alt='IITP Logo'
                />
              </div>
              {/*Heading*/}
              <div className='text-center mt-4'>
                <h1 className='text-3xl font-thin text-gray-900'>
                  IITP File Uploader
                </h1>
              </div>
            </div>

            {/* Center div below */}
            <div className='w-full max-w-lg transition-all'>
              {percentage > 0 && (
                <div className='mb-6'>
                  <p
                    className='text-sm font-medium text-green-700 inline-flex items-center cursor-pointer border border-green-800 rounded-full px-3 py-2 hover:bg-green-700 hover:text-white transition-all duration-300'
                    onClick={resetFile}
                  >
                    <PlusIcon
                      className='-ml-1 mr-2 h-5 w-5'
                      aria-hidden='true'
                    />
                    Upload new file
                  </p>
                </div>
              )}

              {!uploading && (
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Upload File
                  </label>
                  <div className='mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6'>
                    <div className='space-y-1 text-center'>
                      <svg
                        className='mx-auto h-12 w-12 text-gray-400'
                        stroke='currentColor'
                        fill='none'
                        viewBox='0 0 48 48'
                        aria-hidden='true'
                      >
                        <path
                          d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                      <div className='flex text-sm text-gray-600'>
                        <form>
                          <label
                            htmlFor='file-upload'
                            className='relative cursor-pointer rounded-md bg-white font-medium text-green-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-green-500 focus-within:ring-offset-2 hover:text-green-500'
                          >
                            <span>Upload a file</span>
                            <input
                              id='file-upload'
                              name='file-upload'
                              type='file'
                              className='sr-only'
                              onChange={uploadFile}
                            />
                          </label>
                        </form>

                        {/*<p className='pl-1'>or drag and drop</p>*/}
                      </div>
                      <p className='text-xs text-gray-500'>
                        Any file up to 15GB
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {/* Upload bar */}
              <div className='mt-4'>
                {uploading && (
                  <ProgressBar percentage={percentage} uploaded={uploaded} />
                )}
              </div>
              {/* Show file uid */}
              {uploading && (
                <div className='flex flex-col items-center justify-center'>
                  <div
                    className='mt-4 flex justify-around cursor-pointer'
                    onClick={copyToClipboard}
                  >
                    {/*    Show url to share */}
                    <p className='text-gray-600 hover:text-green-700 break-all'>{`${NEXT_URL}/api/documents/${uid}`}</p>
                  </div>
                  <div
                    onClick={copyToClipboard}
                    className='mt-4 h-10 px-6 flex justify-center items-center cursor-pointer font-semibold rounded-md bg-gray-700 hover:bg-green-800 transition-all duration-200 text-white'
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth='1.5'
                      stroke='currentColor'
                      className='w-6 h-6'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75'
                      />
                    </svg>
                    <span className='ml-2'>Copy To Clipboard</span>
                  </div>
                </div>
              )}
              {uploaded === 1 && (
                <div className='mt-4'>
                  <Link href={`${NEXT_URL}/api/documents/${uid}`}>
                    <p className='text-green-600 hover:text-green-500 text-center'>
                      Download File
                    </p>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </main>
      </>
    )
}
