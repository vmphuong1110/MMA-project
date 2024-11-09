import { View, Text, FlatList, Dimensions, StyleSheet, Image, Alert, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../Components/Header';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Carousel from 'react-native-reanimated-carousel';
import { colors } from '../constants';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { ShoppingCartIcon } from 'react-native-heroicons/outline';
import Loader from '../Components/Loader';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/orebiSlices';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'react-native-axios';
import { Picker } from '@react-native-picker/picker';

const { height, width } = Dimensions.get('window');
const bannerOne = require('../../assets/images/banner1.png');
const bannerTwo = require('../../assets/images/banner2.png');
const bannerThree = require('../../assets/images/banner3.png');

const Home = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchProducts = async () => {
        setIsLoading(true);
        try {
          const response = await axios.get('http://10.33.45.86:9999/product/list', {
            params: {
              brand: selectedBrand || undefined,
              name: debouncedSearchTerm || undefined,
            },
          });
          setProducts(response.data);
        } catch (error) {
          console.error("Error fetching products:", error);
        } finally {
          setIsLoading(false);
        }
      };

      const fetchBrands = async () => {
        try {
          const response = await axios.get('http://10.33.45.86:9999/product/brands');
          setBrands(["All Brands", ...response.data]);
        } catch (error) {
          console.error("Error fetching brands:", error);
        }
      };

      const checkLoginStatus = async () => {
        const token = await AsyncStorage.getItem('authToken');
        setIsLoggedIn(!!token);
      };

      fetchProducts();
      fetchBrands();
      checkLoginStatus();
    }, [selectedBrand, debouncedSearchTerm])
  );

  const handleBrandChange = (brand) => {
    setSelectedBrand(brand === "All Brands" ? "" : brand);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      setIsLoggedIn(false);
      Alert.alert("Logout Success", "You have been logged out.");
      navigation.navigate('Login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const images = [bannerOne, bannerTwo, bannerThree];

  const RenderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.productView}
      onPress={() => navigation.navigate('ProductDetails', { productId: item._id })}
    >
      <Image 
        source={{ uri: item.image }} 
        style={styles.img} 
      />
      <View style={styles.textView}>
        <Text style={styles.productName}>{item.name}</Text>
        <View style={styles.priceCartContainer}>
          <Text style={styles.price}>${item.price}</Text>
          <TouchableOpacity
            onPress={() => {
              dispatch(addToCart({ productId: item._id, name: item.name, price: item.price, image: item.image, quantity: 1 }));
              Toast.show({
                type: 'success',
                text1: `${item.name} added to cart successfully`,
              });
            }}
            style={styles.cartButton}
          >
            <ShoppingCartIcon size={20} color={colors.textBlack} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />

      <View style={{ flex: 1 }}>
        {isLoading ? (
          <Loader title="Product is Loading..." />
        ) : (
          <FlatList
            data={products}
            contentContainerStyle={styles.container}
            keyExtractor={(item, index) => item._id ? item._id.toString() : index.toString()}
            renderItem={RenderItem}
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              setTimeout(() => setRefreshing(false), 2000);
            }}
            numColumns={2}
            ListHeaderComponent={
              <View>
                <Carousel
                  loop
                  width={width}
                  style={styles.carouselContainer}
                  autoPlay={true}
                  data={images}
                  scrollAnimationDuration={1000}
                  renderItem={({ item }) => (
                    <View>
                      <Image source={item} style={styles.carouselImage} />
                    </View>
                  )}
                />

                {/* Search and Brand Filter */}
                <View style={styles.filterContainer}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                  />
                  <View style={styles.dropdownContainer}>
                    <Picker
                      selectedValue={selectedBrand === "" ? "All Brands" : selectedBrand}
                      onValueChange={handleBrandChange}
                      style={styles.dropdown}
                      mode="dropdown"
                    >
                      {brands.map((brand) => (
                        <Picker.Item key={brand} label={brand} value={brand} />
                      ))}
                    </Picker>
                  </View>
                </View>

                {/* Nếu không có sản phẩm, hiển thị thông báo */}
                {products.length === 0 && (
                  <View style={styles.noProductsContainer}>
                    <Text style={styles.noProductsText}>Không tìm thấy sản phẩm nào</Text>
                  </View>
                )}
              </View>
            }
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingBottom: 200
  },
  noProductsContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  noProductsText: {
    fontSize: 18,
    color: colors.lightText,
  },
  carouselContainer: {
    height: 210,
    marginBottom: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: colors.lightText,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
    backgroundColor: '#f8f8f8',
  },
  dropdownContainer: {
    width: 150,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    overflow: 'hidden',
  },
  dropdown: {
    height: 40,
  },
  productView: {
    width: 220,
    height: height / 3,
    borderWidth: 0.5,
    borderColor: colors.lightText,
    margin: 5,
    marginHorizontal: 10,
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'space-between',
  },
  img: {
    width: '95%',
    height: '70%',
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  textView: {
    padding: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textBlack,
  },
  priceCartContainer: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  price: {
    fontWeight: '700',
    color: colors.textBlack,
    fontSize: 12,
  },
  cartButton: {
    backgroundColor: colors.designColor,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 6,
  },
  carouselImage: {
    width: '100%',
    height: 210,
    resizeMode: 'cover',
  },
});

export default Home;
