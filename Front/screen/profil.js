// import React, { useState } from 'react';
// import { 
//   View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Dimensions, ScrollView 
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useNavigation } from '@react-navigation/native';
// import ModalComponent from 'react-native-modal';

// // Dimensions pour adapter la grille
// const { width } = Dimensions.get('window');
// const cardSize = (width - 60) / 2; // 2 colonnes avec marge

// // Exemple de données utilisateur
// const user = {
//   name: 'John Doe',
//   email: 'johndoe@example.com',
//   profilePicture: require('../assets/icon.png'), // Image locale
//   balance: 15200.75, // Solde du portefeuille
//   transactions: [
//     { id: '1', type: 'Achat', crypto: 'Bitcoin', amount: 0.05, date: '2025-02-01' },
//     { id: '2', type: 'Vente', crypto: 'Ethereum', amount: 1.2, date: '2025-01-29' },
//     { id: '3', type: 'Achat', crypto: 'Ripple', amount: 500, date: '2025-01-25' },
//   ],
  
//   favoriteCryptos: [
//         { id: '1', name: 'Bitcoin', symbol: 'BTC', logoUrl: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=014' },
//         { id: '2', name: 'Ethereum', symbol: 'ETH', logoUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=014' },
//         { id: '3', name: 'Ripple', symbol: 'XRP', logoUrl: 'https://cryptologos.cc/logos/xrp-xrp-logo.png?v=014' },
//         { id: '4', name: 'Litecoin', symbol: 'LTC', logoUrl: 'https://cryptologos.cc/logos/litecoin-ltc-logo.png?v=014' },
//       ],
//   };

// const ProfileScreenModern = () => {
//   const navigation = useNavigation();
//   const [isModalVisible, setModalVisible] = useState(false);

//   const toggleModal = () => {
//         setModalVisible(!isModalVisible);
//       };
    
//       const handleEditPhoto = () => {
//         // Action pour modifier la photo
//         console.log("Modifier la photo");
//         toggleModal();
//       };
    
//       const handleViewPhoto = () => {
//         // Action pour voir la photo
//         console.log("Voir la photo");
//         toggleModal();
//       };

//   const renderCryptoItem = ({ item }) => (
//     <TouchableOpacity 
//       style={styles.cryptoCard} 
//       onPress={() => navigation.navigate('CryptoDetail', { crypto: item })}
//     >
//       <LinearGradient
//         colors={['#6dd5ed', '#2193b0']}
//         style={styles.cryptoCardBackground}
//         start={[0, 0]}
//         end={[1, 1]}
//       >
//         <Image source={{ uri: item.logoUrl }} style={styles.cryptoLogo} />
//         <Text style={styles.cryptoName}>{item.name}</Text>
//         <Text style={styles.cryptoSymbol}>{item.symbol}</Text>
//       </LinearGradient>
//     </TouchableOpacity>
//   );

//   return (
//     <ScrollView style={styles.container}>
//       {/* En-tête avec photo et infos utilisateur */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={toggleModal}>
//           <Image source={user.profilePicture} style={styles.profilePicture} />
//         </TouchableOpacity>
//         <Text style={styles.userName}>{user.name}</Text>
//         <Text style={styles.userEmail}>{user.email}</Text>
//       </View>

//       <ModalComponent 
//         isVisible={isModalVisible}
//         onBackdropPress={toggleModal}
//         animationIn="slideInUp"
//         animationOut="slideOutDown"
//       >
//         <View style={styles.modalContainer}>
//           <TouchableOpacity style={styles.modalOption} onPress={handleEditPhoto}>
//             <Text style={styles.modalText}>Modifier la photo</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.modalOption} onPress={handleViewPhoto}>
//             <Text style={styles.modalText}>Voir la photo</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.modalCancel} onPress={toggleModal}>
//             <Text style={styles.modalCancelText}>Annuler</Text>
//           </TouchableOpacity>
//         </View>
//       </ModalComponent>
      
