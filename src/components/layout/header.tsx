'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Menu, X } from 'lucide-react';

import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';

const navLinks = [
  { href: '/#report', label: 'Denunciar' },
  { href: '/reports', label: 'Denúncias' },
  { href: '/#map', label: 'Mapa' },
  { href: '/#resources', label: 'Recursos' },
  { href: '/#education', label: 'Educação' },
];

export default function Header() {
  const [isSheetOpen, setSheetOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-primary shadow-lg">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Logo />
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-white/80 hover:text-white transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-4">
          <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/#report">
              Fazer Denúncia <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 hover:text-white">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Abrir menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-primary text-white border-l-0">
             <div className="flex justify-between items-center mb-8">
               <Logo />
               <SheetClose asChild>
                 <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 hover:text-white">
                   <X className="h-6 w-6" />
                 </Button>
               </SheetClose>
             </div>
            <nav className="flex flex-col space-y-4 text-lg">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setSheetOpen(false)} className="text-white/80 hover:text-white transition-colors">
                  {link.label}
                </Link>
              ))}
            </nav>
            <Button asChild size="lg" className="w-full mt-8 bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => setSheetOpen(false)}>
              <Link href="/#report">
                Fazer Denúncia <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
