import React from "react";
import { Toggle } from "@/components/ui/toggle";
import { useSidebar } from "@/components/ui/sidebar";
import {HamburgerMenuIcon} from "@radix-ui/react-icons"
import { ModeToggle } from "@/app/_components/mode-toggle";

function DashboardHeader() {
  const { toggleSidebar } = useSidebar();
  return (
    <div className="w-full p-5 shadow-sm border-b flex justify-between">
      <div>
        <Toggle onClick={toggleSidebar} ><HamburgerMenuIcon/></Toggle>
      </div>
      <div>
        <ModeToggle/>
      </div>
    </div>
  );
}

export default DashboardHeader;
