import { ProjectData } from '../components/ProjectModal';

import CountsparkDash from '@assets/countsparks/dashboard.png';
import CountsparkFront from '@assets/countsparks/frontpage.png';
import CountsparkLogin from '@assets/countsparks/login.png';
import CountsparkEmail from '@assets/countsparks/checagemdeemail.png';
import CountsparkFinal from '@assets/countsparks/final.png';

// Importar icones das tecnologias
import {
  SiReact,
  SiReactrouter,
  SiRedux,
  SiTailwindcss,
  SiTypescript,
  SiVite,
  SiVitest,
} from '@icons-pack/react-simple-icons';
const PROJECTS_DATA: ProjectData[] = [
  {
    id: 'CountSparks',
    title: 'CountSparks - Contadores simplificados',
    shortDescription:
      'Dashboard completo para criação/monitoramento e facil integração de contadores web.',
    fullDescription: `
        Este projeto foi desenvolvido para criar uma alternativa rapida, leve e personalizável aos tradicionais codigos de contadores.
        O mesmo codigo, feito repetidas vezes em JS, era pesado e dificil de integrar com outras plataformas.

        Com o CountSparks, o usuário pode criar contadores personalizados via dashboard, escolher entre varias opções de visualização e integrar facilmente via API ou embed code.
        
        **Foco na leveza e simplicidade:**
        - Sistema funciona direto na web e API simplificada com Supabase.

        **Principais Desafios:**
        - Ser simples e leve para integrar em qualquer site.
        - Oferecer personalização sem complicar a UX.
        - Construir um backend robusto para gerenciar milhares de contadores.
        - Criar customizações visuais dinâmicas e responsivas sem comprometer a performance.
  
        **Solução: (Em progresso)**
        - Centralizar a criação e gestão dos contadores em um dashboard intuitivo e facilitar a exportação/managment.
      `,
    techStack: [
      { name: 'React', icon: SiReact },
      { name: 'TypeScript', icon: SiTypescript },
      { name: 'TailwindCSS', icon: SiTailwindcss },
      { name: 'Vite', icon: SiVite },
      { name: 'ViTest', icon: SiVitest },
      { name: 'Redux', icon: SiRedux },
      { name: 'React Router', icon: SiReactrouter },
    ],
    githubUrl: 'https://github.com/klabacher/CountSparks',
    liveUrl: 'https://klabacher.github.io/CountSparks/',
    images: [
      {
        url: CountsparkDash,
        title: 'Dashboard Principal',
        description: 'Visão geral para manutenção e criação de contadores.',
      },
      {
        url: CountsparkFront,
        title: 'Pagina Inicial',
        description: 'Pagina inicial do projeto',
      },
      {
        url: CountsparkLogin,
        title: 'Tela de Login',
        description: 'Sistema de autenticação via JWT e OAuth usando Supabase.',
      },
      {
        url: CountsparkEmail,
        title: 'Verificação de Email',
        description: 'Fluxo de verificação de email para novos usuários usando Supabase.',
      },
      {
        url: CountsparkFinal,
        title: 'Dashboard do Contador',
        description:
          'Visualização final do contador integrado em um site. Muito trabalho pelo frente ainda! :D ',
      },
    ],
  },
];

export default PROJECTS_DATA;
