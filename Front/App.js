import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import des écrans
import HomeScreen from './screen/accueil';
import LoginScreen from './screen/login';
import ProfilePage from './screen/profil';
import Transaction from './screen/transaction';



// Initialisation du stack navigator
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home" // Écran initial par défaut
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2193b0', // Couleur de fond de l'en-tête
          },
          headerTintColor: '#fff', // Couleur des titres de l'en-tête
          headerTitleStyle: {
            fontWeight: 'bold', // Style du titre de l'en-tête
          },
        }}
      >
        {/* Définition des écrans dans le stack */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Profil" component={ProfilePage} />
        <Stack.Screen name="Transaction" component={Transaction} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
