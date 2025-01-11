import { Sidebar } from "@/components/ui/sidebar";
import React, { useEffect } from "react";
import Image from "next/image";
import {
  LayoutGrid,
  PiggyBank,
  ReceiptText,
  CircleDollarSign,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function DashboardSidebar() {
  const menuList = [
    {
      id: 1,
      name: "Dashboard",
      icon: LayoutGrid,
      path: "/dashboard",
    },
    {
      id: 2,
      name: "Incomes",
      icon: CircleDollarSign,
      path: "/dashboard/incomes",
    },
    {
      id: 2,
      name: "Budgets",
      icon: PiggyBank,
      path: "/dashboard/budgets",
    },
    {
      id: 3,
      name: "Expenses",
      icon: ReceiptText,
      path: "/dashboard/expenses",
    },
  ];
  const path = usePathname();

  useEffect(() => {
    console.log(path);
  }, [path]);
  return (
    <Sidebar>
      <div className="h-screen p-5 border shadow-sm">
        <div className="flex flex-row items-center">
          <Link href="/">
            <Image src="/logo.svg" alt="logo" width={40} height={25} />
          </Link>
          <span className="text-blue-800 font-bold text-xl ml-2">
            SpendSmart
          </span>
        </div>
        <div className="mt-5">
          {menuList.map((menu, index) => (
            <Link href={menu.path} key={index}>
              <h2
                className={`flex gap-2 items-center
              text-gray-500 font-medium
              mb-2
              p-4 cursor-pointer rounded-full
              hover:text-primary hover:bg-blue-100
              ${path == menu.path && "text-primary bg-blue-100"}
              `}
              >
                <menu.icon />
                {menu.name}
              </h2>
            </Link>
          ))}
        </div>
        <div
          className="fixed bottom-10 p-5 flex gap-2
      items-center"
        >
          {/* Currency Component */}
        </div>
      </div>
    </Sidebar>
  );
}