//       {/* Solde du portefeuille */}
//       <View style={styles.balanceContainer}>
//         <Text style={styles.balanceTitle}>Solde du portefeuille</Text>
//         <Text style={styles.balanceAmount}>${user.balance.toFixed(2)}</Text>
//       </View>

//       {/* Historique des transactions */}
//       <Text style={styles.sectionTitle}>Historique des transactions</Text>
//       {user.transactions.map((tx) => (
//         <View key={tx.id} style={styles.transactionItem}>
//           <Text style={styles.transactionText}>
//             {tx.type} {tx.amount} {tx.crypto}
//           </Text>
//           <Text style={styles.transactionDate}>{tx.date}</Text>
//         </View>
//       ))}

//       {/* Cryptos favorites */}
//       <Text style={styles.sectionTitle}>Cryptos Favorites</Text>
//       <FlatList
//         data={user.favoriteCryptos}
//         renderItem={renderCryptoItem}
//         keyExtractor={(item) => item.id}
//         numColumns={2}
//         columnWrapperStyle={styles.columnWrapper}
//         contentContainerStyle={styles.listContainer}
//       />
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#F2F2F2',
//         paddingHorizontal: 20,
//         paddingTop: 50,
//     },
//     header: {
//         alignItems: 'center',
//         marginBottom: 30,
//     },
//     profilePicture: {
//         width: 120,
//         height: 120,
//         borderRadius: 60,
//         borderWidth: 3,
//         borderColor: '#fff',
//         backgroundColor: '#ddd',
//     },
//     userName: {
//         marginTop: 10,
//         fontSize: 26,
//         fontWeight: 'bold',
//         color: '#333',
//     },
//     userEmail: {
//         fontSize: 16,
//         color: '#777',
//     },
//     balanceContainer: {
//         backgroundColor: '#2193b0',
//         padding: 15,
//         borderRadius: 10,
//         alignItems: 'center',
//         marginBottom: 20,
//     },
//     balanceTitle: {
//         fontSize: 18,
//         color: '#fff',
//     },
//     balanceAmount: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         color: '#fff',
//     },
//     sectionTitle: {
//         fontSize: 20,
//         fontWeight: 'bold',
//         marginBottom: 10,
//         color: '#333',
//     },
//     transactionItem: {
//         backgroundColor: '#fff',
//         padding: 15,
//         borderRadius: 10,
//         marginBottom: 10,
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//     },
//     transactionText: {
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
//     transactionDate: {
//         fontSize: 14,
//         color: '#777',
//     },
//     listContainer: {
//         paddingBottom: 20,
//     },
//     columnWrapper: {
//         justifyContent: 'space-between',
//         marginBottom: 15,
//     },
//     cryptoCard: {
//         width: cardSize,
//         height: cardSize,
//         borderRadius: 15,
//         overflow: 'hidden',
//         elevation: 3,
//         shadowColor: '#000',
//         shadowOpacity: 0.2,
//         shadowRadius: 5,
//         shadowOffset: { width: 0, height: 2 },
//     },
//     cryptoCardBackground: {
//         flex: 1,
//         padding: 10,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     cryptoLogo: {
//         width: 50,
//         height: 50,
//         resizeMode: 'contain',
//         marginBottom: 10,
//     },
//     cryptoName: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         color: '#fff',
//     },
//     cryptoSymbol: {
//         fontSize: 14,
//         color: '#fff',
//     },
//     modalContainer: {
//             backgroundColor: '#fff',
//             padding: 20,
//             borderRadius: 10,
//             alignItems: 'center',
//             justifyContent: 'center',
//         },
//         modalOption: {
//             paddingVertical: 15,
//             width: '100%',
//             alignItems: 'center',
//         },
//         modalText: {
//             fontSize: 18,
//             fontWeight: 'bold',
//             color: '#2193b0',
//         },
//         modalCancel: {
//             marginTop: 10,
//             paddingVertical: 10,
//             width: '100%',
//             alignItems: 'center',
//             borderTopWidth: 1,
//             borderTopColor: '#ddd',
//         },
//         modalCancelText: {
//             fontSize: 16,
//             color: '#777',
//         }
// });

