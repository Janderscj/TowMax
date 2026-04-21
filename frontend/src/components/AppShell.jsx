import AppFooter from './AppFooter';

/**
 * AppShell: Top-level layout wrapper
 *
 * Provides:
 * - Consistent width (100% with max-width: 480px)
 * - Proper spacing and alignment
 * - Body and footer structure
 * - Mobile-first responsive design
 *
 * Note: Header is rendered by individual screens with screen-specific props.
 * This component wraps the scrollable body area and footer.
 *
 * Structure:
 * <AppShell>
 *   <main> content (screens with AppHeader) </main> (scrollable)
 *   <AppFooter /> (at bottom)
 * </AppShell>
 */
export default function AppShell({ children }) {
  return (
    <div className="app-shell">
      <main className="app-body">{children}</main>
      <AppFooter />
    </div>
  );
}
