// src/App.tsx
import './App.css';
import AnimatedBackground from './components/AnimatedBackground';
import ForegroundLayer from './components/ForegroundLayer';

function App() {
  return (
    // 1. Mudamos overflow-hidden para overflow-y-auto
    // 2. Adicionamos scroll-smooth para suavizar qualquer link âncora ou scroll via JS
    // 3. snap-y snap-mandatory: Isso cria aquele efeito de "travar" a tela na seção certa (opcional, mas fica premium)
    <div className="relative w-screen h-screen overflow-y-auto overflow-x-hidden bg-gray-900 scroll-smooth snap-y snap-mandatory">
      {/* BACKGROUND FIXO: Fica parado enquanto o conteúdo rola por cima */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <AnimatedBackground />
      </div>

      {/* SEÇÃO 1: Hero (Ocupa 100vh) */}
      {/* snap-start faz o scroll "grudar" aqui se o usuário soltar perto */}
      <section className="relative w-screen h-screen z-10 pointer-events-none snap-start">
        {/* Passamos o pointer-events-none para que os cliques atravessem para o background se necessário */}
        <div className="w-full h-full pointer-events-none">
          <ForegroundLayer />
        </div>
      </section>

      {/* SEÇÃO 2: Projetos / Sobre (Ocupa 100vh) */}
      <section className="relative w-screen h-screen z-10 flex items-center justify-center snap-start pointer-events-auto">
        {/* Fundo levemente escurecido para o texto ter leitura sobre o background animado */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm -z-10"></div>

        <div className="max-w-4xl px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6 drop-shadow-lg">Meus Projetos</h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-8">
            Aqui você pode colocar a cópia da tela ou o conteúdo da próxima seção. O scroll suave te
            trouxe até aqui.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all cursor-pointer">
              <h3 className="text-xl font-bold text-orange-400 mb-2">Projeto A</h3>
              <p className="text-gray-400 text-sm">
                Descrição breve do projeto incrível desenvolvido.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all cursor-pointer">
              <h3 className="text-xl font-bold text-orange-400 mb-2">Projeto B</h3>
              <p className="text-gray-400 text-sm">Outra solução tecnológica avançada.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
