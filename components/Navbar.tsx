"use client"
import { useTheme } from "next-themes"
import { BringToFront, LogOut, MenuIcon, Moon, Settings, Sun, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

function Navbar() {
     const { setTheme } = useTheme()
    return (
        <nav className="flex items-center justify-between h-16 bg-zinc-50 dark:bg-zinc-900 shadow-sm fixed w-full z-10">
            <div className="flex gap-3 pl-6">
                <BringToFront />
                <h1 className="font-bold flex items-center">Orderbook Viewer</h1>
            </div>
            <div className="flex gap-3 items-center pr-6 font-[500]">
                <span className="hidden md:block"><Link href="/">Orderbook</Link></span>
                <span className="hidden md:block"><Link href="simulation">Simulation</Link></span>
                <DropdownMenu >
                    <DropdownMenuTrigger>
                        <Moon className="cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-zinc-50  dark:bg-zinc-900 mr-3 ">
                        <DropdownMenuItem onClick={() => setTheme("light")}className="text-black dark:text-zinc-50" >
                            <Sun /> Light
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")} className="text-black  dark:text-zinc-50"><Moon  /> Dark</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu >
                    <DropdownMenuTrigger>
                        <MenuIcon className=" md:hidden block" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-zinc-50  dark:bg-zinc-900 mr-3 md:hidden block">
                        <DropdownMenuItem >
                            <span className="text-black dark:text-zinc-50"><Link href="/">Orderbook</Link></span>
                        </DropdownMenuItem>
                        <DropdownMenuItem ><span className="text-black dark:text-zinc-50"><Link href="simulation">Simulation</Link></span></DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu >
                    <DropdownMenuTrigger>
                        <Avatar className="cursor-pointer">
                            <AvatarImage src="https://github.com/anupamgupt.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-zinc-50  dark:bg-zinc-900 mr-3 ">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-black dark:text-zinc-50">
                            <User /> Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-black dark:text-zinc-50"><Settings  /> Settings</DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" className="text-black dark:text-zinc-50"><LogOut /> Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    )
}

export default Navbar