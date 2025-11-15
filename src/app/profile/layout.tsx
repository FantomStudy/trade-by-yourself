import { Sidebar } from "./_components/sidebar";

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="global-container sidebar-wrapper">
      <Sidebar />
      {children}
    </div>
  );
};

export default ProfileLayout;
