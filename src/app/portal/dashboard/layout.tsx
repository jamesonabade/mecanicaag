import { CustomerPortalLayout } from '@/components/layout/CustomerPortalLayout';

export default function AuthenticatedCustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CustomerPortalLayout>{children}</CustomerPortalLayout>;
}
