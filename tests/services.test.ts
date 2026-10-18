import { describe, it, expect } from 'vitest';
import {
  SERVICES,
  CATEGORY_LABELS,
  getAllServices,
  getServiceById,
  filterServices,
} from '../src/data/services';
import { AwsCategory } from '../src/types/service';

describe('AWS Codex Services Data & Logic', () => {
  it('should contain exactly the 4 approved initial services', () => {
    const services = getAllServices();
    expect(services).toHaveLength(4);

    const ids = services.map((s) => s.id);
    expect(ids).toContain('amazon-vpc');
    expect(ids).toContain('aws-iam');
    expect(ids).toContain('amazon-s3');
    expect(ids).toContain('amazon-cloudfront');
  });

  it('should have unique IDs for each service', () => {
    const ids = SERVICES.map((s) => s.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should have all mandatory fields populated with non-empty content', () => {
    for (const service of SERVICES) {
      expect(service.id).toBeTruthy();
      expect(service.name).toBeTruthy();
      expect(service.category).toBeTruthy();
      expect(service.summary).toBeTruthy();
      expect(service.purpose).toBeTruthy();
      expect(service.useCases.length).toBeGreaterThan(0);
      expect(service.whenToUse.length).toBeGreaterThan(0);
      expect(service.limitationsAndCaveats.length).toBeGreaterThan(0);
      expect(service.officialDocsUrl).toBeTruthy();

      // Category label must exist in the centralized mapping
      expect(CATEGORY_LABELS[service.category]).toBeTruthy();
    }
  });

  it('should validate official AWS docs URLs format without external network calls', () => {
    const validUrlPrefix = 'https://docs.aws.amazon.com/';

    for (const service of SERVICES) {
      expect(service.officialDocsUrl.startsWith(validUrlPrefix)).toBe(true);

      for (const rel of service.relatedServices) {
        if (rel.docsUrl) {
          expect(rel.docsUrl.startsWith(validUrlPrefix)).toBe(true);
        }
      }
    }
  });

  it('should ensure all relatedServices reference existing services in the catalog', () => {
    const validIds = new Set(SERVICES.map((s) => s.id));

    for (const service of SERVICES) {
      for (const rel of service.relatedServices) {
        expect(validIds.has(rel.serviceId)).toBe(true);
        expect(rel.context.trim().length).toBeGreaterThan(20);
      }
    }
  });

  it('should verify technically rigorous contexts for key relationships', () => {
    // S3 + CloudFront: must mention OAC and regular S3 origin vs website endpoint
    const s3 = getServiceById('amazon-s3')!;
    const s3ToCf = s3.relatedServices.find((r) => r.serviceId === 'amazon-cloudfront')!;
    expect(s3ToCf.context).toContain('Origin Access Control');
    expect(s3ToCf.context).toContain('OAC');
    expect(s3ToCf.context.toLowerCase()).toContain('website');

    // VPC + IAM: must differentiate identity permissions, endpoint policies, and Flow Logs roles
    const vpc = getServiceById('amazon-vpc')!;
    const vpcToIam = vpc.relatedServices.find((r) => r.serviceId === 'aws-iam')!;
    expect(vpcToIam.context).toContain('Endpoint Policies');
    expect(vpcToIam.context).toContain('Flow Logs');

    // S3 + IAM: must differentiate identity-based policies and bucket policies
    const s3ToIam = s3.relatedServices.find((r) => r.serviceId === 'aws-iam')!;
    expect(s3ToIam.context).toContain('Identity-based');
    expect(s3ToIam.context).toContain('Bucket Polic');
  });

  describe('filterServices logic', () => {
    it('should return all services when query is empty and category is all', () => {
      const result = filterServices(SERVICES, '', 'all');
      expect(result).toHaveLength(4);
    });

    it('should filter by service name case-insensitively', () => {
      const vpcResults = filterServices(SERVICES, 'vpc', 'all');
      expect(vpcResults).toHaveLength(1);
      expect(vpcResults[0].id).toBe('amazon-vpc');

      const cloudfrontResults = filterServices(SERVICES, 'CLOUDFRONT', 'all');
      expect(cloudfrontResults).toHaveLength(1);
      expect(cloudfrontResults[0].id).toBe('amazon-cloudfront');
    });

    it('should search by keyword inside summary or purpose', () => {
      const durabilidadeResults = filterServices(SERVICES, 'durabilidade', 'all');
      expect(durabilidadeResults.some((s) => s.id === 'amazon-s3')).toBe(true);

      const cacheResults = filterServices(SERVICES, 'cache', 'all');
      expect(cacheResults.some((s) => s.id === 'amazon-cloudfront')).toBe(true);
    });

    it('should filter strictly by official category', () => {
      const storageResults = filterServices(SERVICES, '', 'storage');
      expect(storageResults).toHaveLength(1);
      expect(storageResults[0].id).toBe('amazon-s3');

      const netResults = filterServices(SERVICES, '', 'networking-delivery');
      expect(netResults).toHaveLength(2);
      const netIds = netResults.map((s) => s.id);
      expect(netIds).toContain('amazon-vpc');
      expect(netIds).toContain('amazon-cloudfront');
    });

    it('should return empty array when category and search do not intersect', () => {
      const result = filterServices(SERVICES, 'VPC', 'storage' as AwsCategory);
      expect(result).toHaveLength(0);
    });
  });
});
