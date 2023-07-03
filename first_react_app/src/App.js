import React from 'react';
import './Styles/App.css';
import { BrowserRouter,} from "react-router-dom";
import loader from "../src/images/loader.gif";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './Components/footer/Footer';
import Header from './Components/header/Header';
import MainNavigation from "./Components/MainNavigation";
import { AuthWrapper } from './context/auth';
import { CartWrapper } from './context/cart';

const App = () => {
  return(

  <>

 
 
  {/* <Routes>
       <Route path='/home' element={<HomePage/>}></Route>
       <Route path='/' element={<Login/>}></Route>
       <Route path='/register' element={<Register/>}></Route>
       <Route path='*' element={<NotFound/>}></Route>
  </Routes> */}
  
  <BrowserRouter>
  <AuthWrapper>
    <CartWrapper>
    <div className="loader-wrapper">
                <img src={loader} alt="loader" />
              </div>
  <Header/>
 <MainNavigation/>
  <Footer/>
  <ToastContainer/>
  </CartWrapper>
  </AuthWrapper>
  </BrowserRouter>
  
 
  {/* <img src={Logo} alt='App Logo'/> */}
  {/* <img src={`${process.env.REACT_APP_HOSTED_URL}logo192.png`} alt='App Logo'/> */}
  
 </>
  );}
export default App;
