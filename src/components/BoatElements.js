import React, { Component } from 'react';
import * as firebase from 'firebase';
import * as location from '../utils/location' //TODO: funkar ej att importera
import {
  Text,
  View,
  Image,
  Button,
  TextInput
} from 'react-native';
import styles from '../style/components/boatelement'
import gstyles from '../style/styles'

export default class BoatElements extends Component {

  constructor(props) {
    super(props)
    this.state = {
      boats: {},
      aboutText: ''
    }
    this.updateBoats.bind(this)
  }

  componentWillMount() {
    firebase.database().ref('boats').on('value', this.updateBoats.bind(this));
  }

  componentWillUnmount() {
   firebase.database().ref('boats').off('value', this.updateBoats.bind(this));
  }

  updateBoats(snapshot) {
    this.setState({boats: snapshot.exportVal()})
  }

  setBoat(boatName) {
    this.props.setBoat(boatName)

    firebase.database().ref('boats/' + boatName).update({
      owner: firebase.auth().currentUser.email,
    }).then(() => {
      this.setModalVisible(false)
    }, (error) => {
      console.log('error', error);
    })
  }

  renderBoats() {
    let boats = this.state.boats
    let elements = []

    for (var boat in boats) {
      let name = boats[boat].boatName

      elements.push(
        <View key={name} style={styles.rowElements}>
          <Text style={styles.nameColor}>{name} </Text>
          <Text onPress={this.setPosition.bind(this)}>Karta(bild) </Text>
          <Text>Penna(bild) </Text>
          <Text onPress={this.setBoat.bind(this, name)}>Välj båt(bild) </Text>
          <Text onPress={this.removeBoat.bind(this, name)}>Ta bort(bild) </Text>
        </View>
      )
    }

    return elements
  }

  setPosition() {


  }

  removeBoat(name) {
    firebase.database().ref('boats/'+name).remove()
  }

  render() {
    return (
      <View>
        <Text>Båtar</Text>
        {this.renderBoats()}
      </View>
    )
  }
}
