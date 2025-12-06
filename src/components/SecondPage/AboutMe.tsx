import React from 'react';
import { SiDevbox } from '@icons-pack/react-simple-icons';
import { Github, MapIcon, Linkedin, ScrollText, Briefcase } from 'lucide-react';
import TMBLogo from '@assets/tmb.png';

export default function AboutMe() {
  return (
    <div className="max-w-4xl px-6">
      <h2 className="text-4xl text-left font-bold text-white mb-6 drop-shadow-lg">SOBRE MIM</h2>

      <div className="flex flex-col gap-4">
        {/* Card Principal de Informações */}
        <div className="p-6 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl hover:bg-white/10 transition-all duration-300 hover:border-orange-500/30 group">
          {/* Cabeçalho do Card */}
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 bg-orange-500/10 border border-orange-500/20 rounded-xl text-orange-400 group-hover:text-orange-300 group-hover:scale-110 transition-all duration-300">
              <SiDevbox size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white leading-none">
                João V. <span className="text-orange-400">Klabacher</span>
              </h3>
              <span className="text-xs text-gray-500 font-mono tracking-wider">
                DEVELOPER & PSYCHOLOGY STUDENT
              </span>
            </div>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent my-4" />

          {/* Lista de Informações */}
          <div className="space-y-3">
            <InfoRow icon={MapIcon} text="São Paulo, Brasil" />
            <InfoRow icon={ScrollText} text="Psychology - 6/10 Semesters" />

            <div className="flex items-center gap-3 text-gray-300 group/link">
              <div className="p-1.5 rounded-md bg-white/5 text-gray-400 group-hover/link:text-orange-400 transition-colors">
                <Briefcase size={16} />
              </div>
              <a
                href="https://www.instagram.com/oficial.tmb/"
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium hover:text-orange-300 transition-colors flex items-center gap-2"
              >
                @oficial.tmb
                <img
                  src={TMBLogo}
                  alt="TMB"
                  className="h-5 w-auto opacity-70 group-hover/link:opacity-100 transition-opacity"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Botões Sociais - Grid 2 Colunas Iguais */}
        <div className="grid grid-cols-2 gap-4">
          <SocialButton
            href="http://github.com/klabacher"
            icon={Github}
            label="Github"
            bgColor="bg-[#181717]"
            hoverColor="hover:bg-[#252525]"
          />
          <SocialButton
            href="https://www.linkedin.com/in/joaovitorklabacher/"
            icon={Linkedin}
            label="Linkedin"
            bgColor="bg-[#0A66C2]"
            hoverColor="hover:bg-[#004182]"
          />
        </div>

        {/* Card de Status */}
        <div className="p-5 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl hover:bg-white/10 transition-all flex items-center justify-between group cursor-default hover:border-green-500/30">
          <div className="flex flex-col gap-1.5">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              Status Atual
            </p>
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <div className="flex flex-col">
                <p className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors leading-none">
                  Em desenvolvimento
                </p>
                <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors mt-0.5">
                  Profissional e Acadêmico
                </p>
              </div>
            </div>
          </div>

          {/* <div className="hidden sm:block opacity-20 group-hover:opacity-100 group-hover:text-green-400 transition-all duration-500">
            <SiDevbox size={28} />
          </div> */}
        </div>

        {/* Card de Texto (Sobre Mim) */}
        <div className="p-6 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl hover:bg-white/10 transition-all duration-300 group cursor-default hover:border-orange-500/20">
          <div className="flex items-center gap-2 mb-3 opacity-60 group-hover:opacity-100 transition-opacity">
            <div className="h-px w-4 bg-orange-500/50"></div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Sobre mim
            </p>
          </div>

          <p className="text-sm text-gray-400 leading-relaxed text-justify group-hover:text-gray-200 transition-colors duration-300">
            Desde muito novo, fui fascinado por tecnologia e comportamento humano. Procuro auxiliar
            e desenvolver novas soluções e projetos que possam impactar positivamente a sociedade.
            Para isso, estou adentrando o campo do{' '}
            <span className="text-orange-400/80 group-hover:text-orange-400 transition-colors">
              OpenSource
            </span>{' '}
            e me especializando em temas diversos de desenvolvimento, tanto Front/Back end quanto
            desenvolvimento de sistemas e soluções para desenvolvedores.
          </p>
        </div>
      </div>
    </div>
  );
}

// --- Subcomponentes para Limpeza ---

function InfoRow({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div className="flex items-center gap-3 text-gray-300 hover:translate-x-1 transition-transform duration-300">
      <div className="p-1.5 rounded-md bg-white/5 text-gray-400">
        <Icon size={16} />
      </div>
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
}

function SocialButton({ href, icon: Icon, label, bgColor, hoverColor }: any) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`
        flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl 
        ${bgColor} ${hoverColor} border border-white/10 text-white 
        font-medium transition-all duration-300 
        hover:shadow-lg hover:-translate-y-1 hover:border-white/30 group
      `}
    >
      <Icon
        size={20}
        className="text-white/90 group-hover:scale-110 transition-transform duration-300"
      />
      <span className="tracking-wide text-sm">{label}</span>
    </a>
  );
}
