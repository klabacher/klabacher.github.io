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
import IconR, { SmallIcon } from './IconMagic';

import React, { useState } from 'react';
import ProjectModal, { ProjectData } from './ProjectModal';
import PROJECTS_DATA from '../Data/ProjectData';

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
            Desenvolvedor Fullstack <span></span>
          </p>
        </div>
        <div className="p-6 bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all cursor-pointer">
          <p>Em desenvolvimento</p>
          <div className="grid grid-cols-3">
            <IconR component={[{ icon: SiDevbox, name: 'Devbox' }]} size={12} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Projects() {
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenProject = (project: ProjectData) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300); // Limpa após animação
  };

  return (
    <>
      <div className="max-w-4xl px-6 text-center">
        <h2 className="text-4xl text-right font-bold text-white mb-6 drop-shadow-lg">
          Meus Projetos
        </h2>
        <p className="text-gray-300 text-right text-lg leading-relaxed mb-8">
          Clique nos cards para ver detalhes
        </p>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          {PROJECTS_DATA.map(project => (
            <div
              key={project.id}
              onClick={() => handleOpenProject(project)}
              className="group relative p-6 bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all duration-300 cursor-pointer rounded-xl overflow-hidden hover:shadow-[0_0_30px_rgba(249,115,22,0.15)] hover:border-orange-500/30 hover:-translate-y-1"
            >
              {/* Efeito de brilho no hover */}
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />

              <h3 className="text-xl font-bold text-orange-400 mb-2 group-hover:text-orange-300 transition-colors">
                {project.title}
              </h3>
              <p className="text-gray-400 text-sm mb-4">{project.shortDescription}</p>

              {/* Preview das tecnologias */}
              <div className="flex flex-wrap gap-2 mt-auto opacity-60 group-hover:opacity-100 transition-opacity">
                {project.techStack.slice(0, 3).map(tech => (
                  <span
                    key={tech.name}
                    className="text-[10px] border border-white/20 px-2 py-0.5 rounded text-gray-300"
                  >
                    <SmallIcon name={tech.name} icon={tech.icon} size={48} />
                    {tech.name}
                  </span>
                ))}
                {project.techStack.length > 3 && (
                  <span className="text-[10px] text-gray-500">...</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- O MODAL --- */}
      <ProjectModal project={selectedProject} isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
}

function TechStack() {
  return (
    <div className="max-w-2xl px-6 justify-center text-center">
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

export default function SecondLayer() {
  return (
    <div className="flex flex-row gap-10">
      <AboutMe />
      <TechStack />
      <Projects />
    </div>
  );
}
