import { redirect } from "next/navigation";

import { AdminSidebar } from "./_components/admin-sidebar";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  // TODO: Добавить проверку прав администратора
  // const user = await getCurrentUser();
  // if (!user || user.role !== 'admin') {
  //   redirect('/');
  // }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
};

export default AdminLayout;
