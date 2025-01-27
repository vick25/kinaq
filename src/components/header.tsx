'use client';
import Image from "next/image"
import Link from "next/link"
import { Search, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import AboutDialog from "./about-dialog";

export function Header() {
  const [open, setOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Kin_Air_Quality-a8ketS70nikPzgLCexVjkgvIdUNjJG.png"
            alt="Kinshasa Air Quality Logo"
            width={50}
            height={50}
            className="h-8 w-auto"
          />
          <span className="text-lg font-bold text-[#05b15d]">KINSHASA AIR QUALITY</span>
        </Link>
        <div className="ml-auto flex items-center space-x-4">
          <div className="relative w-64 hidden md:block">
            <Input placeholder="Search districts" className="pl-8" />
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
          <nav className="hidden md:flex items-center space-x-4">
            <Link href="/" className="text-sm font-medium">
              Home
            </Link>
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault()
                setOpen(true)
              }}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link href="/districts" className="text-sm font-medium">
              Beneficiary Districts
            </Link>
            <Link href="/historical" className="text-sm font-medium">
              Historical Data
            </Link>
          </nav>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
        <AboutDialog open={open} onOpenChange={setOpen} />
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4 px-4 space-y-4">
            <div className="relative">
              <Input placeholder="Search districts" className="pl-8 w-full" />
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
            <nav className="flex flex-col space-y-4">
              <Link href="/" className="text-sm font-medium">
                Home
              </Link>
              <Link href="/about" className="text-sm font-medium">
                About
              </Link>
              <Link href="/districts" className="text-sm font-medium">
                Beneficiary Districts
              </Link>
              <Link href="/historical" className="text-sm font-medium">
                Historical Data
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

