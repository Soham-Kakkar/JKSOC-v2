"use client"

import { useAuth } from "@/context/AuthContext"
import { useState, useEffect } from "react"
import { Button } from "./ui/button"

export default function AboutPageRegisterBtn() {

  const { user, loading } = useAuth()
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const init = async () => {
      setMounted(true)
    }
    init()
  }, [])

  if (!mounted) return null;
  if (user || loading) return null;
  
  return (
    <section id="cta" className='flex justify-center align-middle pt-10'>
      <Button className="px-10 py-5">Register Now!</Button>
    </section>
  );
}