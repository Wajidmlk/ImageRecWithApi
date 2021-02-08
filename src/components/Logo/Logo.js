import React from 'react';
import './logo.css';
import Tilt from 'react-tilt';
import logos from './poo.png';
const Logo = () =>{

	return(
		<div className='ma4 mt0'>
			<Tilt className="Tilt br2 shadow-2" options={{ max : 25 }} style={{ height: 150, width: 150 }} >
		 		<div className="Tilt-inner"> 
		 			<img style={{paddingTop:'5px'}} alt='logo'src={logos}/> 
		 		</div>
			</Tilt>
		</div>
	);
}
export default Logo;