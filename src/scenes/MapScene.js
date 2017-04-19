import React, { Component, PropTypes } from 'react';
import MapView from 'react-native-maps';
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  Animated,
  PanResponder,
  Button,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import * as firebase from 'firebase';
import SlideDownView from '../components/SlideDownView';

import {generate} from '../utils/randomstring';
import * as location from '../utils/location';
import styles from '../style/mapscene'
import gstyles from '../style/styles'


class Overlay extends Component {

  constructor(props) {
    super(props);

    this.state = {id:''};

    this.sendPosition.bind(this);
  }

  sendPosition() {
    // to be implemented
    var id;
    var time = new Date().getTime();

    if (this.state.id === '') {
      id = generate(32);
      this.setState({id: id});
    } else {
      id = this.state.id;
    }

    location.getUserLocation().then((position) => {
        location.uploadUserLocation(id, position.coords.latitude, position.coords.longitude, time);
    }).catch((error) => {
        alert(JSON.stringify(error));
    });
  }

  render() {
    return (
      <SlideDownView style={styles.overlay}
        handlerOpacity={1}
        containerBackgroundColor={'#F5BB94'}
        containerMinimumHeight={20}
        containerMaximumHeight={190}
        handlerHeight={160}
        initialHeight={190}
        handlerDefaultView={
          <Button style={styles.notificationButton}
            onPress={this.sendPosition.bind(this)}
            title="Jag vill ha glass"
            accessibilityLabel="Nu kommer vi"
          />
        } />
    );
  }
}

let id = 0;

export default class MapScene extends Component {

  constructor(props) {
    super(props);
    console.log(this.state)
    this.state = {
      boats: {},
      markers: [],
    };
    this.updateBoats.bind(this);
  }

  onMapPress(e) {
  this.setState({
    markers: [
      ...this.state.markers,
      {
        coordinate: e.nativeEvent.coordinate,
        key: id++,
      },
    ],
  });
}

  componentWillMount() {
    /*
     *this.setState({
     *  region: {
     *    latitude: 0,
     *    longitude: 0,
     *  }
     *})
     */
    firebase.database().ref('boats').on('value', this.updateBoats.bind(this));
  }

  componentWillUnmount() {
   firebase.database().ref('boats').off('value', this.updateBoats.bind(this));
  }

  updateBoats(snapshot) {
    var boats = snapshot.exportVal();
    if (boats === null) {
      this.setState({boats: {}});
    } else {
      this.setState({boats: boats});
    }
  }
  onRegionChangeComplete = (newRegion) => {
    this.props.saveRegion(newRegion)
  }

  render() {
    return (
      <View style={styles.MapScene} >

        <MapView
          provider={this.props.provider}
          style={styles.map}
          region={this.props.region}
          onPress={(e) => this.onMapPress(e)}
          onRegionChangeComplete={(e) => this.onRegionChangeComplete(e)}
        >
          {this.state.markers.map(marker => (
            <MapView.Marker
              draggable
              key={marker.key}
              coordinate={marker.coordinate} />
            
          ))}
        </MapView>


        {/*<Overlay />*/}

      </View>
    );
  }
}
MapScene.propTypes = {
  saveRegion: PropTypes.func.isRequired,
  region: PropTypes.object.isRequired

}

function toLatLang(object) {
  return {
    latitude: object.latitude,
    longitude: object.longitude,
  };
}
