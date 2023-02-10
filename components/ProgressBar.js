import React from 'react'

export default function ProgressBar({ percentage = 0, uploaded = 0 }) {
  return (
    <div>
      <div>
        <h4 className='sr-only'>Status</h4>
        <p className='text-sm font-medium text-gray-900'>
          {uploaded === 1
            ? 'Uploaded Successfully'
            : uploaded === 2
            ? 'Upload Failed'
            : 'Upload in Progress'}
        </p>
        <div className='mt-6' aria-hidden='true'>
          <div className='bg-gray-200 rounded-full overflow-hidden'>
            <div
              className='h-2 bg-green-600 rounded-full transition-all duration-300'
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className='hidden sm:grid grid-cols-2 text-sm font-medium text-gray-600 mt-6'>
            <div className='text-left'>0%</div>
            <div className='text-right'>100%</div>
          </div>
        </div>
      </div>
    </div>
  )
}
