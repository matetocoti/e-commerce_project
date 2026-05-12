
import { Logo } from "./ui/Logo";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="mt-auto border-t border-gray-200/80 bg-white py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-y-10 gap-x-6 md:grid-cols-5 lg:gap-x-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2 flex flex-col items-center text-center md:items-start md:text-left space-y-4">
            <Logo size="sm" variant="light" />
            <p className="text-sm text-gray-500 leading-relaxed max-w-[18rem]">
              Sua loja de tecnologia com os melhores produtos e preços do mercado.
            </p>
          </div>

          
          <div className="col-span-1">
            <h4 className="mb-4 text-xs font-bold tracking-wider text-gray-900 uppercase">Categorias</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><button className="hover:text-blue-600 transition-colors">Computadores</button></li>
              <li><button className="hover:text-blue-600 transition-colors">Smartphones</button></li>
              <li><button className="hover:text-blue-600 transition-colors">Áudio</button></li>
              <li><button className="hover:text-blue-600 transition-colors">Câmeras</button></li>
            </ul>
          </div>

          
          <div className="col-span-1">
            <h4 className="mb-4 text-xs font-bold tracking-wider text-gray-900 uppercase">Suporte</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><button className="hover:text-blue-600 transition-colors">Contato</button></li>
              <li><button className="hover:text-blue-600 transition-colors">FAQ</button></li>
              <li><button className="hover:text-blue-600 transition-colors">Devoluções</button></li>
              <li><button className="hover:text-blue-600 transition-colors">Garantia</button></li>
            </ul>
          </div>

         
          <div className="col-span-2 sm:col-span-1 md:col-span-1">
            <h4 className="mb-4 text-xs font-bold tracking-wider text-gray-900 uppercase">Sobre</h4>
            <ul className="space-y-3 text-sm text-gray-500 flex flex-col">
              <li><button className="hover:text-blue-600 transition-colors">Quem Somos</button></li>
              <li><button className="hover:text-blue-600 transition-colors">Carreiras</button></li>
              <li><button className="hover:text-blue-600 transition-colors">Privacidade</button></li>
              <li><button className="hover:text-blue-600 transition-colors">Termos</button></li>
            </ul>
          </div>
        </div>

        
        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-gray-100 pt-6 sm:flex-row sm:gap-4">
          <p className="text-xs text-gray-400 text-center sm:text-left">
            © {currentYear} TechStore. Todos os direitos reservados.
          </p>
          
          <div className="flex flex-wrap justify-center items-center gap-5 text-gray-400">
            <button className="hover:text-blue-600 transition-colors text-[11px] font-medium uppercase tracking-wider" aria-label="Twitter">Twitter</button>
            <button className="hover:text-blue-600 transition-colors text-[11px] font-medium uppercase tracking-wider" aria-label="Instagram">Instagram</button>
            <button className="hover:text-blue-600 transition-colors text-[11px] font-medium uppercase tracking-wider" aria-label="LinkedIn">LinkedIn</button>
          </div>
        </div>
      </div>
    </footer>
  );
}