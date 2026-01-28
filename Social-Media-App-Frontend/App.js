import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useStore from './store/index.js';
import AuthStack from './navigation/AuthStack.js';
import AppStack from './navigation/AppStack.js';
import OnboardingStack from './navigation/OnboardingStack.js';

export default function App() {
  const loadUser = useStore((state) => state.authSlice.loadUser);
  const authenticated = useStore((state) => state.authSlice.authenticated);
  const justSignedUp = useStore((state) => state.authSlice.justSignedUp);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {!authenticated && <AuthStack />}

        {authenticated && justSignedUp && <OnboardingStack />}

        {authenticated && !justSignedUp && <AppStack />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
