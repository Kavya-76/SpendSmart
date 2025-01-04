"use client"
import React from 'react'
import DashboardHeader from './_components/DashboardHeader';
import SideNav from './_components/SideNav';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import BudgetModel from '@/models/Budget';



const DashboardLayout = ({children}:any) => {
    const router = useRouter();
    const user = useCurrentUser();
    console.log(user);
    
    useEffect(() => {
        if (user) {
          checkUserBudgets();
        }
      }, [user]);
    
      const checkUserBudgets = async () => {
        try {
          // Find budgets associated with the user's email
        //   const result = await BudgetModel.find({ createdBy: user?._id });
        const result = [];
    
          if (result.length === 0) {
            router.replace("/dashboard/budgets");
          }
        } catch (error) {
          console.error("Error fetching budgets:", error);
        }
      };

    return (
        <div>
          <div className="fixed md:w-64 hidden md:block ">
            <SideNav />
          </div>
          <div className="md:ml-64 ">
            <DashboardHeader />
            {children}
          </div>
        </div>
      );
}

export default DashboardLayout

