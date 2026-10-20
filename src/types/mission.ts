export type S3OriginType = 's3-rest' | 's3-website';

export type S3BucketPolicyType = 'oac-statement' | 'public-read-statement' | 'none';

export type ViewerProtocolPolicy = 'redirect-to-https' | 'https-only' | 'allow-all';

export interface Mission001Config {
  s3OriginType?: S3OriginType;
  s3BlockPublicAccess?: boolean;
  s3BucketPolicy?: S3BucketPolicyType;
  cloudfrontOacEnabled?: boolean;
  cloudfrontViewerProtocolPolicy?: ViewerProtocolPolicy;
}

export interface Mission001Submission {
  selectedServiceIds: string[];
  config: Mission001Config;
}

export interface RequirementEvaluation {
  id: 'req-latency' | 'req-private-storage' | 'req-https' | 'req-simplicity' | 'req-cost';
  title: string;
  satisfied: boolean;
  explanation: string;
}

export type RelevantPillar = 'security' | 'performance' | 'cost' | 'operational';

export interface PillarFeedback {
  pillar: RelevantPillar;
  pillarLabel: string;
  status: 'aligned' | 'improvement-needed' | 'at-risk';
  summary: string;
}

export interface MissionEvaluationResult {
  passed: boolean;
  verdictTitle: string;
  verdictDescription: string;
  requirements: RequirementEvaluation[];
  pillars: PillarFeedback[];
  identifiedIssues: string[];
  unnecessaryServices: string[];
  recommendations: string[];
  saaC03Takeaways: string[];
}
