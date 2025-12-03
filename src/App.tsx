import './App.css';
import AnimatedBackground from './components/animatedBackground';

function App() {
  return (
    <div
      className={`h-screen w-screen transition-all duration-500 p-0 m-0 overflow-hidden bg-transparent`}
    >
      <AnimatedBackground />
      <section className="max-w-5xl mx-auto px-6 py-12">
        <header className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6"></header>
      </section>
    </div>
  );
}

export default App;
