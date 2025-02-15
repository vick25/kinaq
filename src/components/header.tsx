'use client';
import Image from "next/image"
import Link from "next/link"
import { Search, Menu, User, Settings, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import React, { useCallback, useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import AboutDialog from "./about-dialog";
import { useTheme } from "next-themes";
import { ToastContainer } from "react-fox-toast"

function Header() {
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleThemeToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      setTheme(theme === "dark" ? "light" : "dark")
    },
    [theme, setTheme],
  )

  console.log(console.log('Header rendered'))

  return (
    <header className="border-b">
      <ToastContainer />
      <div className="container flex h-16 items-center px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo-kinaq.jpg"
            alt="Kinshasa Air Quality Logo"
            width={90}
            height={90}
            className="h-12 w-auto"
          />
          <span className="text-lg font-bold text-[#05b15d]">KINSHASA AIR QUALITY</span>
        </Link>
        <div className="ml-auto flex items-center space-x-4">
          <div className="relative w-64 shadow-sm hidden md:block">
            <Input placeholder="Search districts" className="pl-8" />
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
          <nav className="hidden md:flex items-center space-x-4">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
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
            <Link href="/districts" className="text-sm font-medium hover:text-primary transition-colors">
              Beneficiary Districts
            </Link>
            <Link href="/historical" className="text-sm font-medium hover:text-primary transition-colors">
              Historical Data
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="User avatar" />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>My Data</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
                  <span className="flex items-center justify-between w-full">
                    Dark mode
                    <Switch checked={theme === "dark"} onClick={handleThemeToggle} />
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogIn className="mr-2 h-4 w-4" />
                  <span>Login</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="User avatar" />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">User Menu</span>
              </div>
              <div className="pl-10 space-y-2">
                <Link href="/my-data" className="block text-sm">
                  My Data
                </Link>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Dark mode</span>
                  <Switch onClick={handleThemeToggle} />
                </div>
                <Link href="/settings" className="block text-sm">
                  Settings
                </Link>
                <Link href="/login" className="block text-sm">
                  Login
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

export default React.memo(Header);