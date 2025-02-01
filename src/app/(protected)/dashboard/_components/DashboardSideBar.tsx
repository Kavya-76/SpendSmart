import { Sidebar } from "@/components/ui/sidebar";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  LayoutGrid,
  PiggyBank,
  ReceiptText,
  CircleDollarSign,
  CreditCard,
} from "lucide-react";
import UserButton from "@/app/_components/user-button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";


export function DashboardSidebar() {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const path = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === "system" ? systemTheme : theme;

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
      id: 3,
      name: "Budgets",
      icon: PiggyBank,
      path: "/dashboard/budgets",
    },
    {
      id: 4,
      name: "Expenses",
      icon: ReceiptText,
      path: "/dashboard/expenses",
    },
    {
      id: 5,
      name: "Transactions",
      icon: CreditCard,
      path: "/dashboard/transactions",
    },
  ];

  return (
    <Sidebar>
      <div className="h-screen p-5 border shadow-sm">
        {/* Logo Section */}
        <div className="flex flex-row items-center">
          <Link href="/">
            {mounted ? (
              <Image
                src={
                  currentTheme === "dark"
                    ? "/SpendSmart Logo White.jpg"
                    : "/SpendSmart Logo Black.jpg"
                }
                alt="logo"
                width={40}
                height={25}
              />
            ) : (
              <Image
                src="/SpendSmart Logo Black.jpg"
                alt="logo"
                width={40}
                height={25}
              />
            )}
          </Link>
          <span className="text-primary font-bold text-xl ml-2">
            SpendSmart
          </span>
        </div>

        {/* Menu List */}
        <div className="mt-5">
          {menuList.map((menu) => (
            <Link href={menu.path} key={menu.id}>
              <h2
                className={`flex gap-2 items-center text-gray-500 font-medium mb-2 p-4 cursor-pointer rounded-full
                  hover:text-primary hover:bg-slate-300 dark:hover:bg-gray-600
                  ${path === menu.path ? "text-primary bg-slate-300 dark:bg-gray-600" : ""}
                `}
              >
                <menu.icon />
                {menu.name}
              </h2>
            </Link>
          ))}
        </div>

        {/* Mode Toggle */}
        <div className="fixed bottom-10 p-5 flex gap-2 items-center">
          <UserButton/>
        </div>
      </div>
    </Sidebar>
  );
}
