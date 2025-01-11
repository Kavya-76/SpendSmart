"use client"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import { useCurrentUser } from "@/hooks/use-current-user"
import { FaUser } from "react-icons/fa"
import {LogOutIcon} from "lucide-react"
import { Button } from "../ui/button"
import { logout } from "@/actions/logout"


export const UserButton = () =>{
    const user = useCurrentUser();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                    <AvatarImage src={user?.image || ""} />
                    <AvatarFallback className="bg-sky-500" >
                        <FaUser className="text-white" />
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-20" align="end">
                <Button onClick={()=>logout()}>
                    <DropdownMenuItem>
                        <LogOutIcon className="h-4 w-4 mr-2" />
                        Logout
                    </DropdownMenuItem>
                </Button>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

