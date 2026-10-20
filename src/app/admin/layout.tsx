import { redirect } from "next/navigation";

import { checkIsAdmin } from "@/lib/api";

import { AdminSidebar, SidebarProvider } from "./_components/admin-sidebar";
import styles from "./admin.module.css";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  try {
    const { isAdmin } = await checkIsAdmin();

    if (!isAdmin) {
      redirect("/?auth=1");
    }
  } catch (error) {
    console.error("Admin check failed:", error);
    redirect("/?auth=1");
  }

  return (
    <SidebarProvider>
      <div className={styles.layout}>
        <AdminSidebar />
        <main className={styles.main}>{children}</main>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
