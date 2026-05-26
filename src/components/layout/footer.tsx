import Link from "next/link";
import { GraduationCap, Github, Twitter, Linkedin, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/20 pb-8 pt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 lg:gap-8">
          {/* Brand & Description */}
          <div className="md:col-span-1">
            <Link href="/" className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">EduVault</span>
            </Link>
            <p className="mb-6 text-sm text-muted-foreground leading-relaxed">
              Empowering students to make informed decisions. Discover, compare, and apply to top colleges worldwide with ease.
            </p>
            <div className="flex items-center gap-4 text-muted-foreground">
              <Link href="#" className="hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </Link>
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8 md:col-span-3 lg:grid-cols-3">
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
                Platform
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link href="/colleges" className="hover:text-primary transition-colors">Find Colleges</Link>
                </li>
                <li>
                  <Link href="/compare" className="hover:text-primary transition-colors">Compare Programs</Link>
                </li>
                <li>
                  <Link href="/scholarships" className="hover:text-primary transition-colors">Scholarships</Link>
                </li>
                <li>
                  <Link href="/reviews" className="hover:text-primary transition-colors">Student Reviews</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
                Company
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-primary transition-colors">Careers</Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-primary transition-colors">Blog & News</Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
                </li>
              </ul>
            </div>
            <div className="col-span-2 lg:col-span-1 mt-8 lg:mt-0">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
                Legal
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/cookies" className="hover:text-primary transition-colors">Cookie Policy</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t pt-8 text-sm text-muted-foreground md:flex-row">
          <p>© {currentYear} EduVault, Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              Made with <span className="text-red-500">♥</span> for students
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
