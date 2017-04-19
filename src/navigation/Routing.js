import React, { Component } from 'react';
import Menu from '../scenes/Menu';
import About from '../scenes/About';
import Admin from '../scenes/Admin';
import {
  View,
  Text,
  Navigator,
  TouchableHighlight,
  StyleSheet,
  BackAndroid,
  Dimensions,
  Image
} from 'react-native';
import MapScene from '../scenes/MapScene';
import styles from '../style/routing'
import CustomTransition from './CustomTransition';
import Tabs from 'react-native-tabs';

const INDEX = {
  ABOUT: 0,
  MAP: 1,
  MENU: 2,
  ADMIN: 3
}

function NavButton(props) {
  return (
    <TouchableHighlight
      style={styles.NavButton}
      onPress={() => {
        if (props.index === INDEX.MAP && props.route.index !== INDEX.MAP) {
          props.navigator.popToTop();
          return;
        }

        if (props.route.index !== props.index) {
          if (props.navigator.getCurrentRoutes().length > 1) {
            props.navigator.replace(props.routes[props.index]);
          } else {
            props.navigator.push(props.routes[props.index]);
          }
        }
      }}>
      <View style={styles.iconview}>
        <Image source={props.routes[props.index].source} style={styles.icon} />
        <Text style={styles.iconText}>{props.routes[props.index].title}</Text>
      </View>
    </TouchableHighlight>
  );
}
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class Routing extends Component {

  constructor(props) {
    super(props);
    this.openAdmin = this.openAdmin.bind(this);
    this.saveRegion = this.saveRegion.bind(this);

    this.state = {
      page:'Karta',
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
    };
    this.routes = {
      Info: {scene: <About openAdmin={this.openAdmin} />, title: 'Info',  
        index: INDEX.ABOUT, 
        iconSelected: 
          require('../../assets/tabbar/infoSelected/infoSelected.png'), 
        icon: require('../../assets/tabbar/info/info.png')},
      Karta: {scene: <MapScene 
                      region={this.state.region} 
                      saveRegion={(p) => this.saveRegion(p)} />, 
        title: 'Karta', 
        index: INDEX.MAP, 
        iconSelected: 
          require('../../assets/tabbar/mapSelected/mapSelected.png'), 
        icon: require('../../assets/tabbar/map/map.png')},
      Utbud: {scene: <Menu />,     title: 'Utbud',   index: INDEX.MENU, 
        iconSelected: 
          require('../../assets/tabbar/menuSelected/menuSelected.png'), 
        icon: require('../../assets/tabbar/menu/menu.png')},
      Admin: {scene: <Admin />,    title: 'Admin',   index: INDEX.ADMIN, 
       iconSelected: 
         require('../../assets/tabbar/infoSelected/infoSelected.png'), 
       icon: require('../../assets/tabbar/info/info.png')},
    };

    this.setAndroidBackPressButton();
  }  

  saveRegion(newRegion) {
    this.setState({
      region: newRegion
    })
  }

  setAndroidBackPressButton() {
    BackAndroid.addEventListener('hardwareBackPress', () => {
      if (this.state.page !== 'Karta') {
        this.setState({page: 'Karta'})
        return true;
      }
      return false;
    });
  }


  openAdmin() {
    this.setState({page: 'Admin'})
  }

  render() {
    return (
      <View style={styles.Routing}>
        {<View style={styles.Scene}>{this.routes[this.state.page].scene}</View>}
        <Tabs selected={this.state.page} 
              style={styles.Routing}
              selectedStyle={{selected: true}} 
              onSelect={el=>this.setState({page:el.props.name})}>
              {Object.keys(this.routes).map((name, index) => 
                <TabButton 
                  name={this.routes[name].title} 
                  key={this.routes[name].title} 
                  route={this.routes[name]} 
                  styles={styles}
                />)
              }
        </Tabs>
      </View>
    );

  }

}

function TabButton (props) {
  if (props.style && props.style[1].selected) {
    return (
        <View>
          <Image
            style={styles.icon}
            source={props.route.iconSelected}
          />
          <Text style={styles.iconTextSelected}>{props.route.title}</Text>
        </View>
    );
  } else {
    return (
        <View>
          <Image
            style={styles.icon}
            source={props.route.icon}
          />
          <Text style={styles.iconText}>{props.route.title}</Text>
        </View>
    );
  }
}

