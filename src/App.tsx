// src/App.tsx
import './App.css';
import AnimatedBackground from './components/Background/AnimatedBackground';
import ForegroundLayer from './components/ForegroundLayer';
import SecondLayer from './components/SecondLayer';
import WeatherControls from './components/Background/WeatherControls';

function App() {
  return (
    <div
      data-app-scroll
      className="app-scroll no-scrollbar relative w-full overflow-y-auto overflow-x-hidden bg-gray-900 scroll-smooth snap-y snap-proximity lg:snap-mandatory"
    >
      <div className="fixed inset-0 z-0 pointer-events-none">
        <AnimatedBackground />
      </div>

      <WeatherControls />

      <section className="hero-section relative z-10 w-full pointer-events-none snap-start">
        <div className="w-full h-full pointer-events-none">
          <ForegroundLayer />
        </div>
      </section>

      <section
        id="about"
        className="about-section relative z-10 flex w-full items-start justify-center px-4 py-20 pointer-events-auto snap-start sm:px-6 lg:items-center lg:px-8"
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm -z-10"></div>

        <SecondLayer />
      </section>
    </div>
  );
}

export default App;
