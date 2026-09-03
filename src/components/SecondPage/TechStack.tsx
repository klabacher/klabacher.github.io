import {
  SiReact,
  SiVite,
  SiTypescript,
  SiRedux,
  SiTailwindcss,
  SiReactrouter,
  SiPython,
  SiPandas,
  SiLanggraph,
  SiOpenai,
  SiGooglegemini,
  SiDocker,
  SiGit,
  SiVitest,
  SiJest,
  SiNumpy,
} from '@icons-pack/react-simple-icons';
import IconR from '../IconMagic';

export default function TechStack() {
  return (
    <div className="w-full min-w-0 justify-center text-center">
      <h2 className="text-lg font-bold text-white mb-4 drop-shadow-lg">Tech Stack</h2>

      <div className="grid grid-cols-1 gap-4 items-center text-center">
        <IconR
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
        <IconR
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
        <IconR
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
