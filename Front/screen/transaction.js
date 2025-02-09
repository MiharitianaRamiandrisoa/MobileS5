import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert 
} from 'react-native';

import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, setDoc, doc, deleteDoc } from 'firebase/firestore';
const transaction = () => {
  const [amount, setAmount] = useState('');
  const [transactionType, setTransactionType] = useState('depot');

  const handleSubmit = () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      Alert.alert('Erreur', 'Veuillez entrer un montant valide.');
      return;
    }

    Alert.alert(
      'Confirmation',
      `Vous souhaitez ${transactionType === 'depot' ? 'déposer' : 'retirer'} $${amount}?`,
      [{ text: 'Annuler', style: 'cancel' }, { text: 'Confirmer', onPress: () => sendTransaction() }]
    );

    // sendTransaction();
  };

  const sendTransaction = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (!user) {
      Alert.alert('Erreur', "Aucun utilisateur connecté.");
      return;
    }
  
    const id_users = user.uid;
    const dateTransaction = new Date();
    const db = getFirestore();
    const transactionRef = collection(db, 'transactions');
  
    try {
      // Récupérer le dernier ID
      const querySnapshot = await getDocs(transactionRef);
      let lastId = 0;
  
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.id_transaction && !isNaN(data.id_transaction) && data.id_transaction > lastId) {
          console.log("Dernier id_transaction trouvé :", data.id_transaction);
          lastId = data.id_transaction;
        }
      });
  
      const newId = lastId ? parseInt(lastId) + 1 : 1; // Si aucune transaction n'existe, commencer par 1
  
      const transactionData = {
        id_transaction: newId,
        date_transaction: dateTransaction,
        id_type_transaction: transactionType === 'depot' ? 1 : 2,
        id_users: parseInt(id_users),
        montant: amount.toString(),
        valide: false,
      };
  
      // Insérer la transaction avec un ID de document généré automatiquement
      await setDoc(doc(db, 'transactions', newId.toString()), transactionData);
  
      Alert.alert('Succès', `Votre demande de ${transactionType === 'depot' ? 'dépôt' : 'retrait'} de $${amount} a été envoyée.`);
      setAmount(''); // Réinitialiser le montant après l'envoi
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue. Veuillez réessayer.');
      console.error(error);
    }
  };
  
  
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Demande de Dépôt/Retrait</Text>

      <View style={styles.switchContainer}>
        <TouchableOpacity
          style={[styles.switchButton, transactionType === 'depot' && styles.activeButton]}
          onPress={() => setTransactionType('depot')}
        >
          <Text style={[styles.switchText, transactionType === 'depot' && styles.activeText]}>Dépôt</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.switchButton, transactionType === 'retrait' && styles.activeButton]}
          onPress={() => setTransactionType('retrait')}
        >
          <Text style={[styles.switchText, transactionType === 'retrait' && styles.activeText]}>Retrait</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Montant en $"
        value={amount}
        onChangeText={setAmount}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>
          {transactionType === 'depot' ? 'Déposer' : 'Retirer'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    padding: 20,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  switchButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#ddd',
    marginHorizontal: 10,
  },
  activeButton: {
    backgroundColor: '#2193b0',
  },
  switchText: {
    fontSize: 18,
    color: '#555',
  },
  activeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#2193b0',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default transaction;
