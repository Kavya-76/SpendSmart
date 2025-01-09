"use client";
import React from "react";
import DashboardHeader from "./_components/DashboardHeader";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./_components/DashboardSideBar";

import axios from "axios";

const DashboardLayout = ({ children }: any) => {
  const router = useRouter();
  const user = useCurrentUser();

  useEffect(() => {
    if (user) {
      user && checkUserBudgets();
    }
  }, [user]);

  const checkUserBudgets = async () => {
    // Find budgets associated with the user's email and if no budget is found then redirect user to budgets page to create budgets
    axios
      .post("/api/get-budgets")
      .then((response) => {
        if (response.data.length === 0) {
          router.replace("/dashboard/budgets");
        }
      })
      .catch((error) => {
        console.error("Error fetching budgets:", error);
      });
  };

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className="w-full" >
        <DashboardHeader />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default DashboardLayout;
