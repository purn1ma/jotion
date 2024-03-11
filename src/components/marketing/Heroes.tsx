import { FC } from 'react'
import Image from 'next/image'

interface HeroesProps {
  
}

const Heroes: FC<HeroesProps> = ({}) => {
  return (
    <div className='flex flex-col items-center justify-center max-w-5xl'>
      <div className='flex items-center'>
        
        {/* Image - 1 */}
        <div className='relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px]'>
          {/* Light Mode Image */}
          <Image
            src="/documents.png"
            alt="Documents"
            fill
            className='object-contain dark:hidden'
          />
          {/* Dark Mode Image */}
          <Image
            src="/documents-dark.png"
            alt="Documents"
            fill
            className='object-contain hidden dark:block'
          />
        </div>

        {/* Image - 2 */}
        <div className='relative w-[400px] h-[400px] hidden md:block'>
          {/* Light Mode Image */}
          <Image
            src="/reading.png"
            alt="reading"
            fill
            className='object-contain dark:hidden'
          />

          {/* Dark Mode Image */}
          <Image
            src="/reading-dark.png"
            alt="reading"
            fill
            className='object-contain hidden dark:block'
          />
        </div>
      </div>
    </div>
  )
}
 
export default Heroes