import {
  Mission001Submission,
  MissionEvaluationResult,
  RequirementEvaluation,
  PillarFeedback,
} from '../types/mission';

export function evaluateMission001(submission: Mission001Submission): MissionEvaluationResult {
  const { selectedServiceIds, config } = submission;

  const hasS3 = selectedServiceIds.includes('amazon-s3');
  const hasCloudFront = selectedServiceIds.includes('amazon-cloudfront');
  const hasVpc = selectedServiceIds.includes('amazon-vpc');
  const hasIam = selectedServiceIds.includes('aws-iam');

  // Residual configs: only take into account settings from services that are actively selected
  const s3OriginType = hasS3 ? config.s3OriginType : undefined;
  const s3BlockPublicAccess = hasS3 ? config.s3BlockPublicAccess : undefined;
  const s3BucketPolicy = hasS3 ? config.s3BucketPolicy : undefined;

  const cloudfrontOacEnabled = hasCloudFront ? config.cloudfrontOacEnabled : undefined;
  const cloudfrontViewerProtocolPolicy = hasCloudFront
    ? config.cloudfrontViewerProtocolPolicy
    : undefined;

  const identifiedIssues: string[] = [];
  const unnecessaryServices: string[] = [];
  const recommendations: string[] = [];

  // --- 1. Evaluate Requirement: Baixa latência global ---
  let latencySatisfied = false;
  let latencyExplanation = '';

  if (!hasCloudFront) {
    latencyExplanation =
      'Sem uma CDN como o Amazon CloudFront, as requisições dos visitantes precisam viajar até a região onde o bucket S3 está hospedado. Usuários em outros continentes sofrem com alta latência de rede e elevado TTFB (Time to First Byte).';
    identifiedIssues.push('Ausência de camada de borda (CDN) para acelerar a entrega global de conteúdo estático.');
  } else if (!hasS3) {
    latencyExplanation =
      'O CloudFront foi selecionado, mas não há um repositório de armazenamento de objetos (Amazon S3) configurado para atuar como origem dos arquivos do portal.';
    identifiedIssues.push('CloudFront configurado sem o serviço de armazenamento de origem (Amazon S3).');
  } else {
    latencySatisfied = true;
    latencyExplanation =
      'A rede global de Edge Locations do Amazon CloudFront entrega os arquivos estáticos a partir de pontos de presença próximos aos visitantes em todo o mundo, garantindo baixa latência.';
  }

  // --- 2. Evaluate Requirement: Armazenamento sem acesso público direto ---
  let privateStorageSatisfied = false;
  let privateStorageExplanation = '';

  if (!hasS3) {
    privateStorageExplanation =
      'O serviço de armazenamento Amazon S3 não foi selecionado na solução.';
  } else if (!hasCloudFront) {
    privateStorageExplanation =
      'Sem o CloudFront para atuar como ponto único de entrada seguro com OAC, o bucket S3 não consegue ser mantido privado e ao mesmo tempo acessível para visitantes da internet.';
  } else {
    const isRestOrigin = s3OriginType === 's3-rest';
    const isBpaEnabled = s3BlockPublicAccess === true;
    const isOacOnCloudFront = cloudfrontOacEnabled === true;
    const isOacBucketPolicy = s3BucketPolicy === 'oac-statement';

    if (s3OriginType === 's3-website') {
      identifiedIssues.push(
        'Origem configurada como S3 Website Endpoint. Esse endpoint opera como servidor HTTP público comum e não suporta autenticação via Origin Access Control (OAC).'
      );
      recommendations.push(
        'Altere a origem no CloudFront para a origem S3 REST regular para viabilizar a proteção por Origin Access Control (OAC).'
      );
    }

    if (!isBpaEnabled) {
      identifiedIssues.push(
        'O S3 Block Public Access está desativado, criando o risco de exposição pública direta e irrestrita dos objetos na internet.'
      );
      recommendations.push(
        'Ative o S3 Block Public Access no nível do bucket para impedir o acesso público direto sem passar pelo CloudFront.'
      );
    }

    if (s3BucketPolicy === 'public-read-statement') {
      identifiedIssues.push(
        'A Bucket Policy concede permissão de leitura pública (Principal: "*"), permitindo que qualquer pessoa acerte o bucket diretamente.'
      );
    } else if (s3BucketPolicy === 'none') {
      identifiedIssues.push(
        'Nenhuma Bucket Policy foi anexada ao bucket S3. O CloudFront receberá erro HTTP 403 Forbidden ao tentar ler os objetos privados.'
      );
      recommendations.push(
        'Adicione uma Bucket Policy que autorize explicitamente o principal "cloudfront.amazonaws.com" condicionado ao ARN da distribuição (SourceArn).'
      );
    }

    if (isOacOnCloudFront && !isOacBucketPolicy) {
      identifiedIssues.push(
        'O CloudFront está configurado com OAC para assinar requisições, mas a Bucket Policy do S3 não possui a declaração correspondente de autorização do OAC.'
      );
    }

    if (!isOacOnCloudFront && isOacBucketPolicy) {
      identifiedIssues.push(
        'A Bucket Policy do S3 exige assinatura via OAC, mas a distribuição CloudFront não está configurada para assinar as requisições à origem.'
      );
      recommendations.push(
        'Habilite o Origin Access Control (OAC) na configuração da origem do CloudFront.'
      );
    }

    if (isRestOrigin && isBpaEnabled && isOacOnCloudFront && isOacBucketPolicy) {
      privateStorageSatisfied = true;
      privateStorageExplanation =
        'O bucket S3 está completamente fechado para a internet com Block Public Access ativo e origem REST. O acesso é liberado com exclusividade para a distribuição CloudFront via Origin Access Control (OAC) e Bucket Policy restrita.';
    } else {
      privateStorageExplanation =
        'O armazenamento não está isolado adequadamente. Há incompatibilidade entre o tipo de origem, as regras de bloqueio público ou a Bucket Policy com OAC.';
    }
  }

  // --- 3. Evaluate Requirement: HTTPS para os visitantes ---
  let httpsSatisfied = false;
  let httpsExplanation = '';

  if (!hasCloudFront) {
    httpsExplanation =
      'Sem o CloudFront, não há distribuição de borda para aplicar políticas de protocolo TLS/HTTPS aos visitantes.';
  } else if (
    cloudfrontViewerProtocolPolicy === 'redirect-to-https' ||
    cloudfrontViewerProtocolPolicy === 'https-only'
  ) {
    httpsSatisfied = true;
    if (cloudfrontViewerProtocolPolicy === 'redirect-to-https') {
      httpsExplanation =
        'A política "Redirect HTTP to HTTPS" atende ao requisito redirecionando automaticamente acessos HTTP comuns para HTTPS criptografado, proporcionando a melhor experiência ao usuário.';
    } else {
      httpsExplanation =
        'A política "HTTPS Only" atende ao requisito rejeitando qualquer tráfego HTTP em texto claro (retornando HTTP 403), exigindo estritamente comunicação segura.';
    }
  } else {
    httpsExplanation =
      'A política "Allow All" permite que os visitantes naveguem em HTTP não criptografado, transmitindo dados em texto claro e violando o requisito de conexão segura.';
    identifiedIssues.push(
      'Viewer Protocol Policy configurada como "Allow All", permitindo conexões HTTP sem criptografia.'
    );
    recommendations.push(
      'Configure a Viewer Protocol Policy para "Redirect HTTP to HTTPS" ou "HTTPS Only".'
    );
  }

  // --- 4. Evaluate Requirement: Arquitetura simples ---
  let simplicitySatisfied = false;
  let simplicityExplanation = '';

  if (hasVpc) {
    unnecessaryServices.push('Amazon VPC');
    identifiedIssues.push(
      'A inclusão de uma Amazon VPC para servir um site estático público introduz complexidade arquitetural desnecessária e sobrecarga de gerenciamento (tabelas de rotas, subnets e interfaces).'
    );
    recommendations.push(
      'Remova a Amazon VPC da solução. O Amazon S3 e o Amazon CloudFront são serviços serverless e de borda gerenciados pela AWS que não exigem uma VPC para entrega web pública.'
    );
  }

  if (hasIam) {
    // Note: IAM is not a delivery path component
    unnecessaryServices.push('AWS IAM (como serviço de bancada)');
    recommendations.push(
      'O AWS IAM gerencia identidades e credenciais da conta, mas não é um componente da arquitetura de entrega web. A autorização do CloudFront ao S3 é feita diretamente via Bucket Policy anexada ao bucket S3.'
    );
  }

  if (hasS3 && hasCloudFront && !hasVpc && !hasIam) {
    simplicitySatisfied = true;
    simplicityExplanation =
      'Arquitetura limpa e serverless composta estritamente pelos serviços necessários (Amazon S3 e Amazon CloudFront), sem servidores para gerenciar ou redes privadas desnecessárias.';
  } else if (hasVpc || hasIam) {
    simplicityExplanation =
      'A arquitetura inclui serviços desnecessários para a entrega de conteúdo estático público, aumentando a complexidade de configuração e a superfície operacional.';
  } else {
    simplicityExplanation =
      'A arquitetura está incompleta, faltando serviços fundamentais para compor a solução.';
  }

  // --- 5. Evaluate Requirement: Eficiência de custos ---
  let costSatisfied = false;
  let costExplanation = '';

  if (hasVpc) {
    costExplanation =
      'Embora a criação de uma VPC não gere cobrança adicional direta por si só, arquitetar uma VPC para um site estático pode incentivar o acoplamento futuro de recursos pagos desnecessários (como NAT Gateways ou instâncias EC2), fugindo do padrão serverless enxuto.';
  } else if (hasS3 && hasCloudFront) {
    costSatisfied = true;
    costExplanation =
      'A solução é altamente eficiente em custos: elimina servidores dedicados ociosos, aproveita o armazenamento de baixo custo do S3 e reduz custos de Data Transfer Out (DTO) do S3 através do cache nas Edge Locations do CloudFront.';
  } else {
    costExplanation =
      'A arquitetura não está configurada para aproveitar o modelo serverless com cache de borda do CloudFront.';
  }

  const requirements: RequirementEvaluation[] = [
    {
      id: 'req-latency',
      title: 'Baixa latência global',
      satisfied: latencySatisfied,
      explanation: latencyExplanation,
    },
    {
      id: 'req-private-storage',
      title: 'Armazenamento sem acesso público direto',
      satisfied: privateStorageSatisfied,
      explanation: privateStorageExplanation,
    },
    {
      id: 'req-https',
      title: 'HTTPS para os visitantes',
      satisfied: httpsSatisfied,
      explanation: httpsExplanation,
    },
    {
      id: 'req-simplicity',
      title: 'Arquitetura simples',
      satisfied: simplicitySatisfied,
      explanation: simplicityExplanation,
    },
    {
      id: 'req-cost',
      title: 'Eficiência de custos',
      satisfied: costSatisfied,
      explanation: costExplanation,
    },
  ];

  // --- Pillar Evaluations (Well-Architected Framework educational reference) ---
  const pillars: PillarFeedback[] = [
    {
      pillar: 'security',
      pillarLabel: 'Segurança',
      status:
        privateStorageSatisfied && httpsSatisfied
          ? 'aligned'
          : !isBpaEnabledOrUndefined(hasS3, s3BlockPublicAccess) ||
            s3BucketPolicy === 'public-read-statement'
          ? 'at-risk'
          : 'improvement-needed',
      summary:
        privateStorageSatisfied && httpsSatisfied
          ? 'Excelente alinhamento: bucket privado com OAC, Block Public Access ativo e tráfego criptografado com Viewer Protocol Policy.'
          : 'Exposição identificada: verifique se o S3 Block Public Access está ativado, se o OAC está configurado e se o HTTPS está imposto.',
    },
    {
      pillar: 'performance',
      pillarLabel: 'Eficiência de Performance',
      status: latencySatisfied ? 'aligned' : 'at-risk',
      summary: latencySatisfied
        ? 'Excelente: o CloudFront atua em Edge Locations distribuídas globalmente, reduzindo o TTFB e acelerando a entrega dos ativos estáticos.'
        : 'Risco de alta latência: sem uma CDN global, usuários distantes da região geográfica do bucket enfrentarão degradação de tempo de resposta.',
    },
    {
      pillar: 'cost',
      pillarLabel: 'Otimização de Custos',
      status: costSatisfied ? 'aligned' : 'improvement-needed',
      summary: costSatisfied
        ? 'Modelo serverless sob demanda: sem cobrança por instâncias ociosas. O cache do CloudFront reduz requisições diretas e custos de transferência do S3.'
        : 'Atenção aos recursos: certifique-se de utilizar apenas componentes serverless gerenciados, evitando topologias desnecessárias.',
    },
    {
      pillar: 'operational',
      pillarLabel: 'Excelência Operacional',
      status: simplicitySatisfied ? 'aligned' : 'improvement-needed',
      summary: simplicitySatisfied
        ? 'Operação mínima: serviços serverless totalmente gerenciados pela AWS eliminam a necessidade de patching de sistema operacional ou gerenciamento de redes complexas.'
        : 'Sobrecarga de manutenção: a inclusão de componentes desnecessários aumenta a complexidade de configuração e a superfície operacional.',
    },
  ];

  const allRequirementsMet = requirements.every((r) => r.satisfied);
  const passed = allRequirementsMet && unnecessaryServices.length === 0;

  let verdictTitle = '';
  let verdictDescription = '';

  if (passed) {
    verdictTitle = 'Arquitetura Aprovada com Excelência';
    verdictDescription =
      'A solução atende rigorosamente a todos os requisitos de negócio e segue as melhores práticas canônicas do AWS Well-Architected Framework e do exame SAA-C03.';
  } else if (latencySatisfied && hasS3 && hasCloudFront) {
    verdictTitle = 'Arquitetura Funcional com Ressalvas';
    verdictDescription =
      'A estrutura principal está presente, mas há configurações de segurança, protocolo ou componentes redundantes que precisam de ajuste antes da aprovação final.';
  } else {
    verdictTitle = 'Falhas Arquiteturais Críticas Identificadas';
    verdictDescription =
      'A solução proposta não atende aos requisitos fundamentais de entrega ou isolamento para o cenário do portal institucional.';
  }

  const saaC03Takeaways = [
    'Origin Access Control (OAC) é o substituto moderno e recomendado da AWS para o antigo Origin Access Identity (OAI), oferecendo suporte completo a todas as regiões e métodos HTTP.',
    'Origens do tipo S3 REST Endpoint são obrigatórias para uso com OAC. O modo S3 Static Website Hosting gera um endpoint HTTP público que não é compatível com OAC.',
    'Ambas as políticas "Redirect HTTP to HTTPS" e "HTTPS Only" são aceitas para impor conexões seguras; no entanto, o redirecionamento fornece uma experiência de usuário superior ao atualizar o tráfego automaticamente.',
    'O Amazon S3 e o Amazon CloudFront são serviços serverless públicos globais; eles não requerem uma Amazon VPC para publicação de sites estáticos na internet.',
  ];

  return {
    passed,
    verdictTitle,
    verdictDescription,
    requirements,
    pillars,
    identifiedIssues,
    unnecessaryServices,
    recommendations,
    saaC03Takeaways,
  };
}

function isBpaEnabledOrUndefined(hasS3: boolean, s3BlockPublicAccess?: boolean): boolean {
  if (!hasS3) return true;
  return s3BlockPublicAccess !== false;
}
