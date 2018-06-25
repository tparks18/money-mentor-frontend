import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import PlaidAuthenticator from 'react-native-plaid-link';
import { connect } from 'react-redux';
import { Button } from 'react-native-elements';

import { sendToken } from '../store/token';

class Link extends React.Component {
  state = {
    data: {},
    status: 'LOGIN_BUTTON',
  };

  render() {
    switch (this.state.status) {
      case 'CONNECTED':
        return this.renderDetails();
      case 'LOGIN_BUTTON':
      case 'EXIT':
        return this.renderButton();
      default:
        return this.renderLogin();
    }
  }

  renderButton = () => {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => this.setState({ status: '' })}>
          <Image
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
            source={require('../../public/img/logo.png')}
          />
          <Text style={styles.text}>Login with Plaid</Text>
        </TouchableOpacity>
      </View>
    );
  };

  renderLogin() {
    return (
      <PlaidAuthenticator
        onMessage={this.onMessage}
        publicKey="bc8a1ae90c8899639cdfd58c69af10"
        env="sandbox"
        product="auth,transactions"
        clientName="MoneyMentor"
      />
    );
  }

  renderDetails() {
    this.props.dispatchedSendToken(this.state.data.metadata.public_token);

    return (
      <View style={styles.container}>
        <Image
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
          source={require('../../public/img/logo.png')}
        />
        <Text style={styles.text}>Next Step: Take Our Quiz</Text>
        <Button
          raised
          buttonStyle={{ backgroundColor: '#92B1BD', borderRadius: 10 }}
          textStyle={{ textAlign: 'center' }}
          title={`Let's get started!`}
          onPress={() =>
            this.props.navigation.navigate('Quiz', { title: 'Quiz' })
          }
        >
          Let's get started!
        </Button>
      </View>
    );
  }

  onMessage = data => {
    this.setState({
      data,
      status: data.action
        .substr(data.action.lastIndexOf(':') + 1)
        .toUpperCase(),
    });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 24,
    backgroundColor: '#C2D3DA',
  },
  text: {
    alignSelf: 'center',
    color: '#585A56',
    fontWeight: 'bold',
    fontSize: 20,
  },
  value: {
    marginBottom: 20,
    textAlign: 'center',
  },
});

const mapDispatch = dispatch => {
  return {
    dispatchedSendToken: token => dispatch(sendToken(token)),
  };
};

export default connect(
  null,
  mapDispatch
)(Link);
