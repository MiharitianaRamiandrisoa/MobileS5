import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { getFirestore, collection, getDocs, setDoc, doc, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const Accueil = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const user = route.params?.user;
  const isAuthenticated = !!user;

  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);

  // Fonction de récupération des cryptos
  const fetchCryptos = async () => {
    if (isAuthenticated) {
      const user = getAuth().currentUser;
      if (user) {
        const userId = user.uid;
        const db = getFirestore();
        const cryptosRef = collection(db, 'cryptos');
        
        setLoading(true);
        
        try {
          const snapshot = await getDocs(cryptosRef);
          if (!snapshot.empty) {
            const cryptosList = snapshot.docs.map(doc => doc.data());
            setCryptos(cryptosList);
          } else {
            Alert.alert('Erreur', 'Aucune donnée disponible.');
          }
        } catch (error) {
          console.error('Erreur de récupération des cryptos:', error);
          Alert.alert('Erreur', 'Une erreur s\'est produite lors de la récupération des données.');
        } finally {
          setLoading(false);
        }
      }
    }
  };

  // Fonction de récupération des favoris
  const fetchFavorites = async () => {
    if (isAuthenticated) {
      const user = getAuth().currentUser;
      if (user) {
        const userId = user.uid;
        const db = getFirestore();
        const favoritesRef = collection(db, `users/${userId}/favorites`);
        
        try {
          const snapshot = await getDocs(favoritesRef);
          if (!snapshot.empty) {
            const favoritesList = snapshot.docs.map(doc => doc.data());
            setFavorites(favoritesList);
          }else{

            setFavorites(new Array());
          }
        } catch (error) {
          console.error('Erreur de récupération des favoris:', error);
          Alert.alert('Erreur', 'Une erreur s\'est produite lors de la récupération des favoris.');
        }
      }
    }
  };

  useEffect(() => {
    fetchCryptos();
    fetchFavorites();
  }, [isAuthenticated]);

  const handleAddToFavorites = async (crypto) => {
    if (isAuthenticated) {
      const user = getAuth().currentUser;
      if (user) {
        const userId = user.uid;
        const db = getFirestore();
        const favoriteRef = doc(db, `users/${userId}/favorites/${crypto.id}`);
        
        try {
          await setDoc(favoriteRef, crypto);
          Alert.alert('Succès', `${crypto.name} ajouté aux favoris !`);
          fetchFavorites(); // Mise à jour des favoris après ajout
          console.log("ajouter dans les favoris ");
        } catch (error) {
          console.error('Erreur lors de l\'ajout aux favoris:', error);
          Alert.alert('Erreur', 'Une erreur est survenue.');
        }
      }
    } else {
      Alert.alert('Erreur', 'Vous devez être connecté pour ajouter aux favoris.');
    }
  };
  
  const handleRemoveFromFavorites = async (crypto) => {
    if (isAuthenticated) {
      const user = getAuth().currentUser;
      if (user) {
        const userId = user.uid;
        const db = getFirestore();
        const favoriteRef = doc(db, `users/${userId}/favorites/${crypto.id}`);
        
        try {
          await deleteDoc(favoriteRef);
          Alert.alert('Succès', `${crypto.name} retiré des favoris !`);
          fetchFavorites(); // Mise à jour des favoris après retrait
          console.log("retirer dans les favoris ");

        } catch (error) {
          console.error('Erreur lors du retrait des favoris:', error);
          Alert.alert('Erreur', 'Une erreur est survenue.');
        }
      }
    } else {
      Alert.alert('Erreur', 'Vous devez être connecté pour retirer des favoris.');
    }
  };
  

  const renderItem = ({ item }) => {
    const isFavorite = favorites.some(fav => fav.id === item.id);
    
    return (
      <View style={styles.cryptoCard}>
        <LinearGradient colors={['#6dd5ed', '#2193b0']} style={styles.cryptoCardBackground}>
          <Text style={styles.cryptoName}>{item.name} ({item.symbol.toUpperCase()})</Text>
          <Text style={styles.cryptoPrice}>${item.current_price.toFixed(2)}</Text>

          {isAuthenticated && (
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => {
                if (isFavorite) {
                  handleRemoveFromFavorites(item);
                } else {
                  handleAddToFavorites(item);
                }
              }}
            >
              <Text style={styles.favoriteText}>
                {isFavorite ? '⭐ Retirer des favoris' : '⭐ Ajouter aux favoris'}
              </Text>
            </TouchableOpacity>
          )}
        </LinearGradient>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {isAuthenticated && (
        <TouchableOpacity 
          style={styles.transactionLink}
          onPress={() => navigation.navigate('Transaction')}
        >
          <Text style={styles.transactionText}>{'Transaction'}</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity 
        style={styles.loginLink}
        onPress={() => navigation.navigate(isAuthenticated ? 'Profil' : 'Login')}
      >
        <Text style={styles.loginText}>{isAuthenticated ? 'Profil' : 'Se connecter'}</Text>
      </TouchableOpacity>

      <View style={styles.logoContainer}>
        <Text style={styles.logo}>CryptoNexus</Text>
      </View>

      <View style={styles.cryptoListContainer}>
        <Text style={styles.title}>Liste des Cryptos</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#2193b0" />
        ) : (
          <FlatList
            data={cryptos}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginTop: 120,
    marginBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 55,
    fontWeight: 'bold',
    color: '#2193b0',
    letterSpacing: 1,
    textAlign: 'center',
  },
  loginLink: {
    position: 'absolute',
    top: 10,
    right: 20,
  },
  loginText: {
    color: '#2193b0',
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionLink: {
    position: 'absolute',
    top: 10,
  },
  transactionText: {
    color: '#2193b0',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cryptoListContainer: {
    marginTop: 70,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  cryptoCard: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  cryptoCardBackground: {
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
  },
  cryptoName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  cryptoPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  favoriteButton: {
    marginTop: 10,
    backgroundColor: '#ffcc00',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  favoriteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Accueil;
