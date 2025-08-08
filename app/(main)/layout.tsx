import '../../app/globals.css';
import LayoutShell from './layoutShell';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <LayoutShell>{children}</LayoutShell>
    </div>
  );
}
