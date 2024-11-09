import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const Contact = () => {
  const navigation = useNavigation();

  const handleOpenFacebook = () => {
    Linking.openURL('https://www.facebook.com/yawnzz99');

  };

  const handleDialPhone = () => {
    Linking.openURL('tel:+18008098');
  };

  const handleSendEmail = () => {
    Linking.openURL('mailto:meap8063@gmail.com');
  };

  return (
    <ImageBackground
      source={require('../../assets/contact.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.backButtonText}>&lt;</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Contact Us</Text>

        <View style={styles.card}>
          <TouchableOpacity onPress={handleOpenFacebook} style={styles.link}>
            <Icon name="logo-facebook" size={24} color="#4267B2" style={styles.icon} />
            <Text style={styles.linkText}>Marine Lefevre</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleDialPhone} style={styles.link}>
            <Icon name="call-outline" size={24} color="#34B7F1" style={styles.icon} />
            <Text style={styles.linkText}>+18008098</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSendEmail} style={styles.link}>
            <Icon name="mail-outline" size={24} color="#EA4335" style={styles.icon} />
            <Text style={styles.linkText}>meap8063@gmail.com</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 28,
    color: 'black',
    marginBottom: 20,
    fontWeight: 'bold',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  card: {
    width: '90%',
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  icon: {
    marginRight: 15,
  },
  linkText: {
    fontSize: 18,
    color: '#333',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: '#FFFFFF99',
    borderRadius: 10,
    padding: 8,
},
backButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
},
});

export default Contact;
