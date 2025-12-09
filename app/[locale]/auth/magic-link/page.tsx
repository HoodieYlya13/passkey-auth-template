import PageLayout from "../../../components/UI/PageLayout/PageLayout";
import { redirect } from "next/navigation";
import MagicLink from "@/app/components/Pages/Auth/MagicLink/MagicLink";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function LoginPage({ searchParams }: PageProps) {
  const { token } = await searchParams;

  if (!token || Array.isArray(token)) redirect("/auth/login");

  return (
    <PageLayout>
      <MagicLink token={token} />
    </PageLayout>
  );
}