import fs from 'fs/promises';
import path from 'path';
import type {
  PreferenceEvent,
  SiteAestheticAssessment,
  SiteCreativeComposition,
  SiteDeploymentPackage,
  SiteOperatorRunbook,
  SiteProfile,
  SiteRollbackReceipt,
  SiteSensoriumConfig,
  SiteSensoriumDeploymentPackage,
  SkinSpec,
  WebsiteIngestionResult,
} from './types.js';
import { assertSafeSiteId } from './siteIds.js';

export class SiteStore {
  readonly rootDir: string;

  constructor(rootDir = path.join(process.cwd(), '.liminal-sites')) {
    this.rootDir = path.resolve(rootDir);
  }

  async writeProfile(profile: SiteProfile): Promise<void> {
    await this.writeJson(this.profilePath(profile.siteId), profile);
  }

  async readProfile(siteId: string): Promise<SiteProfile> {
    return this.readJson<SiteProfile>(this.profilePath(siteId));
  }

  async listProfiles(): Promise<SiteProfile[]> {
    const dir = path.resolve(this.rootDir, 'sites');
    const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
    const profiles = await Promise.all(
      entries
        .filter((entry) => entry.isDirectory())
        .map(async (entry) => {
          try {
            return await this.readJson<SiteProfile>(this.profilePath(entry.name));
          } catch {
            return null;
          }
        }),
    );
    return profiles
      .filter((profile): profile is SiteProfile => Boolean(profile))
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  async writeVariant(variant: SkinSpec): Promise<void> {
    await this.writeJson(this.variantPath(variant.siteId, variant.skinId), variant);
  }

  async readVariant(siteId: string, skinId: string): Promise<SkinSpec> {
    return this.readJson<SkinSpec>(this.variantPath(siteId, skinId));
  }

  async listVariants(siteId: string): Promise<SkinSpec[]> {
    const dir = this.sitePath(siteId, 'variants');
    const entries = await fs.readdir(dir).catch(() => []);
    const variants = await Promise.all(
      entries
        .filter((entry) => entry.endsWith('.json'))
        .map((entry) => this.readJson<SkinSpec>(path.join(dir, entry))),
    );
    return variants.sort((a, b) =>
      a.createdAt.localeCompare(b.createdAt)
      || variantOrdinal(a.skinId) - variantOrdinal(b.skinId)
      || a.skinId.localeCompare(b.skinId)
    );
  }

  async writeIngestion(result: WebsiteIngestionResult): Promise<void> {
    await this.writeJson(this.ingestionPath(result.siteId, result.ingestionId), result);
  }

  async readIngestion(siteId: string, ingestionId: string): Promise<WebsiteIngestionResult> {
    return this.readJson<WebsiteIngestionResult>(this.ingestionPath(siteId, ingestionId));
  }

  async listIngestions(siteId: string): Promise<WebsiteIngestionResult[]> {
    const dir = this.sitePath(siteId, 'ingestions');
    const entries = await fs.readdir(dir).catch(() => []);
    const ingestions = await Promise.all(
      entries
        .filter((entry) => entry.endsWith('.json'))
        .map((entry) => this.readJson<WebsiteIngestionResult>(path.join(dir, entry))),
    );
    return ingestions.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  async writeAestheticAssessment(assessment: SiteAestheticAssessment): Promise<void> {
    await this.writeJson(this.aestheticAssessmentPath(assessment.siteId, assessment.assessmentId), assessment);
  }

  async readAestheticAssessment(siteId: string, assessmentId: string): Promise<SiteAestheticAssessment> {
    return this.readJson<SiteAestheticAssessment>(this.aestheticAssessmentPath(siteId, assessmentId));
  }

  async listAestheticAssessments(siteId: string): Promise<SiteAestheticAssessment[]> {
    const dir = this.sitePath(siteId, 'aesthetic-assessments');
    const entries = await fs.readdir(dir).catch(() => []);
    const assessments = await Promise.all(
      entries
        .filter((entry) => entry.endsWith('.json'))
        .map((entry) => this.readJson<SiteAestheticAssessment>(path.join(dir, entry))),
    );
    return assessments.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  async writeCreativeComposition(composition: SiteCreativeComposition): Promise<void> {
    await this.writeJson(this.creativeCompositionPath(composition.siteId, composition.compositionId), composition);
  }

  async readCreativeComposition(siteId: string, compositionId: string): Promise<SiteCreativeComposition> {
    return this.readJson<SiteCreativeComposition>(this.creativeCompositionPath(siteId, compositionId));
  }

  async listCreativeCompositions(siteId: string): Promise<SiteCreativeComposition[]> {
    const dir = this.sitePath(siteId, 'creative-compositions');
    const entries = await fs.readdir(dir).catch(() => []);
    const compositions = await Promise.all(
      entries
        .filter((entry) => entry.endsWith('.json'))
        .map((entry) => this.readJson<SiteCreativeComposition>(path.join(dir, entry))),
    );
    return compositions.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  async writeDeploymentPackage(deployment: SiteDeploymentPackage): Promise<void> {
    await this.writeJson(this.deploymentPackagePath(deployment.siteId, deployment.deploymentId), deployment);
  }

  async readDeploymentPackage(siteId: string, deploymentId: string): Promise<SiteDeploymentPackage> {
    return this.readJson<SiteDeploymentPackage>(this.deploymentPackagePath(siteId, deploymentId));
  }

  async listDeploymentPackages(siteId: string): Promise<SiteDeploymentPackage[]> {
    const dir = this.sitePath(siteId, 'deployments');
    const entries = await fs.readdir(dir).catch(() => []);
    const deployments = await Promise.all(
      entries
        .filter((entry) => entry.endsWith('.json'))
        .map((entry) => this.readJson<SiteDeploymentPackage>(path.join(dir, entry))),
    );
    return deployments.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  async writeSensoriumConfig(config: SiteSensoriumConfig): Promise<void> {
    await this.writeJson(this.sensoriumConfigPath(config.siteId, config.configId), config);
  }

  async readSensoriumConfig(siteId: string, configId: string): Promise<SiteSensoriumConfig> {
    return this.readJson<SiteSensoriumConfig>(this.sensoriumConfigPath(siteId, configId));
  }

  async listSensoriumConfigs(siteId: string): Promise<SiteSensoriumConfig[]> {
    const dir = this.sitePath(siteId, 'sensorium-configs');
    const entries = await fs.readdir(dir).catch(() => []);
    const configs = await Promise.all(
      entries
        .filter((entry) => entry.endsWith('.json'))
        .map((entry) => this.readJson<SiteSensoriumConfig>(path.join(dir, entry))),
    );
    return configs.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  async writeSensoriumDeploymentPackage(deployment: SiteSensoriumDeploymentPackage): Promise<void> {
    await this.writeJson(this.sensoriumDeploymentPackagePath(deployment.siteId, deployment.deploymentId), deployment);
  }

  async readSensoriumDeploymentPackage(siteId: string, deploymentId: string): Promise<SiteSensoriumDeploymentPackage> {
    return this.readJson<SiteSensoriumDeploymentPackage>(this.sensoriumDeploymentPackagePath(siteId, deploymentId));
  }

  async listSensoriumDeploymentPackages(siteId: string): Promise<SiteSensoriumDeploymentPackage[]> {
    const dir = this.sitePath(siteId, 'sensorium-deployments');
    const entries = await fs.readdir(dir).catch(() => []);
    const deployments = await Promise.all(
      entries
        .filter((entry) => entry.endsWith('.json'))
        .map((entry) => this.readJson<SiteSensoriumDeploymentPackage>(path.join(dir, entry))),
    );
    return deployments.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  async writeRollbackReceipt(receipt: SiteRollbackReceipt): Promise<void> {
    await this.writeJson(this.rollbackReceiptPath(receipt.siteId, receipt.rollbackId), receipt);
  }

  async readRollbackReceipt(siteId: string, rollbackId: string): Promise<SiteRollbackReceipt> {
    return this.readJson<SiteRollbackReceipt>(this.rollbackReceiptPath(siteId, rollbackId));
  }

  async listRollbackReceipts(siteId: string): Promise<SiteRollbackReceipt[]> {
    const dir = this.sitePath(siteId, 'rollbacks');
    const entries = await fs.readdir(dir).catch(() => []);
    const receipts = await Promise.all(
      entries
        .filter((entry) => entry.endsWith('.json'))
        .map((entry) => this.readJson<SiteRollbackReceipt>(path.join(dir, entry))),
    );
    return receipts.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  async writeOperatorRunbook(runbook: SiteOperatorRunbook): Promise<void> {
    await this.writeJson(this.operatorRunbookPath(runbook.siteId, runbook.runbookId), runbook);
  }

  async readOperatorRunbook(siteId: string, runbookId: string): Promise<SiteOperatorRunbook> {
    return this.readJson<SiteOperatorRunbook>(this.operatorRunbookPath(siteId, runbookId));
  }

  async listOperatorRunbooks(siteId: string): Promise<SiteOperatorRunbook[]> {
    const dir = this.sitePath(siteId, 'operator-runbooks');
    const entries = await fs.readdir(dir).catch(() => []);
    const runbooks = await Promise.all(
      entries
        .filter((entry) => entry.endsWith('.json'))
        .map((entry) => this.readJson<SiteOperatorRunbook>(path.join(dir, entry))),
    );
    return runbooks.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  ingestionArtifactPath(siteId: string, ingestionId: string, fileName: string): string {
    assertSafeSiteId(ingestionId);
    if (!/^[a-z0-9][a-z0-9._-]{1,120}$/i.test(fileName)) throw new Error(`Unsafe ingestion artifact name: ${fileName}`);
    return this.sitePath(siteId, 'ingestions', ingestionId, fileName);
  }

  deploymentArtifactPath(siteId: string, deploymentId: string, fileName: string): string {
    assertSafeSiteId(deploymentId);
    if (!/^[a-z0-9][a-z0-9._-]{1,120}$/i.test(fileName)) throw new Error(`Unsafe deployment artifact name: ${fileName}`);
    return this.sitePath(siteId, 'deployments', deploymentId, fileName);
  }

  sensoriumDeploymentArtifactPath(siteId: string, deploymentId: string, fileName: string): string {
    assertSafeSiteId(deploymentId);
    if (!/^[a-z0-9][a-z0-9._-]{1,120}$/i.test(fileName)) throw new Error(`Unsafe sensorium deployment artifact name: ${fileName}`);
    return this.sitePath(siteId, 'sensorium-deployments', deploymentId, fileName);
  }

  async appendPreference(event: PreferenceEvent): Promise<PreferenceEvent[]> {
    const events = await this.listPreferences(event.siteId);
    events.push(event);
    await this.writeJson(this.preferencesPath(event.siteId), events);
    return events;
  }

  async listPreferences(siteId: string): Promise<PreferenceEvent[]> {
    return this.readJson<PreferenceEvent[]>(this.preferencesPath(siteId)).catch(() => []);
  }

  private profilePath(siteId: string): string {
    return this.sitePath(siteId, 'profile.json');
  }

  private variantPath(siteId: string, skinId: string): string {
    assertSafeSiteId(skinId);
    return this.sitePath(siteId, 'variants', `${skinId}.json`);
  }

  private preferencesPath(siteId: string): string {
    return this.sitePath(siteId, 'preferences.json');
  }

  private ingestionPath(siteId: string, ingestionId: string): string {
    assertSafeSiteId(ingestionId);
    return this.sitePath(siteId, 'ingestions', `${ingestionId}.json`);
  }

  private aestheticAssessmentPath(siteId: string, assessmentId: string): string {
    assertSafeSiteId(assessmentId);
    return this.sitePath(siteId, 'aesthetic-assessments', `${assessmentId}.json`);
  }

  private creativeCompositionPath(siteId: string, compositionId: string): string {
    assertSafeSiteId(compositionId);
    return this.sitePath(siteId, 'creative-compositions', `${compositionId}.json`);
  }

  private deploymentPackagePath(siteId: string, deploymentId: string): string {
    assertSafeSiteId(deploymentId);
    return this.sitePath(siteId, 'deployments', `${deploymentId}.json`);
  }

  private sensoriumConfigPath(siteId: string, configId: string): string {
    assertSafeSiteId(configId);
    return this.sitePath(siteId, 'sensorium-configs', `${configId}.json`);
  }

  private sensoriumDeploymentPackagePath(siteId: string, deploymentId: string): string {
    assertSafeSiteId(deploymentId);
    return this.sitePath(siteId, 'sensorium-deployments', `${deploymentId}.json`);
  }

  private rollbackReceiptPath(siteId: string, rollbackId: string): string {
    assertSafeSiteId(rollbackId);
    return this.sitePath(siteId, 'rollbacks', `${rollbackId}.json`);
  }

  private operatorRunbookPath(siteId: string, runbookId: string): string {
    assertSafeSiteId(runbookId);
    return this.sitePath(siteId, 'operator-runbooks', `${runbookId}.json`);
  }

  private sitePath(siteId: string, ...segments: string[]): string {
    assertSafeSiteId(siteId);
    const resolved = path.resolve(this.rootDir, 'sites', siteId, ...segments);
    if (!resolved.startsWith(this.rootDir + path.sep)) {
      throw new Error(`Unsafe site path: ${resolved}`);
    }
    return resolved;
  }

  private async writeJson(filePath: string, value: unknown): Promise<void> {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf-8');
  }

  private async readJson<T>(filePath: string): Promise<T> {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  }
}

function variantOrdinal(skinId: string): number {
  const match = skinId.match(/-(\d+)$/);
  return match ? Number.parseInt(match[1], 10) : Number.MAX_SAFE_INTEGER;
}
