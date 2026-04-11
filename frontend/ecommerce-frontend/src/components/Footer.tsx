

export function Footer() {
    return (
        <footer className="mt-12 border-t bg-white py-8">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid gap-8 md:grid-cols-4">
              <div>
                <h3 className="mb-4 font-bold">TechStore</h3>
                <p className="text-sm text-gray-600">
                  Sua loja de tecnologia com os melhores produtos e preços.
                </p>
              </div>

              <div>
                <h4 className="mb-4 font-semibold">Categorias</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>Computadores</li>
                  <li>Smartphones</li>
                  <li>Áudio</li>
                  <li>Câmeras</li>
                </ul>
              </div>

              <div>
                <h4 className="mb-4 font-semibold">Suporte</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>Contato</li>
                  <li>FAQ</li>
                  <li>Política de Devolução</li>
                  <li>Garantia</li>
                </ul>
              </div>

              <div>
                <h4 className="mb-4 font-semibold">Sobre</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>Quem Somos</li>
                  <li>Trabalhe Conosco</li>
                  <li>Privacidade</li>
                  <li>Termos de Uso</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 border-t pt-8 text-center text-sm text-gray-600">
              © 2026 TechStore. Todos os direitos reservados.
            </div>
          </div>
        </footer>
    );
}