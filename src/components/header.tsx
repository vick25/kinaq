'use client';
import Image from "next/image"
import Link from "next/link"
import { Search, Menu, User, Settings, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import React, { useCallback, useRef, useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import AboutDialog from "./about-dialog";
import { useTheme } from "next-themes";
import LocaleSwitcher from "./locale-switcher";
import { useTranslations } from "next-intl";

function Header() {
  const t = useTranslations('HomePage')
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null);

  const handleThemeToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      setTheme(theme === "dark" ? "light" : "dark")
    },
    [theme, setTheme],
  )

  const handleInputChange = () => {
    if (searchRef.current)
      console.log(searchRef.current.value)
  };

  return (
    <header className="border-b">
      <div className="w-full flex h-16 items-center px-4">
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
        <div className="ml-auto flex items-center space-x-4 md:gap-5">
          <div className="relative w-64 shadow-sm hidden md:block">
            <Input placeholder="Search districts" className="pl-8" ref={searchRef} onChange={handleInputChange} />
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
          <nav className="hidden md:flex md:gap-5 items-center space-x-4">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              {t('menu1')}
            </Link>
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault()
                setOpen(true)
              }}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {t('menu2')}
            </Link>
            <Link href="/districts" className="text-sm font-medium hover:text-primary transition-colors">
              {t('menu3')}
            </Link>
            <Link href="/historical" className="text-sm font-medium hover:text-primary transition-colors">
              {t('menu4')}
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-5 w-5 cursor-pointer hover:text-primary transition-colors">
                  <AvatarImage src="/placeholder-avatar.svg" alt="User avatar" />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>My data</span>
                </DropdownMenuItem>
                {/* <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
                  <span className="flex items-center justify-between w-full">
                    Dark mode
                    <Switch checked={theme === "dark"} onClick={handleThemeToggle} />
                  </span>
                </DropdownMenuItem> */}
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
            {/* <!-- Local switcher --> */}
            <LocaleSwitcher />
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
              <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
                About
              </Link>
              <Link href="/districts" className="text-sm font-medium hover:text-primary transition-colors">
                Beneficiary Districts
              </Link>
              <Link href="/historical" className="text-sm font-medium hover:text-primary transition-colors">
                Historical Data
              </Link>
              <div className="flex items-center space-x-2">
                <Avatar className="h-5 w-5">
                  <AvatarImage src="/placeholder-avatar.svg" alt="User avatar" />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium hover:text-primary transition-colors">User Menu</span>
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