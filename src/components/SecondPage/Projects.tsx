import { useState } from 'react';
import { useDispatch } from 'react-redux'; // Importar dispatch
import { setModalOpen } from '../../store/slices/appSlice'; // Importar a ação
import PROJECTS_DATA from '../../Data/ProjectData';
import { TechTag } from '../IconMagic';
import ProjectModal, { ProjectData } from '../ProjectModal';

export default function Projects() {
  const dispatch = useDispatch(); // Hook
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenProject = (project: ProjectData) => {
    setSelectedProject(project);
    setIsModalOpen(true);
    dispatch(setModalOpen(true)); // Avisa globalmente que abriu
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    dispatch(setModalOpen(false)); // Avisa globalmente que fechou
    setTimeout(() => setSelectedProject(null), 300);
  };

  return (
    <>
      <div className="w-full min-w-0 text-center md:col-span-2 xl:col-span-1">
        <h2 className="mb-6 text-left text-3xl font-bold text-white drop-shadow-lg xl:text-right">
          MEUS PROJETOS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          {PROJECTS_DATA.map(project => (
            <button
              type="button"
              key={project.id}
              onClick={() => handleOpenProject(project)}
              className="group relative w-full overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/30 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(249,115,22,0.15)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400"
            >
              {/* Efeito de brilho no hover */}
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />

              <h3 className="text-xl font-bold text-orange-400 mb-2 group-hover:text-orange-300 transition-colors">
                {project.title}
              </h3>
              <p className="text-gray-400 text-sm mb-4">{project.shortDescription}</p>

              {/* Preview das tecnologias */}
              <div className="flex flex-wrap gap-2 mt-auto opacity-80 group-hover:opacity-100 transition-opacity">
                {project.techStack.slice(0, 3).map(tech => (
                  <TechTag key={tech.name} name={tech.name} icon={tech.icon} />
                ))}

                {project.techStack.length > 3 && (
                  <span className="text-[10px] text-gray-500 self-center pl-1">
                    +{project.techStack.length - 3}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <ProjectModal project={selectedProject} isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
}
