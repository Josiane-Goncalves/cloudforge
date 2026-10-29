import { describe, it, expect } from 'vitest';
import { evaluateMission001 } from '../src/engine/mission001Evaluator';
import { Mission001Submission } from '../src/types/mission';

describe('Mission 001 — O Portal Global (Evaluator Engine)', () => {
  const optimalSubmission: Mission001Submission = {
    selectedServiceIds: ['amazon-s3', 'amazon-cloudfront'],
    config: {
      s3OriginType: 's3-rest',
      s3BlockPublicAccess: true,
      s3BucketPolicy: 'oac-statement',
      cloudfrontOacEnabled: true,
      cloudfrontViewerProtocolPolicy: 'redirect-to-https',
    },
  };

  it('should approve optimal architecture with Redirect HTTP to HTTPS', () => {
    const result = evaluateMission001(optimalSubmission);

    expect(result.passed).toBe(true);
    expect(result.verdictTitle).toContain('Aprovada');
    expect(result.unnecessaryServices).toHaveLength(0);
    expect(result.identifiedIssues).toHaveLength(0);

    // All 5 requirements satisfied
    expect(result.requirements).toHaveLength(5);
    expect(result.requirements.every((r) => r.satisfied)).toBe(true);

    // Pillars aligned
    const secPillar = result.pillars.find((p) => p.pillar === 'security')!;
    expect(secPillar.status).toBe('aligned');
    const perfPillar = result.pillars.find((p) => p.pillar === 'performance')!;
    expect(perfPillar.status).toBe('aligned');
    const costPillar = result.pillars.find((p) => p.pillar === 'cost')!;
    expect(costPillar.status).toBe('aligned');
    const opPillar = result.pillars.find((p) => p.pillar === 'operational')!;
    expect(opPillar.status).toBe('aligned');
  });

  it('should approve optimal architecture with HTTPS Only policy', () => {
    const submission: Mission001Submission = {
      ...optimalSubmission,
      config: {
        ...optimalSubmission.config,
        cloudfrontViewerProtocolPolicy: 'https-only',
      },
    };

    const result = evaluateMission001(submission);

    expect(result.passed).toBe(true);
    const httpsReq = result.requirements.find((r) => r.id === 'req-https')!;
    expect(httpsReq.satisfied).toBe(true);
    expect(httpsReq.explanation).toContain('HTTPS Only');
  });

  it('should reject when Amazon S3 is missing', () => {
    const submission: Mission001Submission = {
      selectedServiceIds: ['amazon-cloudfront'],
      config: optimalSubmission.config,
    };

    const result = evaluateMission001(submission);

    expect(result.passed).toBe(false);
    const latencyReq = result.requirements.find((r) => r.id === 'req-latency')!;
    expect(latencyReq.satisfied).toBe(false);
    const storageReq = result.requirements.find((r) => r.id === 'req-private-storage')!;
    expect(storageReq.satisfied).toBe(false);
  });

  it('should reject when Amazon CloudFront is missing', () => {
    const submission: Mission001Submission = {
      selectedServiceIds: ['amazon-s3'],
      config: optimalSubmission.config,
    };

    const result = evaluateMission001(submission);

    expect(result.passed).toBe(false);
    const latencyReq = result.requirements.find((r) => r.id === 'req-latency')!;
    expect(latencyReq.satisfied).toBe(false);
    const httpsReq = result.requirements.find((r) => r.id === 'req-https')!;
    expect(httpsReq.satisfied).toBe(false);
  });

  it('should not allow residual configs of unselected services to satisfy requirements', () => {
    // S3 is NOT in selectedServiceIds, but its config is present in the object
    const submission: Mission001Submission = {
      selectedServiceIds: ['amazon-cloudfront'],
      config: {
        s3OriginType: 's3-rest',
        s3BlockPublicAccess: true,
        s3BucketPolicy: 'oac-statement',
        cloudfrontOacEnabled: true,
        cloudfrontViewerProtocolPolicy: 'redirect-to-https',
      },
    };

    const result = evaluateMission001(submission);

    expect(result.passed).toBe(false);
    const storageReq = result.requirements.find((r) => r.id === 'req-private-storage')!;
    expect(storageReq.satisfied).toBe(false);
  });

  it('should fail private storage requirement when S3 website endpoint is selected', () => {
    const submission: Mission001Submission = {
      ...optimalSubmission,
      config: {
        ...optimalSubmission.config,
        s3OriginType: 's3-website',
      },
    };

    const result = evaluateMission001(submission);

    expect(result.passed).toBe(false);
    const storageReq = result.requirements.find((r) => r.id === 'req-private-storage')!;
    expect(storageReq.satisfied).toBe(false);
    expect(result.identifiedIssues.some((issue) => issue.includes('Website Endpoint'))).toBe(true);
  });

  it('should fail private storage when S3 Block Public Access is disabled', () => {
    const submission: Mission001Submission = {
      ...optimalSubmission,
      config: {
        ...optimalSubmission.config,
        s3BlockPublicAccess: false,
      },
    };

    const result = evaluateMission001(submission);

    expect(result.passed).toBe(false);
    const storageReq = result.requirements.find((r) => r.id === 'req-private-storage')!;
    expect(storageReq.satisfied).toBe(false);
    expect(result.identifiedIssues.some((issue) => issue.includes('Block Public Access'))).toBe(true);
  });

  it('should fail private storage when Bucket Policy is public-read', () => {
    const submission: Mission001Submission = {
      ...optimalSubmission,
      config: {
        ...optimalSubmission.config,
        s3BucketPolicy: 'public-read-statement',
      },
    };

    const result = evaluateMission001(submission);

    expect(result.passed).toBe(false);
    const storageReq = result.requirements.find((r) => r.id === 'req-private-storage')!;
    expect(storageReq.satisfied).toBe(false);
  });

  it('should fail when OAC is enabled on CloudFront but missing on Bucket Policy', () => {
    const submission: Mission001Submission = {
      ...optimalSubmission,
      config: {
        ...optimalSubmission.config,
        cloudfrontOacEnabled: true,
        s3BucketPolicy: 'none',
      },
    };

    const result = evaluateMission001(submission);

    expect(result.passed).toBe(false);
    expect(result.identifiedIssues.some((i) => i.includes('OAC'))).toBe(true);
  });

  it('should fail when S3 expects OAC but CloudFront OAC is disabled', () => {
    const submission: Mission001Submission = {
      ...optimalSubmission,
      config: {
        ...optimalSubmission.config,
        cloudfrontOacEnabled: false,
        s3BucketPolicy: 'oac-statement',
      },
    };

    const result = evaluateMission001(submission);

    expect(result.passed).toBe(false);
    expect(result.identifiedIssues.some((i) => i.includes('assinatura'))).toBe(true);
  });

  it('should fail HTTPS requirement when Viewer Protocol Policy is allow-all', () => {
    const submission: Mission001Submission = {
      ...optimalSubmission,
      config: {
        ...optimalSubmission.config,
        cloudfrontViewerProtocolPolicy: 'allow-all',
      },
    };

    const result = evaluateMission001(submission);

    expect(result.passed).toBe(false);
    const httpsReq = result.requirements.find((r) => r.id === 'req-https')!;
    expect(httpsReq.satisfied).toBe(false);
    expect(result.identifiedIssues.some((i) => i.includes('Allow All'))).toBe(true);
  });

  it('should flag Amazon VPC as unnecessary complexity without applying fake financial penalties', () => {
    const submission: Mission001Submission = {
      selectedServiceIds: ['amazon-s3', 'amazon-cloudfront', 'amazon-vpc'],
      config: optimalSubmission.config,
    };

    const result = evaluateMission001(submission);

    // Overall fails because architecture contains unnecessary service
    expect(result.passed).toBe(false);
    expect(result.unnecessaryServices).toContain('Amazon VPC');

    // Requirement 4 (Simplicidade) is NOT satisfied
    const simplicityReq = result.requirements.find((r) => r.id === 'req-simplicity')!;
    expect(simplicityReq.satisfied).toBe(false);
    expect(simplicityReq.explanation).toContain('desnecessários');

    // Requirement 5 (Eficiência de custos) is SATISFIED (no fake financial penalty)
    const costReq = result.requirements.find((r) => r.id === 'req-cost')!;
    expect(costReq.satisfied).toBe(true);
    expect(costReq.explanation).toContain('não possui cobrança adicional direta');
  });

  it('should be completely deterministic (same input produces same output)', () => {
    const run1 = evaluateMission001(optimalSubmission);
    const run2 = evaluateMission001(optimalSubmission);

    expect(run1).toEqual(run2);
  });
});
