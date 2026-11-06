import { Suspense } from "react";
import { AppShell } from "@/components/app-shell";
import { Skeleton } from "@/components/ui";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-10">
          <Skeleton lines={4} />
        </div>
      }
    >
      <AppShell>{children}</AppShell>
    </Suspense>
  );
}
