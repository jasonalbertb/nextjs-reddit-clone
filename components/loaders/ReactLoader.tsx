import { ImSpinner8 } from "react-icons/im"

export const ReactLoader = () => {

    return (
        <div className='grid w-screen h-screen bg-gray-100 place-items-center'>
            <ImSpinner8 className='w-8 h-8 text-gray-500 animate-spin'/>
        </div>
    )
  }