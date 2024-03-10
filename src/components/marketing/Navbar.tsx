"use client";

import { useScrollTop } from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { ModeToggle } from "../ModeToggle";

import { Session } from "next-auth";
import { Button, buttonVariants } from "../ui/Button";
import Link from "next/link";

interface NavbarProps {
  session: Session | null;
}

const Navbar = ({ session }: NavbarProps) => {
  const scrolled = useScrollTop();

  return (
    <div
      className={cn(
        "z-50 bg-background dark:bg-[#1F1F1F] fixed top-0 flex items-center w-full p-6",
        scrolled && "border-b shadow-sm"
      )}
    >
      <Logo />

      <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2">
        {/* Not authenticated then show login button */}
        {!session?.user ? (
          <>
            <Link
              href="/sign-in"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className={cn(buttonVariants({ variant: "default", size: "sm" }))}
            >
              Get Jotion free
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/documents"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            >
              Enter Jotion
            </Link>
            {/* <UserAccountNav /> */}
          </>
        )}
        
        {/* Dark and light mode toggle button */}
        <ModeToggle />
      </div>
    </div>
  );
};
 
export default Navbar;
