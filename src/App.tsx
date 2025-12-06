// src/App.tsx
import './App.css';
import AnimatedBackground from './components/Background/AnimatedBackground';
import ForegroundLayer from './components/ForegroundLayer';
import SecondLayer from './components/SecondLayer';
import WeatherControls from './components/Background/WeatherControls';

function App() {
  return (
    <div className="relative w-full h-screen overflow-y-auto overflow-x-hidden bg-gray-900 scroll-smooth snap-y snap-mandatory">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <AnimatedBackground />
      </div>

      <WeatherControls />

      <section className="relative w-screen h-screen z-10 pointer-events-none snap-start">
        <div className="w-full h-full pointer-events-none">
          <ForegroundLayer />
        </div>
      </section>

      <section
        id="about"
        className="relative w-full h-screen z-10 flex items-center justify-center snap-start pointer-events-auto"
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm -z-10"></div>

        <SecondLayer />
      </section>
    </div>
  );
}

export default App;
