/**
 * Public Layout — Minimal shell for guest-facing surfaces.
 * Routes: /, /reservations, /menu/[table_id]/[token]
 *
 * No authentication, no staff navigation.
 */

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {children}
    </div>
  );
}
