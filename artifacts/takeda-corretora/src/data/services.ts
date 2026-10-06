export interface ServicePost {
  id: string;
  url: string;
  featured: boolean;
  order: number;
  label?: string;
  category?: string;
}

export const servicesData: ServicePost[] = [
  {
    id: 'DVwwedkDVuE',
    url: 'https://www.instagram.com/p/DVwwedkDVuE/',
    featured: true,
    order: 1,
    label: 'Serviço 1',
    category: 'Consultoria Especializada',
  },
  {
    id: 'DVrmx6lDPkB',
    url: 'https://www.instagram.com/p/DVrmx6lDPkB/',
    featured: true,
    order: 2,
    label: 'Serviço 2',
    category: 'Proteção Patrimonial',
  },
  {
    id: 'DVj4YgXjJQH',
    url: 'https://www.instagram.com/p/DVj4YgXjJQH/',
    featured: true,
    order: 3,
    label: 'Serviço 3',
    category: 'Planejamento e Soluções',
  },
  {
    id: 'DVeu07qj30W',
    url: 'https://www.instagram.com/p/DVeu07qj30W/',
    featured: false,
    order: 4,
    label: 'Serviço 4',
    category: 'Seguro de Vida',
  },
  {
    id: 'DVYL78wjQIf',
    url: 'https://www.instagram.com/p/DVYL78wjQIf/',
    featured: false,
    order: 5,
    label: 'Serviço 5',
    category: 'Previdência Estratégica',
  },
  {
    id: 'DUQFsWHj0el',
    url: 'https://www.instagram.com/p/DUQFsWHj0el/',
    featured: false,
    order: 6,
    label: 'Serviço 6',
    category: 'Segurança Financeira',
  },
  {
    id: 'DTtU9avCW5O',
    url: 'https://www.instagram.com/p/DTtU9avCW5O/',
    featured: false,
    order: 7,
    label: 'Serviço 7',
    category: 'Atendimento Personalizado',
  },
];
