import {
  SiReact,
  SiVite,
  SiTypescript,
  SiRedux,
  SiTailwindcss,
  SiReactrouter,
  SiPython,
  SiPandas,
  SiDevbox,
  SiLanggraph,
  SiOpenai,
  SiGooglegemini,
  SiDocker,
  SiGit,
  SiVitest,
  SiJest,
  SiNumpy,
} from '@icons-pack/react-simple-icons';
import Icon from './IconMagic';

function AboutMe() {
  return (
    <div className="max-w-4xl px-6 text-center">
      <h2 className="text-4xl text-left font-bold text-white mb-6 drop-shadow-lg">Sobre mim:</h2>
      {/* <p className="text-gray-300 text-left text-lg leading-relaxed mb-8">Sobre</p> */}

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <div className="p-6 bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all cursor-pointer">
          <h3 className="flex gap-2 items-center text-xl text-left font-bold text-white mb-2">
            <SiDevbox />
            João V <span className="text-orange-400">Klabacher:</span>
          </h3>
          <hr className="border-white/10 mb-4" />

          <p className="text-gray-400 text-sm">
            Olá! Sou um desenvolvedor front-end apaixonado por criar experiências digitais
            envolventes e funcionais.
          </p>
        </div>
        <div className="p-6 bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all cursor-pointer">
          <p>Em desenvolvimento</p>
          <div className="grid grid-cols-3">
            <Icon component={[{ icon: SiDevbox, name: 'Devbox' }]} size={12} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Projects() {
  return (
    <div className="max-w-4xl px-6 text-center">
      <h2 className="text-4xl text-right font-bold text-white mb-6 drop-shadow-lg">
        Meus Projetos
      </h2>
      <p className="text-gray-300 text-right text-lg leading-relaxed mb-8">WIP</p>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <div className="p-6  bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all cursor-pointer">
          <h3 className="text-xl font-bold text-orange-400 mb-2">Projeto A</h3>
          <p className="text-gray-400 text-sm">Descrição breve do projeto incrível desenvolvido.</p>
        </div>
        <div className="p-6  bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all cursor-pointer">
          <h3 className="text-xl font-bold text-orange-400 mb-2">Projeto B</h3>
          <p className="text-gray-400 text-sm">Outra solução tecnológica avançada.</p>
        </div>
      </div>
    </div>
  );
}

export function TechStack() {
  return (
    <div className="max-w-2xl px-6 justify-center text-center">
      <h2 className="text-lg font-bold text-white mb-4 drop-shadow-lg">Tech Stack</h2>

      <div className="grid grid-cols-1 gap-4 items-center text-center">
        <Icon
          component={[{ icon: SiPython, name: 'Python' }]}
          size={'big'}
          subStack={[
            { icon: SiLanggraph, name: 'Langgraph' },
            { icon: SiPandas, name: 'Pandas' },
            { icon: SiNumpy, name: 'NumPy' },
            { icon: SiOpenai, name: 'OpenAI' },
            { icon: SiGooglegemini, name: 'Google Gemini' },
          ]}
          text="Backend & Ciência de Dados/IA"
        />
        <Icon
          component={[
            { icon: SiReact, name: 'React' },
            { icon: SiTypescript, name: 'TypeScript' },
          ]}
          size={'big'}
          text="Frontend Responsivo"
          subStack={[
            { icon: SiVite, name: 'Vite' },
            { icon: SiRedux, name: 'Redux' },
            { icon: SiTailwindcss, name: 'Tailwind CSS' },
            { icon: SiReactrouter, name: 'React Router' },
          ]}
        />
        <Icon
          component={[
            { icon: SiDocker, name: 'Docker' },
            { icon: SiGit, name: 'Git' },
          ]}
          size={'big'}
          text="CI/CD & Versionamento"
          subStack={[
            { icon: SiVitest, name: 'Vitest' },
            { icon: SiJest, name: 'Jest' },
          ]}
        />
      </div>
    </div>
  );
}

export default function SecondLayer() {
  return (
    <div className="flex flex-row gap-10">
      <AboutMe />
      <TechStack />
      <Projects />
    </div>
  );
}
