import React, { Component } from "react";
import { StyleSheet, View, Image, PanResponder, Animated, } from "react-native";

class Draggable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDraggable: true,
      dropAreaValues: null,
      pan: new Animated.ValueXY(),
      opacity: new Animated.Value(1)
    };
  }

  componentWillMount() {
    this._val = { x:0, y:0 }
    this.state.pan.addListener((value) => this._val = value);

    this.panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (e, gesture) => true,
        onPanResponderGrant: (e, gesture) => {
          this.state.pan.setOffset({
            x: this._val.x,
            y:this._val.y
          })
          this.state.pan.setValue({ x:0, y:0})
        },
        onPanResponderMove: Animated.event([ 
          null, { dx: this.state.pan.x, dy: this.state.pan.y }
        ]),
        onPanResponderRelease: (e, gesture) => {
          if (this.isDropArea(gesture)) {
            Animated.timing(this.state.opacity, {
              toValue: 0,
              duration: 400,
            }).start(() =>
              this.setState({
                showDraggable: false
              })
            );
          } 
        }
      });
  }

  isDropArea(gesture) {
    return gesture.moveY < 100;
  }

  render() {
    return (
      <View style={{ width: "100%", alignItems: "center" }}>
        {this.renderDraggable()}
      </View>
    );
  }

  renderDraggable() {
    const panStyle = {
      transform: this.state.pan.getTranslateTransform()
    }
    if (this.state.showDraggable) {
      return (
        <View style={{ position: "absolute" }}>
          <Animated.View
            {...this.panResponder.panHandlers}
            style={[panStyle, styles.circle, {opacity:this.state.opacity}]}
          />
        </View>
      );
    }
  }
}


export default class App extends Component {
  render() {
    return (
      <View style={styles.mainContainer}>
        <View style={{alignItems: 'center', justifyContent: 'center', backgroundColor: 'red', width: '100%', height: 150}}>
          <Image 
            source={require('./assets/images/recycle.png')}
            style={{width: 130, height: 130, tintColor: '#fff'}}>
          </Image>
        </View>

        <View style={styles.ballContainer} />
        <View style={styles.row}>
          <Draggable />
        </View>
      </View>
    );
  }
}

let CIRCLE_RADIUS = 60;
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#141414',
  },
  ballContainer: {
    height: 300
  },
  circle: {
    borderWidth: 7,
    borderColor: '#fff',
    backgroundColor: '#2980b9',
    width: CIRCLE_RADIUS * 2,
    height: CIRCLE_RADIUS * 2,
    borderRadius: CIRCLE_RADIUS
  },
  row: {
    flexDirection: "row",
  },  
  dropZone: {
    height: 200,
    backgroundColor: "#00334d"
  },
  text: {
    marginTop: 25,
    marginLeft: 5,
    marginRight: 5,
    textAlign: "center",
    color: "#fff",
    fontSize: 25,
    fontWeight: "bold"
  }
});