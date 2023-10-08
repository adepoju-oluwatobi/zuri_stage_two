import React from 'react'
import Fb from '../assets/fb.svg'
import Ig from '../assets/ig.svg'
import Twitter from '../assets/twitter.svg'
import Yt from '../assets/yt.svg'

function Footer() {
  return (
    <div className='flex flex-col items-center mb-10'>
        <div className='flex gap-5 md:gap-10'>
            <img src={Fb} alt="facebook icon" />
            <img src={Ig} alt="facebook icon" />
            <img src={Twitter} alt="facebook icon" />
            <img src={Yt} alt="facebook icon" />
        </div>
        <div className='flex gap-4 md:gap-10 text-sm md:text-base mt-4'>
            <p>
                Condition of use
            </p>
            <p>
                Privacy & Policy
            </p>
            <p>
                Press Room
            </p>
        </div>
        <div>
            <p className='opacity-50 text-sm md:text-base mt-2'>
            © 2023 Just-Thriller by <a target='_blank' href="https://my-portfolio-one-ochre-19.vercel.app/">Adepoju Oluwatobi</a>  
            </p>
        </div>
    </div>
  )
}

export default Footer