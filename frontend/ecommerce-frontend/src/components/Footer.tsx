
import { Logo } from "./ui/Logo";

export function Footer() {
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className="mt-auto border-t border-gray-200 bg-white pt-10 pb-8 sm:pt-16 sm:pb-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4 lg:gap-12">
              <div className="flex flex-col space-y-3">
              <Logo size="sm" variant="light" />
              <p className="text-sm sm:text-base text-gray-500 leading-relaxed max-w-xs">
                Sua loja de tecnologia com os melhores produtos e preços do mercado.
              </p>
            </div>

              <div>
                <h4 className="mb-4 sm:mb-5 font-semibold text-gray-900">Categorias</h4>
                <ul className="space-y-2.5 sm:space-y-3 text-sm sm:text-base text-gray-500">
                  <li><button className="hover:text-blue-600 transition-colors text-left">Computadores</button></li>
                  <li><button className="hover:text-blue-600 transition-colors text-left">Smartphones</button></li>
                  <li><button className="hover:text-blue-600 transition-colors text-left">Áudio</button></li>
                  <li><button className="hover:text-blue-600 transition-colors text-left">Câmeras</button></li>
                </ul>
              </div>

              <div>
                <h4 className="mb-4 sm:mb-5 font-semibold text-gray-900">Suporte</h4>
                <ul className="space-y-2.5 sm:space-y-3 text-sm sm:text-base text-gray-500">
                  <li><button className="hover:text-blue-600 transition-colors text-left">Contato</button></li>
                  <li><button className="hover:text-blue-600 transition-colors text-left">FAQ</button></li>
                  <li><button className="hover:text-blue-600 transition-colors text-left">Política de Devolução</button></li>
                  <li><button className="hover:text-blue-600 transition-colors text-left">Garantia</button></li>
                </ul>
              </div>

              <div>
                <h4 className="mb-4 sm:mb-5 font-semibold text-gray-900">Sobre</h4>
                <ul className="space-y-2.5 sm:space-y-3 text-sm sm:text-base text-gray-500">
                  <li><button className="hover:text-blue-600 transition-colors text-left">Quem Somos</button></li>
                  <li><button className="hover:text-blue-600 transition-colors text-left">Trabalhe Conosco</button></li>
                  <li><button className="hover:text-blue-600 transition-colors text-left">Privacidade</button></li>
                  <li><button className="hover:text-blue-600 transition-colors text-left">Termos de Uso</button></li>
                </ul>
              </div>
            </div>

            <div className="mt-10 sm:mt-16 flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 pt-8 gap-4 px-2">
              <p className="text-sm text-gray-500 text-center sm:text-left">
                © {currentYear} TechStore. Todos os direitos reservados.
              </p>
              <div className="flex gap-4 text-sm text-gray-400">
                 {/* Espaço para redes sociais se precisar no futuro */}
                 <span className="hover:text-gray-600 transition-colors cursor-pointer">Twitter</span>
                 <span className="hover:text-gray-600 transition-colors cursor-pointer">Instagram</span>
                 <span className="hover:text-gray-600 transition-colors cursor-pointer">LinkedIn</span>
              </div>
            </div>
          </div>

        </footer>
    );
}