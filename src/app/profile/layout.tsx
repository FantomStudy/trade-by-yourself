import { Sidebar } from "./_components";

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="global-container sidebar-wrapper">
      <Sidebar />
      {children}
    </div>
  );
};

export default ProfileLayout;
