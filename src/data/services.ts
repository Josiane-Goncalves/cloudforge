import { AwsCategory, AwsService } from '../types/service';

export const CATEGORY_LABELS: Record<AwsCategory, string> = {
  'networking-delivery': 'Networking & Content Delivery',
  'security-identity': 'Security, Identity, & Compliance',
  'storage': 'Storage',
};

export const SERVICES: AwsService[] = [
  {
    id: 'amazon-vpc',
    name: 'Amazon Virtual Private Cloud (Amazon VPC)',
    category: 'networking-delivery',
    summary:
      'Rede virtual isolada logicamente na nuvem AWS onde você provisiona seus recursos com controle total sobre blocos de IP, sub-redes, tabelas de rotas e gateways de rede.',
    purpose:
      'Fornecer isolamento de rede, segmentação em camadas públicas e privadas, controle estrito de tráfego de entrada e saída (ingress/egress) e roteamento seguro entre recursos de computação e dados.',
    useCases: [
      'Topologia web multicamadas clássica: subnets públicas com balanceadores de carga (ALB), subnets privadas para servidores de aplicação e subnets isoladas para bancos de dados.',
      'Conectividade de rede híbrida segura entre o data center corporativo e a nuvem AWS utilizando AWS Site-to-Site VPN ou conexões dedicadas AWS Direct Connect.',
      'Interconexão privada e segura entre diferentes contas e VPCs corporativas sem expor tráfego à internet via VPC Peering ou AWS Transit Gateway.',
    ],
    whenToUse: [
      'Sempre que for provisionar instâncias de computação (EC2), contêineres gerenciados (ECS/EKS) ou bancos de dados relacionais (RDS) que exigem isolamento de rede.',
      'Quando requisitos de governança e conformidade exigirem controle granular de rotas, inspeção de pacotes e zonas desmilitarizadas (DMZ).',
    ],
    limitationsAndCaveats: [
      'O bloco CIDR IPv4 principal de uma VPC não pode ser redimensionado após a criação (embora novos blocos CIDR secundários possam ser associados).',
      'O VPC Peering não suporta roteamento transitivo (se VPC A conecta com B e B conecta com C, A não se comunica com C através de B sem peering direto ou Transit Gateway).',
      'Subnets residem em exatamente uma Zona de Disponibilidade (AZ) e não podem cruzar limites físicos entre AZs.',
      'Security Groups operam de forma stateful no nível de interface de rede (ENI), enquanto Network ACLs (NACLs) operam de forma stateless no nível de subnet.',
    ],
    relatedServices: [
      {
        serviceId: 'aws-iam',
        context:
          'O IAM atua na VPC em três frentes técnicas distintas: (1) permissões baseadas em identidade para administradores criarem e alterarem recursos de rede; (2) Endpoint Policies em VPC Endpoints para restringir quais ações e principals podem atravessar o gateway/interface privada; e (3) Service Roles do IAM assumidas pelo VPC Flow Logs para publicar telemetria de tráfego de rede no CloudWatch Logs ou Amazon S3.',
        docsUrl: 'https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs-iam.html',
      },
      {
        serviceId: 'amazon-s3',
        context:
          'Recursos privados dentro da VPC podem acessar buckets S3 sem trafegar pela internet pública configurando um Gateway VPC Endpoint (sem custo adicional e roteado pela Route Table) ou um Interface VPC Endpoint via AWS PrivateLink.',
        docsUrl: 'https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-s3.html',
      },
    ],
    officialDocsUrl: 'https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html',
  },
  {
    id: 'aws-iam',
    name: 'AWS Identity and Access Management (AWS IAM)',
    category: 'security-identity',
    summary:
      'Serviço global fundamental de governança e segurança que controla autenticação (identidade) e autorização (permissões granulares) sobre todas as ações e recursos da AWS.',
    purpose:
      'Gerenciar de forma centralizada usuários, grupos e papéis (roles), associando políticas JSON baseadas no princípio do privilégio mínimo para proteger APIs e dados na nuvem.',
    useCases: [
      'Delegação temporária de credenciais para aplicações em execução no EC2 ou Lambda através de IAM Roles, eliminando chaves de acesso fixas gravadas no código.',
      'Federação de identidades corporativas via SAML 2.0 ou OIDC (ex.: Microsoft Entra ID, Okta), permitindo login único (SSO) sem replicar usuários locais.',
      'Acesso seguro entre contas AWS distintas (Cross-Account Access) via assunção de papéis temporários com sts:AssumeRole.',
    ],
    whenToUse: [
      'Em qualquer arquitetura na AWS como base do Pilar de Segurança do Well-Architected Framework.',
      'Para definir limites explícitos de governança entre equipes e aplicações através de Permission Boundaries e Service Control Policies (SCPs).',
    ],
    limitationsAndCaveats: [
      'O IAM é um serviço global com consistência eventual; alterações em políticas e papéis podem levar alguns segundos para propagar entre todas as regiões da AWS.',
      'Por padrão, qualquer ação é implicitamente negada (Implicit Deny). Um Deny explícito em qualquer política avaliada sempre sobrepõe qualquer declaração de Allow.',
      'IAM Users e Access Keys de longo prazo devem ser evitados no exame SAA-C03; o padrão recomendado pela AWS é o uso de credenciais de curta duração via IAM Roles e AWS IAM Identity Center.',
      'O IAM não substitui a autenticação de usuários finais da sua aplicação (para usuários de sistemas web/mobile, utilize serviços como Amazon Cognito).',
    ],
    relatedServices: [
      {
        serviceId: 'amazon-s3',
        context:
          'O controle de acesso aos dados do S3 é avaliado pela união de Identity-based Policies (associadas a usuários/roles no IAM) e Resource-based Policies (Bucket Policies anexadas diretamente ao bucket S3). Se houver um Explicit Deny em qualquer uma delas, a requisição é bloqueada, independentemente de onde o Allow foi concedido.',
        docsUrl: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-overview.html',
      },
      {
        serviceId: 'amazon-vpc',
        context:
          'O IAM governa a criação e modificação de componentes da VPC, controla o tráfego que transita por VPC Endpoints através de Endpoint Policies e fornece credenciais temporárias para o daemon do VPC Flow Logs gravar métricas de rede.',
        docsUrl: 'https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-access.html',
      },
    ],
    officialDocsUrl: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html',
  },
  {
    id: 'amazon-s3',
    name: 'Amazon Simple Storage Service (Amazon S3)',
    category: 'storage',
    summary:
      'Armazenamento de objetos de hiperescala, projetado para durabilidade extrema (99.999999999% - 11 9s), alta disponibilidade e recuperação de qualquer volume de dados via API REST.',
    purpose:
      'Armazenar arquivos e dados não estruturados organizados em buckets por chaves de objetos, oferecendo classes de armazenamento com custo otimizado para todo o ciclo de vida da informação.',
    useCases: [
      'Hospedagem e distribuição de arquivos estáticos (HTML, CSS, JS, imagens) para websites e Single Page Applications.',
      'Armazenamento primário de Data Lake para ingestão e consulta analítica com ferramentas como Amazon Athena, AWS Glue e Amazon Redshift Spectrum.',
      'Repositório central de backups, snapshots e arquivamento de longa permanência com migração automatizada para classes S3 Glacier e Glacier Deep Archive.',
    ],
    whenToUse: [
      'Para armazenar arquivos individuais (de 0 bytes a 5 TB) acessados por protocolo HTTP/HTTPS ou SDKs da AWS.',
      'Quando o padrão de acesso exigir durabilidade altíssima sem necessidade de um sistema de arquivos montável tipo bloco (EBS) ou compartilhado com semântica POSIX direta (EFS).',
    ],
    limitationsAndCaveats: [
      'O S3 é um armazenamento de objetos puro: não permite atualização parcial de bytes de um arquivo existente (qualquer alteração requer o reenvio completo do objeto).',
      'Nomes de buckets devem ser globalmente exclusivos em todas as contas e regiões da AWS.',
      'O S3 oferece consistência forte imediata de leitura após escrita (strong read-after-write consistency) para novas criações (PUTs) e exclusões (DELETEs) de objetos.',
      'A funcionalidade S3 Block Public Access deve permanecer sempre ativada em cenários de produção e exame; o acesso público direto deve ser bloqueado, canalizando a entrega através de uma distribuição CDN.',
    ],
    relatedServices: [
      {
        serviceId: 'amazon-cloudfront',
        context:
          'O CloudFront distribui o conteúdo do S3 globalmente com baixa latência e terminação TLS. Para origens S3 regulares (REST API), o acesso deve ser bloqueado ao público e liberado exclusivamente à distribuição via Origin Access Control (OAC) configurado na Bucket Policy. Por outro lado, caso o bucket seja configurado no modo legado S3 Static Website Hosting (endpoint HTTP de website), o tráfego opera como origem HTTP externa regular, não sendo compatível com OAC e exigindo segredos em cabeçalhos HTTP customizados para restringir acessos diretos.',
        docsUrl:
          'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html',
      },
      {
        serviceId: 'aws-iam',
        context:
          'A autorização no S3 diferencia: (1) Identity-based Policies (permissões anexadas no IAM a usuários, grupos ou papéis que determinam o que a identidade pode fazer); e (2) Bucket Policies (políticas baseadas em recursos anexadas ao próprio bucket que definem quais contas, serviços ou condições de rede podem acessar os objetos). Ambas as políticas são avaliadas em conjunto.',
        docsUrl:
          'https://docs.aws.amazon.com/AmazonS3/latest/userguide/how-s3-evaluates-access-control.html',
      },
    ],
    officialDocsUrl: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html',
  },
  {
    id: 'amazon-cloudfront',
    name: 'Amazon CloudFront',
    category: 'networking-delivery',
    summary:
      'Rede de entrega de conteúdo (CDN) de baixa latência e alta velocidade que distribui dados, vídeos, aplicativos e APIs de forma segura para usuários do mundo inteiro através de Edge Locations.',
    purpose:
      'Armazenar em cache dados estáticos e dinâmicos na borda mais próxima do usuário final, otimizar rotas de rede através do backbone global da AWS e mitigar ataques de negação de serviço (DDoS).',
    useCases: [
      'Aceleração e entrega global de websites estáticos e Single Page Applications com origem em buckets S3 protegidos.',
      'Distribuição e cache dinâmico de respostas de APIs REST e microserviços hospedados atrás de Application Load Balancers ou Amazon API Gateway.',
      'Transmissão de vídeo em tempo real ou sob demanda (HLS/DASH) utilizando protocolos de streaming adaptativo.',
    ],
    whenToUse: [
      'Quando sua aplicação possuir usuários distribuídos geograficamente e houver necessidade de diminuir a latência (TTFB - Time to First Byte).',
      'Para reduzir os custos de transferência de dados externa (Data Transfer Out - DTO) originados diretamente dos servidores de backend ou do S3.',
      'Para gerenciar certificados SSL/TLS públicos personalizados globalmente utilizando o AWS Certificate Manager (ACM).',
    ],
    limitationsAndCaveats: [
      'O CloudFront é uma camada de cache e terminação de borda, não um armazenamento de persistência primária; seus dados dependem do TTL configurado e da política de cache.',
      'Invalidações de cache (Invalidations) possuem cotas gratuitas mensais limitadas (1.000 caminhos de invalidação por mês sem custo; além disso, aplica-se cobrança por caminho).',
      'Certificados SSL/TLS gerenciados pelo ACM para uso em distribuições CloudFront DEVEM obrigatoriamente ser emitidos na região us-east-1 (Norte da Virgínia).',
      'Para controle de acesso a conteúdos pagos ou restritos, deve-se utilizar CloudFront Signed URLs ou Signed Cookies, evitando autenticação pesada na origem.',
    ],
    relatedServices: [
      {
        serviceId: 'amazon-s3',
        context:
          'O CloudFront é o parceiro de arquitetura padrão do S3 para entrega de conteúdo. A melhor prática oficial da AWS é configurar o bucket como origem REST regular e aplicar Origin Access Control (OAC), garantindo que apenas a distribuição CDN autenticada consiga ler os objetos do bucket fechado. Se o S3 for configurado como endpoint de website (website endpoint), a integração atua como origem HTTP comum e o OAC não pode ser aplicado.',
        docsUrl:
          'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html',
      },
      {
        serviceId: 'aws-iam',
        context:
          'O IAM controla as permissões administrativas dos engenheiros e pipelines de CI/CD para criar distribuições, atualizar comportamentos de cache (cache behaviors) e solicitar invalidações de arquivos no CloudFront.',
        docsUrl:
          'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/access-control-managing-permissions.html',
      },
    ],
    officialDocsUrl: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html',
  },
];

export function getAllServices(): AwsService[] {
  return SERVICES;
}

export function getServiceById(id: string): AwsService | undefined {
  return SERVICES.find((service) => service.id === id);
}

export function filterServices(
  services: AwsService[],
  query: string,
  category: AwsCategory | 'all'
): AwsService[] {
  const normalizedQuery = query.trim().toLowerCase();

  return services.filter((service) => {
    const matchesCategory = category === 'all' || service.category === category;
    if (!matchesCategory) return false;

    if (!normalizedQuery) return true;

    const matchesName = service.name.toLowerCase().includes(normalizedQuery);
    const matchesSummary = service.summary.toLowerCase().includes(normalizedQuery);
    const matchesPurpose = service.purpose.toLowerCase().includes(normalizedQuery);

    return matchesName || matchesSummary || matchesPurpose;
  });
}
