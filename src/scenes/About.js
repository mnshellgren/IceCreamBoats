import React, { Component } from 'react';
import * as firebase from 'firebase';
import MapView from 'react-native-maps';
import Communications from 'react-native-communications';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TouchableHighlight
} from 'react-native';
import styles from '../style/about'
import gstyles from '../style/styles'

export default class About extends Component {

  constructor(props) {
    super(props);
    this.state = {
      AboutTitle: 'Om oss',
      AboutText: 'FreshCoast är ett företag som bla bla bla bla bla bla bla bla',
      ContactUsTitle: 'Kontakta oss',
      ContactUsText: 'Ifall ni vill konakta oss kan ni ringa oss på..',
    }
  }

  componentWillMount() {
    this.loadAboutText()
    //TODO: fixa checkbox, fixa lifecycle varningar
  }

  loadAboutText() {
    firebase.database().ref('about').on('value',
    (snapshot) => {
      this.setState({
        aboutText: snapshot.exportVal().about
      })
    })
  }

  render() {
    return (
      <View>
        <Image source={{uri: 'https://facebook.github.io/react/img/logo_og.png'}}
          style={styles.headerImage} />

        <Text style={styles.baseText}>
          {'\n'}{'\n'}
          <Text style={styles.titleText}>
            {this.state.AboutTitle}
          </Text>
          {'\n'}{'\n'}
          <Text style={styles.baseText}>
            {this.state.aboutText}
          </Text>
          {'\n'}{'\n'}
          <Text style={styles.titleText}>
            {this.state.ContactUsTitle}
          </Text>
          {'\n'}{'\n'}
          <Text style={styles.baseText}>
            {this.state.ContactUsText}
          </Text>
        </Text>

        <TouchableOpacity onPress={() => Communications.phonecall('0123456789', true)}>
          <View >
            <Text>Tryck här för att ringa (infoga bild på telefon)</Text>
          </View>
        </TouchableOpacity>

        <TouchableHighlight
          onPress={() => this.props.openAdmin()}>
        <Text>Admin(förmodligen inte för dig)</Text>
        </TouchableHighlight>

      </View>
    )
  }
}

