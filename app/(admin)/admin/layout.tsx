import { Providers } from "@/components/providers/Providers";

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <main>{children}</main>
    </Providers>
  );
}

export default AdminLayout;
