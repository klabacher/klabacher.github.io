// src/components/FrontPage/index.tsx
import AnimatedBackground from '@components/Utils/Background/AnimatedBackground';
import ForegroundLayer from '@components/FrontPage/ForegroundLayer';
import SecondLayer from '@components/FrontPage/AboutLayer';
import WeatherControls from '@components/Utils/Background/WeatherControls';

export default function FrontPage() {
  return (
    <div className="no-scrollbar relative w-full h-screen overflow-y-auto overflow-x-hidden bg-gray-900 scroll-smooth snap-y snap-mandatory">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <AnimatedBackground />
      </div>

      <WeatherControls />

      <section className="relative w-full h-screen z-10 pointer-events-none snap-start">
        <div className="w-full h-full pointer-events-none">
          <ForegroundLayer />
        </div>
      </section>

      <section
        id="about"
        className="relative w-full h-screen z-10 flex items-center justify-center snap-start pointer-events-auto"
      >
        {/* O backdrop agora vai alinhar perfeitamente com a seção de cima */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm -z-10"></div>

        <SecondLayer />
      </section>
    </div>
  );
}
