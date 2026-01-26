import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import useStore from './store/index.js';
import AuthStack from './navigation/AuthStack.js';
import AppStack from './navigation/AppStack.js';

export default function App() {
  const loadUser = useStore((state) => state.authSlice.loadUser);
  const authenticated = useStore((state) => state.authSlice.authenticated);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {authenticated ? <AppStack /> : <AuthStack />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
