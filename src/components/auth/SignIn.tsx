import Link from 'next/link'
import UserAuthForm from './UserAuthForm'
import Image from 'next/image'
 
const SignIn = () => {
  return (
    <div className="conatiner mx-auto mb-32 mr-48 flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        {/* Logo */}
        <Image
          src="/logo.svg"
          alt="logo"
          width={50}
          height={50}
          className="mx-auto"
        />

        <h1 className="text-2xl font-semibold tracking-tight">Welcome Back</h1>
        <p className="text-sm max-w-xs mx-auto">
          By continuing, you are setting up a Jotion account and agree to our User Agreement and Privacy Policy
        </p>

        {/* SignIn Form */}
        <UserAuthForm />
        
        {/* Navigation to sign-up page */}
        <p className="px-8 text-center text-sm text-zinc-700">
          New to Jotion?{" "}
          <Link href="/sign-up" className="hover:text-zinc-800 text-sm underline underline-offset-4">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignIn