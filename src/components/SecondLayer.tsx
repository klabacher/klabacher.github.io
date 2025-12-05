import React from 'react';
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
} from '@icons-pack/react-simple-icons';

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
            Nasciso em fevereiro de 2005, tenho 20 anos. Apaixonado por Tecnologia
          </p>
        </div>
        <div className="p-6 bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all cursor-pointer">
          <h3 className="text-xl font-bold text-orange-400 mb-2">Projeto B</h3>
          <p className="text-gray-400 text-sm">Outra solução tecnológica avançada.</p>
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
    <div className="max-w-4xl px-6 justify-center text-center">
      <h2 className="text-lg font-bold text-white mb-4 drop-shadow-lg">Tech Stack</h2>

      <div className="grid grid-cols-1 gap-6 items-center text-center">
        <div className="p-3 size-auto justify-center rounded-md text-white border border-white/10 shadow-2xl font-sans transition-all z-50 ">
          <SiTypescript size={48} className="mx-auto mb-2" />
          <p className="text-gray-400 text-sm">TypeScript</p>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <div className="p-3 size-auto justify-center rounded-md text-white border border-white/10 shadow-2xl font-sans transition-all z-50 ">
            <SiPython size={48} className="mx-auto mb-2" />
            <p className="text-gray-400 text-sm">Python</p>
          </div>
          <div className="p-3 size-auto justify-center rounded-md text-white border border-white/10 shadow-2xl font-sans transition-all z-50 ">
            <SiPandas size={48} className="mx-auto mb-2" />
            <p className="text-gray-400 text-sm">Pandas</p>
          </div>
        </div>
        <div className="p-3 size-auto justify-center rounded-md text-white border border-white/10 shadow-2xl font-sans transition-all z-50 ">
          <SiReact size={48} className="mx-auto mb-2" />
          <p className="text-gray-400 text-sm">React</p>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <div className="p-3 size-auto justify-center rounded-md text-white border border-white/10 shadow-2xl font-sans transition-all z-50 ">
            <SiVite size={48} className="mx-auto mb-2" />
            <p className="text-gray-400 text-sm">Vite</p>
          </div>
          <div className="p-3 size-auto justify-center rounded-md text-white border border-white/10 shadow-2xl font-sans transition-all z-50 ">
            <SiRedux size={48} className="mx-auto mb-2" />
            <p className="text-gray-400 text-sm">Redux</p>
          </div>
          <div className="p-3 size-auto justify-center rounded-md text-white border border-white/10 shadow-2xl font-sans transition-all z-50 ">
            <SiTailwindcss size={48} className="mx-auto mb-2" />
            <p className="text-gray-400 text-sm">Tailwind CSS</p>
          </div>
          <div className="p-3 size-auto justify-center rounded-md text-white border border-white/10 shadow-2xl font-sans transition-all z-50 ">
            <SiReactrouter size={48} className="mx-auto mb-2" />
            <p className="text-gray-400 text-sm">React Router</p>
          </div>
        </div>
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
