import AnimatedBackground from '../Utils/Background/AnimatedBackground';
import WeatherControls from '../Utils/Background/WeatherControls';

function DashboardLayer() {
  return (
    <div className="flex flex-col justify-between w-full h-full pointer-events-none">
      <header className="fixed top-0 left-0 right-0 flex items-center justify-between w-full p-6 pointer-events-auto z-50">
        <div className="px-4 py-2 font-bold tracking-tighter text-white border rounded-lg bg-white/5 border-white/10 backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.2)]">
          J. KLABACHER
        </div>

        <nav className="flex gap-4">
          {/* <SocialLink icon={<Github />} href="https://github.com/klabacher/" />
          <SocialLink
            icon={<LinkedinIcon size={20} />}
            href="https://www.linkedin.com/in/joaovitorklabacher/"
          /> */}
        </nav>
      </header>

      <main className="flex items-center justify-center grow w-full">
        <div className="pointer-events-auto will-change-transform">
          <div className="text-center group">
            <div className="inline-block p-8 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.3)] text-white max-w-md w-full">
              <h2 className="text-3xl font-bold mb-6">Login</h2>
              <form className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
                >
                  Sign In
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <div className="h-28" />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="no-scrollbar relative w-full h-screen overflow-y-auto overflow-x-hidden bg-gray-900 scroll-smooth snap-y snap-mandatory">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <AnimatedBackground />
      </div>

      <WeatherControls />

      <section className="relative w-full h-screen z-10 pointer-events-none snap-start">
        <div className="w-full h-full pointer-events-none">
          <DashboardLayer />
        </div>
      </section>
    </div>
  );
}
