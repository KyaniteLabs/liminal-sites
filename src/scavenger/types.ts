export interface ProjectDNA {
  name: string;
  domain: string;
  coreLogic: string;
  constraints: string[];
  patterns: string[];
  prompts: string[];
  extractedAt: string;
  sourcePath: string;
}

export interface ScavengerConfig {
  scanPaths: string[];
  outputDir?: string;
  autoRegister?: boolean;
}
