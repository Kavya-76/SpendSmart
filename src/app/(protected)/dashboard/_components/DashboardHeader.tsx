import React from "react";
import UserButton from "@/app/_components/user-button";
import { Toggle } from "@/components/ui/toggle";
import { useSidebar } from "@/components/ui/sidebar";
import Image from "next/image";

function DashboardHeader() {
  const { toggleSidebar } = useSidebar();
  return (
    <div className="w-full p-5 shadow-sm border-b flex justify-between">
      <div>
        <Toggle onClick={toggleSidebar} ><Image src="/sidebar-toggle.svg" alt="sidebar-toggle" width={20} height={20}/></Toggle>
      </div>
      <div>
        <UserButton />
      </div>
    </div>
  );
}

export default DashboardHeader;
