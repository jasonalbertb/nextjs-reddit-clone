import React, { ChangeEvent } from 'react'

type Props = {
  value : string,
  onChange : (e: ChangeEvent<HTMLInputElement>)=>void,
  label : string,
  type ?: string,
  margin?: string,
  paddingRight?: string
}

export const FloatingInputs = ({value, onChange, label, type='text', margin='',paddingRight=''}: Props) => {

  return (
    <div className={`relative floatingInput rounded-full bg-gray-100
        overflow-hidden px-4 pt-4 ${paddingRight} pb-1 ${margin} border focus-within:border-gray-400 hover:border-gray-400`}>
      <input 
        placeholder=' '
        className='w-full h-full outline-none text-sm font-medium bg-gray-100 '
        type={type} value={value} onChange={onChange}
      />
      <label 
        className='capitalize pointer-events-none absolute font-medium text-sm text-gray-500
          top-1/2 translate-y-[-50%] left-4 origin-[0%] transition-all duration-100 ease-in'
      >
        {label}
      </label>
    </div>
  )
}
