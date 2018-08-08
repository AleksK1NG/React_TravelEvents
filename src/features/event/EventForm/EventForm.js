/* global google*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withFirestore } from 'react-redux-firebase';
import { reduxForm, Field } from 'redux-form';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import Script from 'react-load-script';
import { composeValidators, combineValidators, isRequired, hasLengthGreaterThan } from 'revalidate';
import { Segment, Form, Button, Grid, Header } from 'semantic-ui-react';
import { cancelToggle, createEvent, updateEvent } from '../eventActions';
import TextInput from '../../../app/common/form/TextInput';
import TextArea from '../../../app/common/form/TextArea';
import SelectInput from '../../../app/common/form/SelectInput';
import DateInput from '../../../app/common/form/DateInput';
import PlaceInput from '../../../app/common/form/PlaceInput';


const category = [
  {key: 'drinks', text: 'Drinks', value: 'drinks'},
  {key: 'culture', text: 'Culture', value: 'culture'},
  {key: 'film', text: 'Film', value: 'film'},
  {key: 'food', text: 'Food', value: 'food'},
  {key: 'music', text: 'Music', value: 'music'},
  {key: 'travel', text: 'Travel', value: 'travel'},
];


const validate = combineValidators({
  title: isRequired({message: 'Event title is required'}),
  category: isRequired({message: 'Please chose category'}),
  description: composeValidators(
    isRequired({message: 'Please enter description'}),
    hasLengthGreaterThan(4)({message: 'Description minimal length is 5 characters'})
  )(),
  city: isRequired('city'),
  venue: isRequired('venue'),
  date: isRequired('date')
});

class EventForm extends Component {

  state = {
    cityLatLng: {},
    venueLatLng: {},
    scriptLoaded: false
  };

  async componentDidMount() {
    const { firestore, match } = this.props;
    await firestore.setListener(`events/${match.params.id}`);
  }

  async componentWillUnmount() {
    const { firestore, match } = this.props;
    await firestore.unsetListener(`events/${match.params.id}`);
  }


  handleScriptLoaded = () => {
    this.setState({scriptLoaded: true});
  };

  handleCitySelect = (selectedCity) => {
    geocodeByAddress(selectedCity)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        this.setState({cityLatLng: latLng});
      })
      .then(() => {this.props.change('city', selectedCity)})
  };

  handleVenueSelect = (selectedVenue) => {
    geocodeByAddress(selectedVenue)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        this.setState({venueLatLng: latLng});
      })
      .then(() => {this.props.change('venue', selectedVenue)})
  };

  onFormSubmit = async (values) => {
    values.venueLatLng = this.state.venueLatLng;
    if (this.props.initialValues.id) {
      if (Object.keys(values.venueLatLng).length === 0) {
        values.venueLatLng = this.props.event.venueLatLng
      }
      await this.props.updateEvent(values);
      this.props.history.goBack();
    } else {

      this.props.createEvent(values);
      this.props.history.push('/events');
    }
  };


  render() {
    const { invalid, submitting, pristine, event, cancelToggle, loading } = this.props;

    return (
      <Grid>
        <Script
          url='https://maps.googleapis.com/maps/api/js?key=AIzaSyCErw94uRgpKBDdPu-deFitgZClfaAmjRc&libraries=places'
          onLoad={this.handleScriptLoaded}
        />
        <Grid.Column width={10}>
          <Segment>
            <Header sub color="teal" content="Event details" />
            <Form onSubmit={this.props.handleSubmit(this.onFormSubmit)}>
              <Field
                name="title"
                type="text"
                component={TextInput}
                placeholder="Event name" />
              <Field
                name="category"
                type="text"
                component={SelectInput}
                options={category}
                placeholder="Event category"/>
              <Field
                name="description"
                type="text"
                component={TextArea}
                placeholder="Event description"
                rows={3}/>
              <Header sub color="teal" content="event location details"  />
              <Field
                name="city"
                type="text"
                component={PlaceInput}
                options={{types: ['(cities)']}}
                onSelect={this.handleCitySelect}
                placeholder="City" />
              {this.state.scriptLoaded &&
              <Field
                name="venue"
                type="text"
                options={{
                  location: new google.maps.LatLng(this.state.cityLatLng),
                  radius: 1000,
                  types: ['establishment']
                }}
                component={PlaceInput}
                onSelect={this.handleVenueSelect}
                placeholder="Event venue" />}
              <Field
                name="date"
                type="text"
                component={DateInput}
                dateFormat="YYYY-MM-DD HH:mm"
                timeFormat="HH:mm"
                showTimeSelect
                placeholder="Date and time" />
              <Button loading={loading}  disabled={invalid || submitting || pristine}  positive type="submit">
                Submit
              </Button>
              <Button disabled={loading}  type="button" onClick={this.props.history.goBack}>Cancel</Button>
              {event.id &&
              <Button
                onClick={() => cancelToggle(!event.cancelled, event.id)}
                type='button'
                color={event.cancelled ? 'green' : 'red'}
                floated='right'
                content={event.cancelled ? 'Reactivate Event' : 'Cancel Event'}
              />}
            </Form>
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => {

  let event = {};

  if (state.firestore.ordered.events && state.firestore.ordered.events[0]) {
    event = state.firestore.ordered.events[0];
  }

  return {
    initialValues: event,
    event: event,
    loading: state.async.loading
  }
};


// export default connect(mapStateToProps, { createEvent, updateEvent })(reduxForm({form: 'eventForm', enableReinitialize: true, validate})(EventForm));

export default withFirestore(connect(mapStateToProps, { createEvent, updateEvent, cancelToggle })(reduxForm({form: 'eventForm', enableReinitialize: true, validate})(EventForm)));