import { PageLayout } from "@/components/templates/PageLayout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageLayout>{children}</PageLayout>;
}
