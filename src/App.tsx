// src/App.tsx
import './App.css';
import AnimatedBackground from './components/AnimatedBackground';
import ForegroundLayer from './components/ForegroundLayer';
import SecondLayer from './components/SecondLayer';
import WeatherControls from './components/WeatherControls';

function App() {
  return (
    // 1. Mudamos overflow-hidden para overflow-y-auto
    // 2. Adicionamos scroll-smooth para suavizar qualquer link âncora ou scroll via JS
    // 3. snap-y snap-mandatory: Isso cria aquele efeito de "travar" a tela na seção certa (opcional, mas fica premium)
    <div className="relative w-screen h-screen overflow-y-auto overflow-x-hidden bg-gray-900 scroll-smooth snap-y snap-mandatory">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <AnimatedBackground />
      </div>

      {/* CONTROLES DE CLIMA (Fixo, acima de tudo) */}
      <WeatherControls />

      {/* SEÇÃO 1 */}
      <section className="relative w-screen h-screen z-10 pointer-events-none snap-start">
        <div className="w-full h-full pointer-events-none">
          <ForegroundLayer />
        </div>
      </section>

      {/* SEÇÃO 2: Projetos / Sobre (Ocupa 100vh) */}
      <section
        id="about"
        className="relative w-screen h-screen z-10 flex items-center justify-center snap-start pointer-events-auto"
      >
        {/* Fundo levemente escurecido para o texto ter leitura sobre o background animado */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm -z-10"></div>

        <SecondLayer />
      </section>
    </div>
  );
}

export default App;
