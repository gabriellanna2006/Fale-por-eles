export default function Footer() {
  const developers = [
    'Gabriel Barbosa',
    'Thayrik Gabriel',
    'Davi Valle',
    'Lara Stafany',
    'Kaiky André',
  ];

  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto py-8 px-4 md:px-6 text-center">
        <p className="text-sm">
          Desenvolvido para o projeto ACE Univertix 2025.
        </p>
        <p className="text-xs text-white/70 mt-2">
          Por: {developers.join(', ')}.
        </p>
        <p className="text-xs text-white/70 mt-4">
          © {new Date().getFullYear()} Fale Pelos Animais. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
