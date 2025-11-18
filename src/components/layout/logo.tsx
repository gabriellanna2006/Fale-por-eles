import { PawPrint } from 'lucide-react';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3" aria-label="Página inicial Fale Pelos Animais">
      <div className="bg-white/20 p-2 rounded-full">
        <PawPrint className="h-6 w-6 text-white" />
      </div>
      <span className="text-xl font-bold text-white font-headline tracking-tight">
        Fale Pelos Animais
      </span>
    </Link>
  );
}
