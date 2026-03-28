import LoginForm from "./LoginForm";

type LoginPageProps = {
  searchParams: Promise<{
    registered?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const isRegistered = params.registered === "1";

  return <LoginForm isRegistered={isRegistered} />;
}
