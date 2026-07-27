import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/50 pt-16 pb-8">
      <div className="container mx-auto max-w-6xl px-4 md:px-8">
        <div className="flex flex-col items-center justify-center text-center gap-6 mb-8">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold tracking-tight text-foreground">
              Restaurant<span className="text-primary">OS</span>
            </span>
          </Link>
          <p className="text-base text-muted-foreground font-light">
            AI-powered operating system for restaurants.
          </p>
        </div>
        
        <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground font-light">
            &copy; 2026 RestaurantOS. All rights reserved.
          </p>
          <div className="flex gap-8 text-sm text-muted-foreground font-light">
            <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
