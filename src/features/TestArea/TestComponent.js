import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';
import Script from 'react-load-script';
import { incrementCounter, decrementCounter, incrementAsync, decrementAsync } from './testActions';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { openModal } from '../modals/modalActions';


class TestComponent extends Component {

  static defaultProps = {
    center: {
      lat: 59.95,
      lng: 30.33
    },
    zoom: 11
  };


  state = {
    address: '',
    scriptLoaded: false
  };

  handleScriptLoad = () => {
    this.setState({scriptLoaded: true});
  };

  handleFormSubmit = (event) => {
    event.preventDefault();

    geocodeByAddress(this.state.address)
      .then(results => getLatLng(results[0]))
      .then(latLng => console.log('Success', latLng))
      .catch(error => console.error('Error', error))
  };

  onChange = (address) => {
    this.setState({address});
  };


  render() {
    const { incrementCounter, decrementCounter, data, openModal, incrementAsync, decrementAsync, loading } = this.props;
    const inputProps = {
      value: this.state.address,
      onChange: this.onChange,
    };

    return (
      <div>
        <Script
          url='https://maps.googleapis.com/maps/api/js?key=AIzaSyCErw94uRgpKBDdPu-deFitgZClfaAmjRc&libraries=places'
          onLoad={this.handleScriptLoad}
        />
        <h1>Test Area</h1>
        <h4>Answer is : {data}</h4>
        <Button onClick={() => incrementCounter(1)} color='green' content='Increment'/>
        <Button onClick={() => decrementCounter(1)} color='red' content='Decrement'/>
        <Button onClick={() => incrementAsync(1)} color='green' content='IncrementAsync' loading={loading}/>
        <Button onClick={() => decrementAsync(1)} color='red' content='DecrementAsync' loading={loading} />
        <Button onClick={() => openModal('TestModal', {data: 1257})} color='teal' content='Open Modal'/>
        <br/>
        <form onSubmit={this.handleFormSubmit}>
          {this.state.scriptLoaded && <PlacesAutocomplete inputProps={inputProps} />}
          <button type="submit">Submit</button>
        </form>

      </div>
    );
  }
}

 const mapStateToProps = state => ({
   data: state.test.data,
   loading: state.test.loading
 });

// const mapDispatchToProps = (dispatch) => ({
//   plusCount: (payload) => dispatch(incrementCounter(payload)),
//   minusCount: (payload) => dispatch(decrementCounter(payload))
// });


const mapDispatchToProps = {
  incrementCounter,
  decrementCounter,
  openModal,
  incrementAsync,
  decrementAsync
};

export default connect(mapStateToProps, mapDispatchToProps)(TestComponent);