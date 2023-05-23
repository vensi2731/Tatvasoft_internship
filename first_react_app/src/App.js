
import './App.css';
import {Routes, Route, BrowserRouter, Link} from "react-router-dom";
//import { globleStyles } from './constants';

import appStyle from "./AppStyle.module.css";

import { HomePage } from './HomePage';
import { Apple } from './Apple';
import { NotFound } from './NotFound';

//import Logo from "./images/logo.svg";
//import siteLogo from "../public/logo192.png"

import { ThemeProvider } from '@emotion/react';
import { theme } from './styles';

const App = () => (

  <>
  <ThemeProvider theme={theme}>
  

  <BrowserRouter>
  <div  
  // style={{
  //   ...globleStyles.navbar
  //   }}
     className={appStyle.navbarStyle}
    >
  <Link to="/" style={{marginLeft:5}}>Home</Link>
  <Link to="/apple" style={{marginLeft:10}}>Apple</Link>
  <Link to="/applet" style={{marginLeft:10}} >Applet</Link>
  </div>

  <Routes>
       <Route path='/' element={<HomePage/>}></Route>
       <Route path='/apple' element={<Apple/>}></Route>
       <Route path='*' element={<NotFound/>}></Route>
  </Routes>
  </BrowserRouter>

  {/* <img src={Logo} alt='App Logo'/> */}
  <img src={`${process.env.REACT_APP_HOSTED_URL}logo192.png`} alt='App Logo'/>
  </ThemeProvider>
 </>
  );


export default App;
