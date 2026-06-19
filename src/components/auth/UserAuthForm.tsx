"use client"

import { FC, useState } from 'react'
import { Button } from '../ui/Button'
import { Icons } from '../Icons'
import { signIn } from 'next-auth/react'
import { toast } from 'sonner'

interface UserAuthFormProps {}

const UserAuthForm: FC<UserAuthFormProps> = ({}) => {
  const [isLoading, setIsLoading] = useState(false)

  const loginWithGoogle = async () => {
    setIsLoading(true)

    try {
      await signIn("google")
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }
 
  return (
    <div className='flex justify-center'>
      <Button
        onClick={loginWithGoogle}
        isLoading={isLoading}
        size="sm"
        className='w-full'
      >
        {isLoading ? null : <Icons.google className="h-4 w-4 mr-2" />}
        Google
      </Button>
    </div>
  )
}

export default UserAuthForm