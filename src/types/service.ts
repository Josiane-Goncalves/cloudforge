export type AwsCategory =
  | 'networking-delivery'
  | 'security-identity'
  | 'storage';

export interface ServiceRelationship {
  serviceId: string;
  context: string;
  docsUrl?: string;
}

export interface AwsService {
  id: string;
  name: string;
  category: AwsCategory;
  summary: string;
  purpose: string;
  useCases: string[];
  whenToUse: string[];
  limitationsAndCaveats: string[];
  relatedServices: ServiceRelationship[];
  officialDocsUrl: string;
}
