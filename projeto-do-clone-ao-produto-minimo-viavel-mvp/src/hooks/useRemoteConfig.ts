import { useState, useEffect } from 'react';
import { fetchAndActivate, getValue } from 'firebase/remote-config';
import { remoteConfig } from '../lib/firebase';

export interface RemoteConfigValues {
  welcome_message: string;
  primary_color: string;
  show_ai_detector: boolean;
  loading: boolean;
}

export const useRemoteConfig = () => {
  const [config, setConfig] = useState<RemoteConfigValues>({
    welcome_message: 'Desvende os segredos escondidos em seus arquivos.',
    primary_color: '#7c3aed',
    show_ai_detector: true,
    loading: true,
  });

  useEffect(() => {
    const initRemoteConfig = async () => {
      try {
        await fetchAndActivate(remoteConfig);
        
        setConfig({
          welcome_message: getValue(remoteConfig, 'welcome_message').asString(),
          primary_color: getValue(remoteConfig, 'primary_color').asString(),
          show_ai_detector: getValue(remoteConfig, 'show_ai_detector').asBoolean(),
          loading: false,
        });
      } catch (error) {
        console.error('Failed to fetch remote config:', error);
        setConfig(prev => ({ ...prev, loading: false }));
      }
    };

    initRemoteConfig();
  }, []);

  return config;
};
