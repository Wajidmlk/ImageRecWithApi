import React,{Component} from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import './App.css';

const app = new Clarifai.App({
  apiKey: 'a17c3e6de9ac4ea283dbe3588ac73d9b'
});

const ParticlesOptions = {
  particles: {
    number:{
      value:100,
      density:{
        enale:true,value_area:800
       }
    }
  }}

class App extends Component {
    
 
  constructor(){
    super();
    this.state ={
      input:'',
      imageUrl:'',
      box:{},
      route:'signin',
      isSignedIn: false,
      user:{
        id:'',
        name:'',
        email:'',
        entries:0,
        joined:''
      }
    }
  }

  loadUser=(Usr)=>{
    this.setState({user:{
      id:Usr.id,
      name:Usr.name,
      email:Usr.email,
      entries:Usr.entries,
      joined:Usr.joined
    }});
  }

  calculateFaceLocation =(data) =>{
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
  
    const width= Number(image.width);
    const height= Number(image.height);
    return {
      leftCol:clarifaiFace.left_col * width,
      topRow:clarifaiFace.top_row * height,
      rightCol:width - (clarifaiFace.right_col * width),
      bottomRow:height - (clarifaiFace.bottom_row * height)
    }

  }

  displayFaceBox = (box) =>{
      this.setState({box:box});
  }
  onInputChange = (event)=>{
    this.setState({input:event.target.value});
  }
  onButtonSubmit = ()=>{
    this.setState({imageUrl:this.state.input});

    
      app.models.predict(
      Clarifai.FACE_DETECT_MODEL,
      this.state.input)
        .then(response =>{
          if(response){
            fetch('http://localhost:3000/image',{
              method:'put',
              headers:{'Content-Type':'application/json'},
              body:JSON.stringify(
                {id:this.state.user.id
              })
            })
            .then(response=>response.json())
            .then(count=>{
              this.setState(Object.assign(this.state.user,{entries:count}))
            })
          }
          this.displayFaceBox(this.calculateFaceLocation(response))
        })
          .catch(err=>console.log(err));
  }
  onRouteChange = (route) =>{
    if(route==='signout'){
      this.setState({isSignedIn:false})
    }else if(route==='home'){
      this.setState({isSignedIn:true})
    }
    this.setState({route:route}); 
  }


  render(){

    const {isSignedIn, route,imageUrl,box} = this.state;
    

    return (

      <div className="App">
        <Particles className='Particle' params={ParticlesOptions}/>
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}/>
        
        { 
          (route === 'home')?
            <div>
              <Logo />
              
              <Rank name={this.state.user.name} entries={this.state.user.entries}/>    
              <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition box={box} imageUrl={imageUrl} />
            </div>
          : (route === 'signin')?
            <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/> 
          :
            <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} isSignedIn={this.isSignedIn}/>
        }
      </div>
    );
  }
  
}

export default App;
