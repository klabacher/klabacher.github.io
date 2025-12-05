const ProjectData = {
  // Dados do projeto podem ser adicionados aqui
  1: {
    name: 'Nome do Projeto',
    description:
      'Descrição detalhada do projeto. Aqui você pode incluir informações sobre as tecnologias usadas, desafios enfrentados e resultados alcançados.',
    imageUrl: 'https://via.placeholder.com/150',
    codeUrl: '#',
    demoUrl: '#',
  },
  2: {
    name: 'Outro Projeto',
    description:
      'Descrição detalhada de outro projeto. Inclua informações relevantes sobre o desenvolvimento e resultados.',
    imageUrl: 'https://via.placeholder.com/150',
    codeUrl: '#',
    demoUrl: '#',
  },
};

export function ProjectModal() {
  return (
    <div className="">
      <img src="https://via.placeholder.com/150" alt="Project Screenshot" />
      <h2 className="text-2xl font-bold mt-4">Nome do Projeto</h2>
      <p className="mt-2 text-gray-300">
        Descrição detalhada do projeto. Aqui você pode incluir informações sobre as tecnologias
        usadas, desafios enfrentados e resultados alcançados.
      </p>
      <div className="mt-4 flex gap-4">
        <a
          href="#"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Ver Código
        </a>
        <a
          href="#"
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Ver Demo
        </a>
      </div>
    </div>
  );
}
