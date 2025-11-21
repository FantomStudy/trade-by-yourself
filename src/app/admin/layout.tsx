import { notFound } from "next/navigation";

import { checkIsAdmin } from "@/lib/api";

import { AdminSidebar } from "./_components/admin-sidebar";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  try {
    const { isAdmin } = await checkIsAdmin();

    if (!isAdmin) {
      notFound();
    }
  } catch (error) {
    console.error("Admin check failed:", error);
    notFound();
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
};

export default AdminLayout;
