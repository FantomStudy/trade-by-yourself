"use client";



import { Typography } from "@/components/ui";



import { MobileHeader } from "../_components/admin-sidebar";

import { AdminSupportTicketsPanel } from "./_components/admin-support-tickets-panel";



const SupportPage = () => {

  return (

    <div className="space-y-6">

      <MobileHeader title="Техподдержка" />

      <div>

        <Typography className="text-xl font-bold sm:text-3xl">Техподдержка</Typography>

        <Typography className="mt-2 text-gray-600">

          Обращения пользователей. Ответы уходят от имени «Служба поддержки», не как личная переписка.

        </Typography>

      </div>



      <AdminSupportTicketsPanel />

    </div>

  );

};



export default SupportPage;