// export default ProfileScreenModern;





import React, { useState, useEffect } from 'react';
import { 
  View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Dimensions, ScrollView ,Alert 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import ModalComponent from 'react-native-modal';
import { getAuth } from 'firebase/auth';
import { firebase} from '../firebaseConfig'; // Assure-toi que firebase est configuré
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';  // Assure-toi d'importer 'db' de firebaseConfig


// Dimensions pour adapter la grille
const { width } = Dimensions.get('window');
const cardSize = (width - 60) / 2; // 2 colonnes avec marge

const ProfileScreenModern = () => {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [userData, setUserData] = useState(null);

  // Fonction pour récupérer les données de Firebase
  const fetchUserData = async () => {
    const user = getAuth().currentUser;
    if (user) {
      const userId = user.uid;
  
      // setLoading(true);
  
      try {
        // Récupérer les données de la collection 'users'
        const userDocRef = doc(db, 'users', userId);
        // const userDocRef = doc(db, 'users', "11");
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          console.log(userDoc);
          const userData = userDoc.data();
          console.log(userData);
          setUserData(userData);
        } else {
          Alert.alert('Erreur', 'Utilisateur non trouvé dans la base de données.');
          console.log('Erreur', 'Utilisateur non trouvé');
        }
        // Alert.alert( userData + "" );
        // return
        // Récupérer les données de la collection 'info_user'
        const infoUserId = userData.id_info_user; // ID de `info_user` récupéré depuis `users`

        // Récupérer les informations détaillées de l'utilisateur dans 'info_user'
        const infoUserDocRef = doc(db, 'info_user', infoUserId);
        const infoUserDoc = await getDoc(infoUserDocRef);

        if (infoUserDoc.exists()) {
          const infoUserData = infoUserDoc.data();
          setUserInfo(infoUserData);
        } else {
          Alert.alert('Erreur', 'Informations utilisateur non trouvées.');
        }

      } catch (error) {
        console.error('Erreur de récupération des données utilisateur:', error);
        Alert.alert('Erreur', 'Une erreur s\'est produite lors de la récupération des données.' + error.message );
      } finally {
        // setLoading(false);
      }
    } else {
      Alert.alert('Erreur', 'Utilisateur non authentifié.');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

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
        <Image source={{ uri: item.logoUrl }} style={styles.cryptoLogo} />
        <Text style={styles.cryptoName}>{item.name}</Text>
        <Text style={styles.cryptoSymbol}>{item.symbol}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  if (!userInfo || !userData) {
    return <Text>Chargement...</Text>; // Afficher un message de chargement pendant la récupération des données
  }

  return (
    <ScrollView style={styles.container}>
      {/* En-tête avec photo et infos utilisateur */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleModal}>
          <Image source={require('../assets/icon.png')} style={styles.profilePicture} />
        </TouchableOpacity>
        {/* <Text style={styles.userName}>{userDetails.nom} {userDetails.prenom}</Text> */}
        <Text style={styles.userEmail}>{userInfo.email}</Text>
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
        <Text style={styles.balanceAmount}>${userInfo.balance.toFixed(2)}</Text>
      </View>

      {/* Historique des transactions */}
      <Text style={styles.sectionTitle}>Historique des transactions</Text>
      {userInfo.transactions.map((tx) => (
        <View key={tx.id} style={styles.transactionItem}>
          <Text style={styles.transactionText}>
            {tx.type} {tx.amount} {tx.crypto}
          </Text>
          <Text style={styles.transactionDate}>{tx.date}</Text>
        </View>
      ))}

      {/* Cryptos favorites */}
      <Text style={styles.sectionTitle}>Cryptos Favorites</Text>
      <FlatList
        data={userInfo.favoriteCryptos}
        renderItem={renderCryptoItem}
        keyExtractor={(item) => item.id}
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
  transactionItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  transactionText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionDate: {
    fontSize: 14,
    color: '#777',
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
