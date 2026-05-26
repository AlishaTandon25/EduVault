import Link from "next/link";
import { GraduationCap, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo & Desktop Nav */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                <GraduationCap className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold tracking-tight">EduVault</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
              <Link href="/colleges" className="transition-colors hover:text-foreground">
                Colleges
              </Link>
              <Link href="/compare" className="transition-colors hover:text-foreground">
                Compare
              </Link>
              <Link href="/dashboard" className="transition-colors hover:text-foreground">
                Dashboard
              </Link>
            </nav>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-4">
            <div className="relative hidden lg:flex w-full max-w-sm items-center">
              <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search colleges, courses..."
                className="w-[300px] pl-9 bg-muted/50 border-none focus-visible:ring-1 transition-all rounded-full"
              />
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" className="rounded-full">Log in</Button>
              <Button className="rounded-full shadow-md shadow-primary/20 transition-transform hover:translate-y-[-2px]">
                Sign up
              </Button>
            </div>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger
                render={
                  <Button variant="ghost" size="icon" className="shrink-0 md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                  </Button>
                }
              />
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-6 pt-6">
                  <Link href="/" className="flex items-center gap-2 font-bold text-lg">
                    <GraduationCap className="h-6 w-6 text-primary" />
                    EduVault
                  </Link>
                  <div className="flex flex-col gap-3 text-sm font-medium">
                    <Link href="/colleges" className="text-muted-foreground hover:text-foreground transition-colors">Colleges</Link>
                    <Link href="/compare" className="text-muted-foreground hover:text-foreground transition-colors">Compare</Link>
                    <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
                  </div>
                  <div className="flex flex-col gap-2 mt-4">
                    <Button variant="outline" className="w-full justify-center">Log in</Button>
                    <Button className="w-full justify-center">Sign up</Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
