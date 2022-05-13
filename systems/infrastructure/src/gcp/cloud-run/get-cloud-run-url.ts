import type { cloudrun } from '@pulumi/gcp';

export function getCloudRunUrl(cloudRun: cloudrun.Service) {
  return cloudRun.statuses.apply(([{ url: cloudRunUrl }]) => cloudRunUrl);
}
