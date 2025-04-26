'use client';
import Image from "next/image"
import Link from "next/link"
import { Search, Menu, User, Settings, LogIn, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import React, { useCallback, useRef, useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import AboutDialog from "./about-dialog";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import LocaleSwitcher from "./locale-switcher";
import { useTranslations } from "next-intl";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { IUser } from "@/lib/definitions";

function Header({ session }: { session: IUser | null }) {
  const router = useRouter()
  const t = useTranslations('HomePage')
  const pathname = usePathname();
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null);

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/');
          router.refresh();
        }
      }
    });
  }

  const handleThemeToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      setTheme(theme === "dark" ? "light" : "dark")
    },
    [theme, setTheme],
  );

  const navLinks = [
    { href: "/", label: `${t('menu1')}` },
    { href: "/about", label: `${t('menu2')}` },
    { href: "/districts", label: `${t('menu3')}` },
    { href: "/historical", label: `${t('menu4')}` },
  ]

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
            className="h-12 w-auto rounded-full object-cover"
            priority
          />
          <span className="text-xl font-bold text-[#05b15d]">KINSHASA AIR QUALITY</span>
        </Link>
        <div className="ml-auto flex items-center space-x-4 md:gap-5">
          <div className="relative w-64 shadow-sm hidden lg:block">
            <Input placeholder="Search zones" className="pl-8" ref={searchRef} onChange={handleInputChange} />
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
          <nav className="hidden md:flex md:gap-5 items-center space-x-4">
            {navLinks.map((link) => (
              link.href.includes('about') ?
                <Link
                  key={link.href}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setOpen(true)
                  }}
                  className="text-sm text-muted-foreground font-medium hover:text-primary transition-colors"
                >
                  {link.label}
                </Link> :
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === link.href ? "text-primary font-bold border-b-2 border-primary" : "text-muted-foreground",
                  )}
                >
                  {link.label}
                </Link>
            ))}
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
                {session && (
                  <DropdownMenuItem onSelect={() => router.push('/requests')}>
                    <div className="flex items-center w-full text-sm">
                      <User className="mr-2 h-4 w-4" />
                      My data
                    </div>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onSelect={() => router.push('/settings')}>
                  <div className="flex items-center w-full text-sm">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  {!session ? (
                    <div onClick={() => router.push('/historical?signup=#')} className="flex items-center w-full text-sm">
                      <LogIn className="mr-2 h-4 w-4" />
                      Login
                    </div>
                  ) : (
                    <div onClick={handleSignOut} className="flex items-center w-full text-sm">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </div>
                  )}
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
              <Input placeholder="Search zones" className="pl-8 w-full" />
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium",
                    pathname === link.href ? "text-primary font-bold" : "text-muted-foreground",
                  )}
                >
                  {link.label}
                </Link>
              ))}
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
                {session && <Link href="/requests" className="block text-sm">
                  My Data
                </Link>}
                <div className="flex items-center justify-between">
                  <span className="text-sm">Dark mode</span>
                  <Switch onClick={handleThemeToggle} />
                </div>
                <Link href="/settings" className="block text-sm">
                  Settings
                </Link>
                {<Link href="/login" className="block text-sm">
                  Login
                </Link>}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

export default React.memo(Header);