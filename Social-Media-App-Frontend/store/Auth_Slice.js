import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.0.46:9090/api/auth';

export default function createAuthSlice(set) {
  return {
    authenticated: false,

    loadUser: async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        set((userState) => {
          // eslint-disable-next-line no-param-reassign
          userState.authSlice.authenticated = true;
        });
      }
    },

    signinUser: async (fields) => {
      try {
        const response = await axios.post(`${API_URL}/signin`, fields);
        await AsyncStorage.setItem('token', response.data.token);

        set((userState) => {
          // eslint-disable-next-line no-param-reassign
          userState.authSlice.authenticated = true;
        });
      } catch (error) {
        console.log(`Error frontend signinUser: ${error}`);
      }
    },

    signupUser: async (fields) => {
      try {
        const response = await axios.post(`${API_URL}/signup`, fields);
        await AsyncStorage.setItem('token', response.data.token);

        set((userState) => {
          // eslint-disable-next-line no-param-reassign
          userState.authSlice.authenticated = true;
        });
      } catch (error) {
        console.log(`Error frontend signinUser: ${error}`);
      }
    },
    logout: async () => {
      await AsyncStorage.removeItem('token');
      set((userState) => {
        // eslint-disable-next-line no-param-reassign
        userState.authSlice.authenticated = false;
      });
    },
  };
}
