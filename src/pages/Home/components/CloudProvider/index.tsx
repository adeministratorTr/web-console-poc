import { CLOUD_PROVIDER_LIST, TCloudProviderValues } from 'reducers/constants/cloud';

import styles from './CloudProvider.module.scss';

export default function CloudProvider({
  onSelect
}: {
  onSelect: (value: TCloudProviderValues) => void;
}) {
  return (
    <div className={styles.container} data-testid="HomeCloudProvider">
      {CLOUD_PROVIDER_LIST.map((provider) => (
        <div
          className={styles.item}
          key={provider.id}
          onClick={() => onSelect(provider.value)}
          data-testid="HomeCloudProviderItem"
        >
          {provider.text}
        </div>
      ))}
    </div>
  );
}
