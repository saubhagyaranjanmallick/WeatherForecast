import React, {useCallback, useState} from 'react';
import {
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';
import bg from '../assets/images/bg.png';
import {SafeAreaView} from 'react-native-safe-area-context';
import {debounce} from 'lodash';
import {fetchLocations, fetchWeatherForecast} from '../api/index';
import weatherImages from '../constants/index';

import {MagnifyingGlassIcon} from 'react-native-heroicons/outline';
import {MapPinIcon, CalendarDaysIcon} from 'react-native-heroicons/solid';
import partlycloudy from '../assets/images/partlycloudy.png';
import wind from '../assets/icons/wind.png';
import drop from '../assets/icons/drop.png';
import sun from '../assets/icons/sun.png';
import heavyrain from '../assets/images/heavyrain.png';



const HomeScreen = () => {
  const [showSearch, toggleSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weather,setWeather]= useState({});

  const handleLocation = loc => {
    console.log('loc', loc);
    toggleSearch(false);
    setLocations([]);
    fetchWeatherForecast({
      cityName: loc.name,
      days: '7'
    }).then(data=>{
      setLoading(false);
      setWeather(data);
      storeData('city',loc.name);
    })

  };

  const handleSearch = value => {
    if (value.length > 2) {
      fetchLocations({cityName: value}).then(data => {
        console.log('got locations' , data);
        setLocations(data);
      });
    }
  };
  const {current , location} = weather ;
  const handleTextDebounce = useCallback(debounce(handleSearch, 1000), []);

  // console.log(sampleLocations);
  return (
    <View style={{flex: 1}}>
      <StatusBar style="dark" />
      <Image
        source={bg}
        blurRadius={50}
        style={{position: 'absolute', height: '100%', width: '100%'}}
      />

      {loading ? (
        <View
          onChangeText={handleSearch}
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size="large" color="#EEEEEE" />
        </View>
      ) : (
        <SafeAreaView>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '95%',
              margin: 10,
              borderRadius: 10,
              overflow: 'hidden', // Ensure that children don't overflow
            }}>
            {/* First section - Search City */}
            <View
              style={{
                flex: showSearch ? 9 : 1,
                backgroundColor: showSearch ? '#ffffff60' : 'transparent',
                padding: showSearch ? 10 : 0,
              }}>
              {showSearch ? (
                <TextInput
                  style={{
                    flex: 1,
                    padding: 5,
                    fontSize: 18,
                    color: '#fff',
                  }}
                  placeholder="Search city"
                  placeholderTextColor="white"
                  onChangeText={handleTextDebounce}
                />
              ) : null}
            </View>

            {/* Second section - Search Icon */}
            <TouchableOpacity
              onPress={() => toggleSearch(!showSearch)}
              style={{
                flex: showSearch ? 1 : 0,
                backgroundColor: '#ffffff60',
                alignItems: 'flex-end',
                justifyContent: 'center',
                padding: showSearch ? 10 : 10,
                borderRadius: showSearch ? 0 : 50,
              }}>
              {showSearch ? (
                <View style={{alignSelf: 'flex-end'}}>
                  <MagnifyingGlassIcon width={30} height={30} color="white" />
                </View>
              ) : (
                <MagnifyingGlassIcon width={30} height={30} color="white" />
              )}
            </TouchableOpacity>
          </View>

          {locations.length > 0 && showSearch ? (
            <View
              style={{
                position: 'absolute',
                width: '95%',
                backgroundColor: '#EEEEEE',
                marginTop: 76,
                borderRadius: 10,
                margin: 10,
                padding: 5,
                alignSelf: 'center',
              }}>
              {locations.map((loc, index) => {
                let showBorder = index + 1 !== locations.length;
                let borderClass = showBorder
                  ? {borderBottomWidth: 1, borderBottomColor: 'gray'}
                  : {};

                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleLocation(loc)}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      border: 0,
                      padding: 6,
                      paddingLeft: 4,
                      marginBottom: 3,
                      ...borderClass,
                    }}>
                    <MapPinIcon size="20" color="grey" />
                    <Text style={{color: 'black', fontSize: 16, marginLeft: 5}}>
                      {loc?.name}, {loc?.country}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : null}

          <View>
            <Text
              style={{
                color: 'white',
                textAlign: 'center',
                fontSize: 26,
                fontWeight: 'bold',
                marginTop: 25,
              }}>
              {location?.name}&nbsp;
              <Text style={{fontSize: 18, color: '#BDBDBD'}}>
               {location?.country}
              </Text>
            </Text>
          </View>

          <View style={{alignSelf: 'center', justifyContent: 'center'}}>
            <Image
              // source={partlycloudy}
              source={ partlycloudy || {uri: 'https:'+current?.condition?.icon}} 
              style={{height: 190, width: 195, marginTop: 120}}
            />
          </View>

          <View style={{alignSelf: 'center', justifyContent: 'center'}}>
            <Text
              style={{
                color: 'white',
                marginTop: 30,
                fontWeight: 'bold',
                fontSize: 55,
                textAlign: 'center',
                color: '#EEEEEE',
              }}>
              {current?.temp_c}&#176;
            </Text>
            <Text
              style={{
                color: 'white',
                marginTop: 10,
                fontSize: 20,
                textAlign: 'center',
                color: '#BDBDBD',
                fontWeight: '400',
              }}>
              {current?.condition.text}
              {/* partly cloudy */}
            </Text>
          </View>

          {/* Wind, Humidity, and Sunrise */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              margin: 4,
              alignSelf: 'center',
              margin: 10,
              marginTop: 30,
            }}>
            {/* Wind */}
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                marginRight: 8,
                marginLeft: 20,
              }}>
              <Image
                source={wind}
                style={{width: 24, height: 24}}
                alt="Wind Icon"
              />
              <Text
                style={{
                  color: 'white',
                  fontWeight: '600',
                  fontSize: 14,
                  marginLeft: 4,
                }}>
               {current?.wind_kph}km
              </Text>
            </View>

            {/* Humidity */}
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignSelf: 'center',
                marginRight: 8,
                justifyContent: 'center',
              }}>
              <Image
                source={drop}
                style={{width: 24, height: 24}}
                alt="Drop Icon"
              />
              <Text
                style={{
                  color: 'white',
                  fontWeight: '600',
                  fontSize: 14,
                  marginLeft: 4,
                  textAlign: 'center',
                }}>
                {current?.humidity}%
              </Text>
            </View>

            {/* Sunrise */}
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                marginRight: 8,
              }}>
              <Image
               source={require('../assets/icons/sun.png')}
                style={{width: 24, height: 24}}
                alt="Sun Icon"
              />
              <Text
                style={{
                  color: 'white',
                  fontWeight: '600',
                  fontSize: 14,
                  marginLeft: 4,
                }}>
                { weather?.forecast?.forecastday[0]?.astro?.sunrise }
              </Text>
            </View>
          </View>

          {/* Forecast For Next Days */}
          <View style={{marginBottom: 5, marginTop: 15}}>
            <View style={{paddingLeft: 10, flexDirection: 'row'}}>
              <CalendarDaysIcon size="22" color="white" />
              <Text style={{color: 'white', fontSize: 16, paddingLeft: 5}}>
                Daily Forecast{' '}
              </Text>
            </View>

            <ScrollView
              horizontal
              contentContainerStyle={{paddingHorizontal: 10, paddingTop: 10}}
              showsHorizontalScrollIndicator={false}>
           {
                    weather?.forecast?.forecastday?.map((item,index)=>{
                      const date = new Date(item.date);
                      const options = { weekday: 'long' };
                      let dayName = date.toLocaleDateString('en-US', options);
                      dayName = dayName.split(',')[0];

                      return (
                        <View 
                          key={index} 
                          style={{
                            height: 90,
                            width: 90,
                            backgroundColor: '#ffffff30',
                            borderRadius: 20,
                            padding: 5,
                            justifyContent: 'center',
                            margin: 5,
                          }}>
                        
                          <Image 
                            // source={{uri: 'https:'+item?.day?.condition?.icon}}
                            source={heavyrain ||[item?.day?.condition?.text || 'other']}
                            style={{width: 34, height: 34, alignSelf: 'center'}} />
                          <Text  style={{color: 'white', textAlign: 'center'}}>{dayName}</Text>
                          <Text  style={{
                                  color: 'white',
                                  fontWeight: 'bold',
                                  textAlign: 'center',
                                  fontSize: 18,
                                }}>
                            {item?.day?.avgtemp_c}&#176;
                          </Text>
                        </View>
                      )
                    })
                  }
                  
             

              {/* <View
                style={{
                  height: 90,
                  width: 90,
                  backgroundColor: '#ffffff30',
                  borderRadius: 20,
                  padding: 5,
                  justifyContent: 'center',
                  margin: 5,
                }}>
                <Image
                  source={heavyrain}
                  style={{width: 34, height: 34, alignSelf: 'center'}}
                />
                <Text style={{color: 'white', textAlign: 'center'}}>
                  Monday
                </Text>
                <Text
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontSize: 18,
                  }}>
                  23&#176;
                </Text>
              </View> */}

             
            </ScrollView>
          </View>
        </SafeAreaView>
      )}
    </View>
  );
};
export default HomeScreen;
