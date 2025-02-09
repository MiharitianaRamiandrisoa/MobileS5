import React, { useState, useEffect } from 'react';
import { 
  View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Dimensions, ScrollView ,Alert 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import ModalComponent from 'react-native-modal';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';  // Assure-toi d'importer 'db' de firebaseConfig
import { collection, query, where, getDocs } from 'firebase/firestore';


// Dimensions pour adapter la grille
const { width } = Dimensions.get('window');
const cardSize = (width - 60) / 2; // 2 colonnes avec marge

const ProfileScreenModern = () => {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [operations, setOperations] = useState([]);
    const [favoris, setFavoris] = useState([]);
    const [balance, setBalance] = useState(0); // Pour le solde du portefeuille

  // Fonction pour récupérer les données de Firebase
  const fetchUserData = async () => {
    const user = getAuth().currentUser;
    if (!user) {
        Alert.alert('Erreur', 'Utilisateur non authentifié.');
        return;
    }

    const userId = user.uid;

    try {
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            Alert.alert('Erreur', 'Utilisateur non trouvé dans la base de données.');
            console.log('Utilisateur non trouvé');
            return;
        }

        const userData = userDoc.data();
        console.log("Données utilisateur récupérées :", userData);
        
        if (!userData.id_info_user) {
          Alert.alert('Erreur', 'ID info utilisateur non défini.');
          return;
        }
        setUserData(userData);
        // 🔹 Convertir en string avant d'utiliser comme ID
        const infoUserDocRef = doc(db, 'info_user', String(userData.id_info_user));
        const infoUserDoc = await getDoc(infoUserDocRef);
        
        if (!infoUserDoc.exists()) {
          Alert.alert('Erreur', 'Informations utilisateur non trouvées.');
          return;
        }
        
        const infoUserData = infoUserDoc.data();
        // console.log("Données utilisateur récupérées infoffff :", infoUserData);
        setUserInfo(infoUserData);
    } catch (error) {
        console.error('Erreur de récupération des données utilisateur:', error);
        Alert.alert('Erreur', 'Une erreur s\'est produite : ' + error.message);
    }
  };


   // Fonction pour récupérer les transactions (dépôts et retraits)
   const fetchTransactions = async (userId) => {
    try {
        const transactionsRef = collection(db, 'transactions');
        const q = query(transactionsRef, where('id_users', '==', userId)  ,where('valider' , '==', true ));

        const querySnapshot = await getDocs(q);
        let depositSum = 0;
        let withdrawalSum = 0;

        querySnapshot.forEach((doc) => {
            let transactionData = doc.data();

            // Si c'est un dépôt (id_type_transaction = 1)
            if (transactionData.id_type_transaction === 1) {
                depositSum += transactionData.montant; // Ajouter au total des dépôts
            }

            // Si c'est un retrait (id_type_transaction = 2)
            if (transactionData.id_type_transaction === 2) {
                withdrawalSum += transactionData.montant; // Ajouter au total des retraits
            }
        });

        return { depositSum, withdrawalSum };
    } catch (error) {
        console.error('Erreur lors de la récupération des transactions:', error);
        Alert.alert('Erreur', 'Impossible de récupérer les transactions.');
    }
  };

  // Fonction pour récupérer les opérations (achats et ventes)
  const fetchOperations = async (userId) => {
    try {
        const transactionsRef = collection(db, 'operations');
        const q = query(transactionsRef, where('id_users', '==', userId));

        const querySnapshot = await getDocs(q);
        let buySum = 0;
        let sellSum = 0;

        querySnapshot.forEach((doc) => {
            let operationData = doc.data();

            // Si c'est une vente (id_type_operation = 1)
            if (operationData.id_type_operation === 1) {
                sellSum += operationData.prix_unitaire*operationData.quantite; // Ajouter au total des ventes
            }

            // Si c'est un achat (id_type_operation = 2)
            if (operationData.id_type_operation === 2) {
                buySum += operationData.montant; // Ajouter au total des achats
            }
        });

        return { buySum, sellSum };
    } catch (error) {
        console.error('Erreur lors de la récupération des opérations:', error);
        Alert.alert('Erreur', 'Impossible de récupérer les opérations.');
    }
  };

  // Fonction pour calculer le solde du portefeuille
  const calculateBalance = async () => {
    if (userData) {
        const { depositSum, withdrawalSum } = await fetchTransactions(userData.id_users);
        const { buySum, sellSum } = await fetchOperations(userData.id_users);
        console.log(buySum);
        console.log(sellSum);
        // Calcul du solde : (dépôts + ventes) - (retraits + achats)
        const totalBalance = depositSum + sellSum - withdrawalSum - buySum;
        setBalance(totalBalance);
        console.log("Solde du portefeuille :", totalBalance);
    }
  };


  const fetchOperation = async (userId) => {
    try {
        const transactionsRef = collection(db, 'operations');
        const q = query(transactionsRef, where('id_users', '==', userId));

        const querySnapshot = await getDocs(q);
        const userOperations = [];

        querySnapshot.forEach((doc) => {
            let operationData = doc.data();

            // ✅ Vérifier si le champ `date` est un Timestamp et le convertir
            if (operationData.date_operation && operationData.date_operation.seconds) {
                operationData.date_operation = new Date(operationData.date_operation.seconds * 1000).toLocaleString(); 
            }

            userOperations.push({ id: doc.id, ...operationData });
        });

        setOperations(userOperations);
        console.log("Operations récupérées :", userOperations);
    } catch (error) {
        console.error('Erreur lors de la récupération des Operations:', error);
        Alert.alert('Erreur', 'Impossible de récupérer les Operations.');
    }
  };

  const fetchFavorites = async (userId) => {
    try {
        const favoritesRef = collection(db, `users/${userId}/favorites`); // Collection favorites de l'utilisateur
        const querySnapshot = await getDocs(favoritesRef);
        const favoriteCryptos = [];

        querySnapshot.forEach((doc) => {
            favoriteCryptos.push({ id: doc.id, ...doc.data() });
        });

        console.log("Cryptos favorites récupérées :", favoriteCryptos);

        setFavoris(favoriteCryptos);
    } catch (error) {
        console.error('Erreur lors de la récupération des cryptos favorites:', error);
        Alert.alert('Erreur', 'Impossible de récupérer les cryptos favorites.');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
      if (userData) {
          fetchOperation(userData.id_users);
          fetchFavorites(userData.id_users); // 🔥 Récupère les favoris ici
          calculateBalance(); // �� Calcul du solde ici
      }
  }, [userData]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleEditPhoto = () => {
    // Action pour modifier la photo
    console.log("Modifier la photo");
    toggleModal();
  };

  const handleViewPhoto = () => {
    // Action pour voir la photo
    console.log("Voir la photo");
    toggleModal();
  };

  const renderCryptoItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.cryptoCard} 
      onPress={() => navigation.navigate('CryptoDetail', { crypto: item })}
    >
      <LinearGradient
        colors={['#6dd5ed', '#2193b0']}
        style={styles.cryptoCardBackground}
        start={[0, 0]}
        end={[1, 1]}
      >
        {/* <Image source={{ uri: item.logoUrl }} style={styles.cryptoLogo} /> */}
        <Text style={styles.cryptoName}>{item.nom_cryptomonnaie}</Text>
        {/* <Text style={styles.cryptoSymbol}>{item.symbol}</Text> */}
      </LinearGradient>
    </TouchableOpacity>
  );

  if (!userInfo || !userData) {
    return <Text>Chargement...</Text>; // Afficher un message de chargement pendant la récupération des données
  }
  const getOperationLabel = (operationType) => {
    switch (operationType) {
      case 1:
        return 'Vente';
      case 2:
        return 'Achat';
     
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* En-tête avec photo et infos utilisateur */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleModal}>
        <Image source={{ uri: 'https://www.w3schools.com/w3images/avatar1.png' }} style={styles.profilePicture} />
        </TouchableOpacity>
        <Text style={styles.userName}>{userInfo.nom} {userInfo.prenom}</Text>
        <Text style={styles.userEmail}>{userData.mail}</Text>
      </View>

      <ModalComponent 
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        animationIn="slideInUp"
        animationOut="slideOutDown"
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalOption} onPress={handleEditPhoto}>
            <Text style={styles.modalText}>Modifier la photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalOption} onPress={handleViewPhoto}>
            <Text style={styles.modalText}>Voir la photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalCancel} onPress={toggleModal}>
            <Text style={styles.modalCancelText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </ModalComponent>
      
      {/* Solde du portefeuille */}
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceTitle}>Solde du portefeuille</Text>
        <Text style={styles.balanceAmount}>{balance.toFixed(2)}</Text>
      </View>

      <Text style={styles.sectionTitle}>Historique des opérations</Text>

      {operations.length === 0 ? (
  <Text style={styles.noTransactions}>Aucune opération disponible.</Text>
    ) : (
      operations.map((tx) => (
        <View key={tx.id_operation} style={styles.transactionItem}>
          <Text style={styles.transactionLabel}>
            Type d'opération:{" "}
            {tx.id_type_operation === 1
              ? "Vente"
              : tx.id_type_operation === 2
              ? "Achat"
              : "Opération"}
          </Text>
          <Text style={styles.transactionDetail}>
            Crypto ID: {tx.id_cryptomonnaie}
          </Text>
          <Text style={styles.transactionDetail}>
            Prix unitaire:{" "}
            {parseFloat(tx.prix_unitaire).toFixed(2)}
          </Text>
          <Text style={styles.transactionDetail}>
            Quantité: {tx.quantite }
          </Text>
          
          <Text style={styles.transactionDate}>
            Date: {tx.date_operation}
          </Text>
        </View>
      ))
    )}


      {/* Cryptos favorites */}
      <Text style={styles.sectionTitle}>Cryptos Favorites</Text>
      <FlatList
        data={favoris}
        renderItem={renderCryptoItem}
        keyExtractor={(item) => item.id_cryptomonnaie}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContainer}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: '#ddd',
  },
  userName: {
    marginTop: 10,
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 16,
    color: '#777',
  },
  balanceContainer: {
    backgroundColor: '#2193b0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  balanceTitle: {
    fontSize: 18,
    color: '#fff',
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  noTransactions: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
    marginBottom: 10,
  },
  transactionItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  transactionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#2193b0',
  },
  transactionDetail: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
  listContainer: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  cryptoCard: {
    width: cardSize,
    height: cardSize,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  cryptoCardBackground: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  cryptoSymbol: {
    fontSize: 14,
    color: '#fff',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOption: {
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2193b0',
  },
  modalCancel: {
    marginTop: 10,
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  modalCancelText: {
    fontSize: 16,
    color: '#777',
  }
});

export default ProfileScreenModern;
