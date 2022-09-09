type TCloudProvider = {
  id: number;
  value: TCloudProviderValues;
  text: TCloudProviders;
};

export type TCloudProviderValues = 'azure' | 'aws' | 'google' | 'do' | 'upcloud';
type TCloudProviders =
  | 'Azure'
  | 'Amazon Web Services'
  | 'Google Cloud'
  | 'DigitalOcean'
  | 'UpCloud';

const cloudProviderMapper: Record<TCloudProviderValues, TCloudProviders> = {
  azure: 'Azure',
  aws: 'Amazon Web Services',
  google: 'Google Cloud',
  do: 'DigitalOcean',
  upcloud: 'UpCloud'
};

export const CLOUD_PROVIDER_LIST: TCloudProvider[] = [
  {
    id: 1,
    value: 'azure',
    text: cloudProviderMapper['azure']
  },
  {
    id: 2,
    value: 'aws',
    text: cloudProviderMapper['aws']
  },
  {
    id: 3,
    value: 'google',
    text: cloudProviderMapper['google']
  },
  {
    id: 4,
    value: 'do',
    text: cloudProviderMapper['do']
  },
  {
    id: 5,
    value: 'upcloud',
    text: cloudProviderMapper['upcloud']
  }
];
