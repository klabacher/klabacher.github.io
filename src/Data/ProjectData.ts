import { ProjectData } from '../components/ProjectModal';

// Importar icones das tecnologias
import { SiReact, SiPython, SiPandas, SiLangchain, SiOpenai } from '@icons-pack/react-simple-icons';
const PROJECTS_DATA: ProjectData[] = [
  {
    id: 'proj-1',
    title: 'Plataforma Analytics Pro',
    shortDescription: 'Dashboard completo para análise de dados em tempo real com IA.',
    fullDescription: `
        Este projeto foi desenvolvido para resolver um problema crítico de visualização de dados em grandes volumes.
        
        **Principais Desafios:**
        - Processar 1 milhão de linhas em menos de 2 segundos.
        - Criar gráficos interativos que não travassem o navegador.
        - Integrar previsões de IA diretamente nos gráficos.
  
        **Solução:**
        Utilizei Python (Pandas) no backend para pré-processamento pesado e enviei apenas o JSON otimizado para o React. No frontend, usei bibliotecas de canvas para renderização de alta performance.
      `,
    techStack: [
      { name: 'React', icon: SiReact },
      { name: 'Python', icon: SiPython },
      { name: 'Pandas', icon: SiPandas },
      { name: 'LangChain', icon: SiLangchain },
    ],
    githubUrl: 'https://github.com/seusite/projeto',
    liveUrl: 'https://projeto-demo.com',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
        title: 'Dashboard Principal',
        description: 'Visão geral com gráficos de performance em tempo real.',
      },
      {
        url: 'https://images.unsplash.com/photo-1543286386-713df548e9cc?q=80&w=1000&auto=format&fit=crop',
        title: 'Painel de Configuração',
        description: 'Onde o usuário define os parâmetros da IA.',
      },
    ],
  },
  {
    id: 'proj-2',
    title: 'Automação RAG com IA',
    shortDescription: 'Sistema inteligente de leitura de PDFs e resposta contextual.',
    fullDescription: `
        Uma solução end-to-end para empresas que precisam consultar milhares de documentos PDF internos.
        O sistema indexa tudo em um banco vetorial e usa LLMs para responder perguntas.
      `,
    techStack: [
      { name: 'Python', icon: SiPython },
      { name: 'Langgraph', icon: SiLangchain },
      { name: 'Pandas', icon: SiPandas },
      { name: 'OpenAI', icon: SiOpenai },
    ],
    githubUrl: 'https://github.com/seusite/rag',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop',
        title: 'Interface de Chat',
        description: 'O usuário conversa naturalmente com os documentos.',
      },
    ],
  },
];

export default PROJECTS_DATA;
