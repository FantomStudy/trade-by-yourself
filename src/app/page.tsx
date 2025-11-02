import { LoginForm } from "@/features/auth/components/LoginForm";
import { RecoverForm } from "@/features/auth/components/RecoverForm";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

const Home = () => {
  return (
    <main>
      <LoginForm />
      {/* <RecoverForm /> */}
    </main>
  );
};

export default Home;
