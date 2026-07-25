import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/50 pt-16 pb-8">
      <div className="container mx-auto max-w-6xl px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <span className="text-xl font-bold tracking-tight text-foreground">
                Restaurant<span className="text-primary">OS</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Modern restaurant operations. One platform.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-foreground mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground transition-colors">Features</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Workflow</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">AI Insights</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground transition-colors">About</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} RestaurantOS. All rights reserved.
          </p>
          <div className="flex gap-4">
            <div className="size-2 rounded-full bg-border" />
            <div className="size-2 rounded-full bg-border" />
            <div className="size-2 rounded-full bg-border" />
          </div>
        </div>
      </div>
    </footer>
  );
}
