import { SiDevbox } from '@icons-pack/react-simple-icons';
import { Github, MapIcon, Linkedin, ScrollText, Briefcase } from 'lucide-react';
import TMBLogo from '@assets/tmb.png';

export default function AboutMe() {
  return (
    // Reduzi o padding lateral global de px-6 para px-4
    <div className="max-w-3xl mx-auto px-4">
      {/* Reduzi o tamanho do título e a margem inferior */}
      <h2 className="text-2xl text-left font-bold text-white mb-4 drop-shadow-lg tracking-tight">
        SOBRE MIM
      </h2>

      {/* Reduzi o gap entre os cards principais de gap-4 para gap-3 */}
      <div className="flex flex-col gap-3">
        {/* --- Card Principal de Informações --- */}
        {/* Reduzi padding de p-6 para p-4. Mantive rounded-2xl. */}
        <div className="p-4 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl hover:bg-white/10 transition-all duration-300 hover:border-orange-500/30 group">
          {/* Cabeçalho do Card: Reduzi mb-5 para mb-3 */}
          <div className="flex items-center gap-3 mb-3">
            {/* Reduzi padding do ícone e o tamanho do ícone */}
            <div className="p-2 bg-orange-500/10 border border-orange-500/20 rounded-xl text-orange-400 group-hover:text-orange-300 group-hover:scale-105 transition-all duration-300">
              <SiDevbox size={20} />
            </div>
            <div>
              {/* Reduzi tamanho da fonte do nome */}
              <h3 className="text-xl font-bold text-white leading-none">
                João V. <span className="text-orange-400">Klabacher</span>
              </h3>
              {/* Reduzi tamanho da fonte do subtítulo */}
              <span className="text-[10px] text-gray-500 font-mono tracking-wider uppercase">
                Developer & Psychology Student
              </span>
            </div>
          </div>

          {/* Reduzi margem do divisor */}
          <div className="w-full h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent my-3" />

          {/* Lista de Informações: Reduzi space-y-3 para space-y-2 */}
          <div className="space-y-2">
            <InfoRow icon={MapIcon} text="São Paulo, Brasil" />
            <InfoRow icon={ScrollText} text="Psychology - 6/10 Semesters" />

            <div className="flex items-center gap-2 text-gray-300 group/link">
              {/* Mantive o tamanho deste ícone pequeno */}
              <div className="p-1.5 rounded-lg bg-white/5 text-gray-400 group-hover/link:text-orange-400 transition-colors border border-white/5 group-hover/link:border-orange-500/20">
                <Briefcase size={14} />
              </div>
              {/* Reduzi fonte para text-xs */}
              <a
                href="https://www.instagram.com/oficial.tmb/"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-medium hover:text-orange-300 transition-colors flex items-center gap-1.5"
              >
                @oficial.tmb
                <img
                  src={TMBLogo}
                  alt="TMB"
                  className="h-4 w-auto opacity-70 group-hover/link:opacity-100 transition-opacity"
                />
              </a>
            </div>
          </div>
        </div>

        {/* --- Botões Sociais --- */}
        {/* Reduzi gap-4 para gap-3 */}
        <div className="grid grid-cols-2 gap-3">
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

        {/* --- Card de Status --- */}
        {/* Reduzi padding de p-5 para p-3 py-3. Adicionei hover:border-green-500/30 para consistência. */}
        <div className="px-4 py-3 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl hover:bg-white/10 transition-all flex items-center justify-between group cursor-default hover:border-green-500/30">
          <div className="flex flex-col gap-1">
            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
              Status Atual
            </p>
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <div className="flex flex-col">
                {/* Reduzi para text-xs */}
                <p className="text-xs font-bold text-gray-200 group-hover:text-white transition-colors leading-none">
                  Em desenvolvimento
                </p>
                {/* Reduzi para text-[10px] */}
                <p className="text-[10px] text-gray-500 group-hover:text-gray-400 transition-colors mt-0.5">
                  Profissional e Acadêmico
                </p>
              </div>
            </div>
          </div>

          {/* Reduzi o tamanho do ícone visual de 28 para 22 */}
          <div className="hidden sm:block opacity-20 group-hover:opacity-100 group-hover:text-green-400 transition-all duration-500">
            <SiDevbox size={22} />
          </div>
        </div>

        {/* --- Card de Texto (Sobre Mim) --- */}
        {/* Reduzi padding de p-6 para p-4. Adicionei hover:border-orange-500/20. */}
        <div className="p-4 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl hover:bg-white/10 transition-all duration-300 group cursor-default hover:border-orange-500/20">
          {/* Reduzi mb-3 para mb-2 */}
          <div className="flex items-center gap-2 mb-2 opacity-60 group-hover:opacity-100 transition-opacity">
            <div className="h-px w-3 bg-orange-500/50"></div>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
              Sobre mim
            </p>
          </div>

          {/* Mudei para text-xs para ficar mais compacto e ajustei o leading */}
          <p className="text-xs text-gray-400 leading-5 text-justify group-hover:text-gray-300 transition-colors duration-300 font-medium">
            Desde muito novo, fui fascinado por tecnologia e comportamento humano. Procuro auxiliar
            e desenvolver novas soluções e projetos que possam impactar positivamente a sociedade.
            Para isso, estou adentrando o campo do{' '}
            <span className="text-orange-400/90 group-hover:text-orange-400 transition-colors">
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

function InfoRow({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    // Reduzi o gap e o tamanho da fonte
    <div className="flex items-center gap-2 text-gray-300 hover:translate-x-1 transition-transform duration-300 group/row">
      {/* Adicionei borda sutil ao ícone para definição */}
      <div className="p-1.5 rounded-lg bg-white/5 text-gray-400 border border-white/5 group-hover/row:text-gray-300 group-hover/row:border-white/10 transition-colors">
        <Icon size={14} />
      </div>
      <span className="text-xs font-medium">{text}</span>
    </div>
  );
}

function SocialButton({ href, icon: Icon, label, bgColor, hoverColor }: any) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      // Reduzi drasticamente o padding (py-2 px-3) e mudei para rounded-xl
      // Adicionei uma borda base colorida sutil para definição
      className={`
        flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl 
        ${bgColor} ${hoverColor} border border-white/10 text-white 
        font-medium transition-all duration-300 
        hover:shadow-lg hover:-translate-y-0.5 hover:border-white/30 group bg-opacity-90
      `}
    >
      {/* Reduzi tamanho do ícone para 18 */}
      <Icon
        size={18}
        className="text-white/90 group-hover:scale-105 transition-transform duration-300"
      />
      {/* Reduzi tamanho do texto para text-xs */}
      <span className="tracking-wide text-xs">{label}</span>
    </a>
  );
}
