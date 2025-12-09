import AuthTestingMode from "@/app/components/Pages/AuthTest/AuthTestingMode";
import PageLayout from "@/app/components/UI/PageLayout/PageLayout";

export default function AuthTestingModePage() {
  return (
    <PageLayout
      padding={false}
      showNavBar={false}
      showFooter={false}
      auroraBackground={true}
    >
      <AuthTestingMode />
    </PageLayout>
  );
}