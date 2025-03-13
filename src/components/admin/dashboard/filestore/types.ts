
export interface StorageConfig {
  driverName: string;
  apiKey: string;
  secretKey: string;
  region: string;
  bucketName: string;
  endpoint: string;
  isDefault: boolean;
}

export interface FileStoreFormProps {
  wasabiConfig: StorageConfig;
  cloudflareConfig: StorageConfig;
  setWasabiConfig: (config: StorageConfig) => void;
  setCloudflareConfig: (config: StorageConfig) => void;
  handleDefaultChange: (provider: string, isDefault: boolean) => void;
  handleWasabiSubmit: (e: React.FormEvent) => void;
  handleCloudflareSubmit: (e: React.FormEvent) => void;
}
