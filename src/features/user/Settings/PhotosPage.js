import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Image, Segment, Header, Divider, Grid, Button, Card, Icon } from 'semantic-ui-react';
import Dropzone from 'react-dropzone';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { toastr } from 'react-redux-toastr';
import { uploadProfileImage, deletePhoto, setMainPhoto } from '../userActions';




class PhotosPage extends Component {

  state = {
    files: [],
    fileName: '',
    cropResult: null,
    image: {}
  };

  onDrop = (files) => {
    this.setState({
      files,
      fileName: files[0].name
    });
  };

  uploadImage = async () => {
    try {
      await this.props.uploadProfileImage(this.state.image, this.state.fileName);
      this.cancelCrop();
      toastr.success('Success !', 'Photo has been uploaded');
    } catch (e) {
      toastr.error('Oops', e.message);
    }
  };

  handlePhotoDelete = (photo) => async () => {
    
    try {
      this.props.deletePhoto(photo);
    } catch (e) {
      toastr.error('Oops', e.message);
      console.log(e);
    }
  };

  handleSetMainPhoto = (photo) => async () => {
    try {
      this.props.setMainPhoto(photo);
    } catch (e) {
      toastr.error('Oops', e.message);
    }
  };

  cancelCrop = () => {
    this.setState({
      files: [],
      image: {}
    });
  };

  cropImage = () => {
    if (typeof this.refs.cropper.getCroppedCanvas() === "undefined") {
      return;
    }

    this.refs.cropper.getCroppedCanvas().toBlob(blob => {
      let imageUrl = URL.createObjectURL(blob);
      this.setState({
        cropResult: imageUrl,
        image: blob
      });
    }, 'image/jpeg')
  };

  render() {

    const { photos, profile, loading } = this.props;
    let filteredPhotos;
    if (photos) {
      filteredPhotos = photos.filter(photo => {
        return photo.url !== profile.photoURL
      })
    }
    return (
      <Segment>
        <Header dividing size='large' content='Your Photos' />
        <Grid>
          <Grid.Row />
          <Grid.Column width={4}>
            <Header color='teal' sub content='Step 1 - Add Photo'/>
            <Dropzone onDrop={this.onDrop} multiple={false}  >
              <div style={{paddingTop: '30px', textAlign: 'center'}}>
                <Icon name="upload" size="huge"/>
                <Header content="Drop image here or click to add"/>
              </div>
            </Dropzone>
          </Grid.Column>
          <Grid.Column width={1} />
          <Grid.Column width={4}>
            <Header sub color='teal' content='Step 2 - Resize image' />
            {this.state.files[0] &&
            <Cropper
              style={{height: '200px', width: '100%' }}
              ref='cropper'
              src={this.state.files[0].preview}
              aspectRation={1}
              viewMode={0}
              dragMode="move"
              guides={false}
              scalable={true}
              croppBoxMovable={true}
              croppBoxResizable={true}
              crop={this.cropImage}
            />}
          </Grid.Column>
          <Grid.Column width={1} />
          <Grid.Column width={4}>
            <Header sub color='teal' content='Step 3 - Preview and Upload' />
            {this.state.files[0] && (
              <div>
                <Image style={{minHeight: '200px', minWidth: '200px'}} src={this.state.cropResult}/>
                <Button.Group>
                  <Button
                    loading={loading}
                    onClick={this.uploadImage}
                    style={{width: '100px'}}
                    positive
                    icon="check"  />
                  <Button
                    disabled={loading}
                    onClick={this.cancelCrop}
                    style={{width: '100px'}}
                    icon="close"  />
                </Button.Group>
              </div>
            )}
          </Grid.Column>

        </Grid>

        <Divider/>
        <Header sub color='teal' content='All Photos'/>

        <Card.Group itemsPerRow={5}>
          <Card>
            <Image src={profile.photoURL || '/assets/user.png'}/>
            <Button  positive>Main Photo</Button>
          </Card>
          {photos && filteredPhotos.map(photo => (
            <Card key={photo.id}>
              <Image src={photo.url} />
              <div className='ui two buttons'>
                <Button loading={loading}  onClick={this.handleSetMainPhoto(photo)} basic color='green'>Main</Button>
                <Button onClick={this.handlePhotoDelete(photo)}  basic icon='trash' color='red' />
              </div>
            </Card>
          ))}

        </Card.Group>
      </Segment>
    );
  }
}


const mapStateToProps = (state) => ({
  auth: state.firebase.auth,
  profile: state.firebase.profile,
  photos: state.firestore.ordered.photos,
  loading: state.async.loading
});

// const query = ({ auth }) => {
//   return [
//     {
//       collection: 'users',
//       doc: auth.uid,
//       subcollections: [{ collection: 'photos'}],
//       storeAs: 'photos'
//     }
//   ]
// };

// export default compose(
//   connect(mapStateToProps, { uploadProfileImage }),
//   firebaseConnect(auth => query(auth))
// )(PhotosPage);

export default connect(mapStateToProps, { uploadProfileImage, deletePhoto, setMainPhoto })(PhotosPage);