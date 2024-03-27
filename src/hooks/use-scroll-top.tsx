import { useState, useEffect } from "react"

// threshold is a parameter by default whose value is 10
export const useScrollTop = (threshold = 10) => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if(window.scrollY > threshold) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [threshold])

  return scrolled
} 