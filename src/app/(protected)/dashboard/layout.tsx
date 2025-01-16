"use client";
import React, { useEffect } from "react";
import DashboardHeader from "./_components/DashboardHeader";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useRouter } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./_components/DashboardSideBar";
import axios from "axios";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const user = useCurrentUser();

  useEffect(() => {
    if (user) {
      const checkUserBudgets = async () => {
        // Find budgets associated with the user's email and if no budget is found then redirect user to budgets page to create budgets
        try {
          const response = await axios.get("/api/get-budgets");
          if (response.data.length === 0) {
            router.replace("/dashboard/budgets");
          }
        } catch (error) {
          console.error("Error fetching budgets:", error);
        }
      };
      
      checkUserBudgets();
    }
  }, [user, router]); // Adding `user` and `router` to the dependency array

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className="w-full">
        <DashboardHeader />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default DashboardLayout;
