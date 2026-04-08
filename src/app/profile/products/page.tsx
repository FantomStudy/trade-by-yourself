import { getCurrentUser } from "@/api/auth";
import { ProfileProducts } from "./_components/ProfileProducts";

const ProfileProductPage = async () => {
  const user = await getCurrentUser();

  return <ProfileProducts userId={user.id} />;
};

export default ProfileProductPage;
