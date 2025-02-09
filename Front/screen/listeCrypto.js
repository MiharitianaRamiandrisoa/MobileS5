import React, { useState, useEffect } from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';


const CryptoListScreen = () => {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  // Simule une API qui met à jour les prix toutes les 10 secondes
  useEffect(() => {
    const fetchCryptoData = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd');
        const data = await response.json();
        setCryptos(data);
      } catch (error) {
        console.error('Erreur de récupération des données :', error);
      }
      setLoading(false);
    };

    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const toggleFavorite = (cryptoId) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(cryptoId) 
        ? prevFavorites.filter(id => id !== cryptoId)
        : [...prevFavorites, cryptoId]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.cryptoCard}>
      <LinearGradient colors={['#6dd5ed', '#2193b0']} style={styles.cryptoCardBackground}>
        <Image source={{ uri: item.image }} style={styles.cryptoLogo} />
        <Text style={styles.cryptoName}>{item.name} ({item.symbol.toUpperCase()})</Text>
        <Text style={styles.cryptoPrice}>${item.current_price.toFixed(2)}</Text>
        <TouchableOpacity 
          style={[styles.favoriteButton, favorites.includes(item.id) && styles.favoriteButtonActive]}
          onPress={() => toggleFavorite(item.id)}
        >
          <Text style={styles.favoriteButtonText}>
            {favorites.includes(item.id) ? '★ Favori' : '☆ Ajouter'}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );

  return (
    <View style={styles.container}>
         {/* Ajouter le Menu ici */}
      <Menu navigation={navigation} />
      <Text style={styles.headerTitle}>Liste des Cryptos</Text>
      {loading ? <ActivityIndicator size="large" color="#2193b0" /> : (
        <FlatList
          data={cryptos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  listContainer: {
    paddingBottom: 20,
  },
  cryptoCard: {
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 15,
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
  },
  cryptoLogo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  cryptoName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  cryptoPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  favoriteButton: {
    marginTop: 10,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
  },
  favoriteButtonActive: {
    backgroundColor: '#ffd700',
  },
  favoriteButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default CryptoListScreen;