import React from 'react'
import { RotatingLines } from 'react-loader-spinner'

const Loader = () => {
  return (
     <div className="flex justify-center items-center w-full h-[500px]">
        <div className=" Flex flex-col items-center gap-1">
            <RotatingLines       
                visible={true}
                height="96"
                width="96"
                color="grey"
                strokeWidth="5"
                animationDuration="0.75"
                ariaLabel="rotating-lines-loading"
                wrapperStyle={{}}
                wrapperClass=""
            />
        </div>
    </div>
  )
}

export default Loader