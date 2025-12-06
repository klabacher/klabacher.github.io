import { SiDevbox } from '@icons-pack/react-simple-icons';
import { Github, Linkedin } from 'lucide-react';
import IconR from '../IconMagic';
import TMBLogo from '@assets/tmb_logo.png';

export default function AboutMe() {
  return (
    <div className="max-w-4xl px-6 text-center">
      <h2 className="text-4xl text-left font-bold text-white mb-6 drop-shadow-lg">SOBRE MIM</h2>
      {/* <p className="text-gray-300 text-left text-lg leading-relaxed mb-8">Sobre</p> */}

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <div className="p-6 bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all cursor-pointer">
          <h3 className="flex gap-2 items-center text-xl text-left font-bold text-white mb-2">
            <SiDevbox />
            João V <span className="text-orange-400">Klabacher:</span>
          </h3>
          <hr className="border-white/10 mb-4" />
          <p className="text-gray-400 text-sm">Localização: São Paulo, Brasil</p>
          <p className="text-gray-400 text-sm">Formação: Cursando psicologia - 6 Semestre</p>
          <p className="text-gray-400 text-sm">
            Trabalho: https://www.instagram.com/oficial.tmb/
          </p>{' '}
          <img src={TMBLogo} alt="TMB Logo" className="w-20 h-auto my-2 mx-auto" />
          <p className="text-gray-400 text-sm">Localização: São Paulo, Brasil</p>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <a
            href={'http://github.com/klabacher'}
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#000000] hover:bg-white/10 border border-white/10 text-white font-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
          >
            <Github size={20} className="group-hover:rotate-12 transition-transform" />
            <span>Github</span>
          </a>
          <a
            href={'https://www.linkedin.com/in/joaovitorklabacher/'}
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#4A70A9] hover:bg-white/10 border border-white/10 text-white font-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
          >
            <Linkedin size={20} className="group-hover:rotate-12 transition-transform" />
            <span>Linkedin</span>
          </a>
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
