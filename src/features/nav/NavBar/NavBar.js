import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withFirebase } from 'react-redux-firebase';
import { Menu, Button, Container } from 'semantic-ui-react';
import { NavLink, Link, withRouter } from 'react-router-dom';
import SignedOutMenu from "../Menus/SignedOutMenu";
import SignedInMenu from "../Menus/SignedInMenu";
import { openModal } from '../../modals/modalActions';



class NavBar extends Component {


  handleSignIn = () => {
    this.props.openModal('LoginModal')
  };

  handleSignOut = () => {
    this.props.firebase.logout();
    this.props.history.push('/');
  };

  handleRegister = () => {
    this.props.openModal('RegisterModal');
  };

  render() {
    const { auth, profile } = this.props;
    const authenticated = auth.isLoaded && !auth.isEmpty;

    return (
      <div>
        <Menu inverted fixed="top">
          <Container>
            <Menu.Item as={NavLink} to="/" header>
              <img src="/assets/logo.png" alt="logo" />
              Travel Events
            </Menu.Item>
            <Menu.Item as={NavLink} to="/events"  name="Events" />
            {/*<Menu.Item as={NavLink} to="/test"  name="Test" />*/}
            {authenticated && <Menu.Item as={NavLink} to="/people"  name="People" />}
            {authenticated &&
            <Menu.Item>
              <Button as={Link} to="/createEvent"  floated="right" positive inverted content="Create Event" />
            </Menu.Item>}
            {authenticated ? <SignedInMenu auth={auth}  profile={profile}  signOut={this.handleSignOut} /> : <SignedOutMenu signIn={this.handleSignIn} register={this.handleRegister} />}
          </Container>
        </Menu>
      </div>
    );
  }
}



const mapStateToProps = (state) => ({
  auth: state.firebase.auth,
  profile: state.firebase.profile
});

export default withRouter(withFirebase(connect(mapStateToProps, { openModal })(NavBar)));