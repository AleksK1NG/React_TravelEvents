import React, { Component } from 'react';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { getEventsForDashboard } from '../../event/eventActions';
import { Grid, Loader } from 'semantic-ui-react';
import EventList from "../EventList/EventList";
import LoadingComponent from '../../../app/layout/LoadingComponent';
import EventActivity from '../EventActivity/EventActivity';


class EventDashBoard extends Component {

  state = {
    moreEvents: false,
    loadingInitial: true,
    loadedEvents: [],
    contextRef: {}
  }

  async componentDidMount() {
   let next = await this.props.getEventsForDashboard();
    
    if (next && next.docs && next.docs.length > 1) {
      this.setState({
        moreEvents: true,
        loadingInitial: false
      });
    }
  }


  componentWillReceiveProps(nextProps) {
    if (this.props.events !== nextProps.events) {
      this.setState({
        loadedEvents: [...this.state.loadedEvents, ...nextProps.events]
      });
    }
  }


  getNextEvents = async () => {
    const { events } = this.props;
    let lastEvent = events && events[events.length - 1];

    let next = await this.props.getEventsForDashboard(lastEvent);

    if (next && next.docs && next.docs.length <= 1) {
      this.setState({
        moreEvents: false
      });
    }
  };

  handleContextRef = (contextRef) => {
    this.setState({
      contextRef
    });
  }


  render() {
    const { loading, activities } = this.props;
    const { moreEvents, loadedEvents } = this.state;
    if (this.state.loadingInitial) return <LoadingComponent inverted={true}/>;

    return (
      <Grid>
        <Grid.Column width={10}>
          <div ref={this.handleContextRef}>
            <EventList
              getNextEvents={this.getNextEvents}
              loading={loading}
              moreEvents={moreEvents}
              events={loadedEvents}/>
          </div>
        </Grid.Column>
        <Grid.Column width={6}>
          <EventActivity activities={activities} contextRef={this.state.contextRef}/>
        </Grid.Column>
        <Grid.Column width={10}>
          <Loader active={loading}/>
        </Grid.Column>
      </Grid>
    );
  }
}


const query = [
  {
    collection: 'activity',
    orderBy: ['timestamp', 'desc'],
    limit: 5
  }
]

const mapStateToProps = (state) => ({
  events: state.events,
  loading: state.async.loading,
  activities: state.firestore.ordered.activity
});


export default connect(mapStateToProps, { getEventsForDashboard })(firestoreConnect(query)(EventDashBoard));

