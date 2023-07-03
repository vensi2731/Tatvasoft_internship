import React, { useMemo, useState } from "react";
import "./header.css";
import { toast } from "react-toastify";
import {RoutePaths} from "../../utils/enum";
import { Link, useNavigate } from "react-router-dom";
import Shared from "../../utils/shared";
import {useAuthContext} from "../../context/auth";
import {useCartContext} from "../../context/cart";
import bookService from "../../Service/book.service";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import { Button, List, ListItem, TextField} from '@mui/material';
import tatvasoftLogo from "../../images/Tatvasoftlogo.svg";


const Header = () => {
    const authContext = useAuthContext();
    const cartContext = useCartContext();
    // const [open, setOpen] = useState(false);
    const open = false;
    const [query, setquery] = useState("");
    const [bookList, setbookList] = useState([]);
    const [openSearchResult, setOpenSearchResult] = useState(false);
  
    const navigate = useNavigate();
  
    // for mobile menu
    const openMenu = () => {
      document.body.classList.toggle("open-menu");
    };
  
    const items = useMemo(() => {
      return Shared.NavigationItems.filter(
        (item) =>
          !item.access.length || item.access.includes(authContext.user.roleId)
      );
    }, [authContext.user]);
  
    const logOut = () => {
      authContext.signOut();
      cartContext.emptyCart();
    };
  
    const searchBook = async () => {
      const res = await bookService.searchBook(query);
      setbookList(res);
    };
  
    const search = () => {
      document.body.classList.add("search-results-open");
      searchBook();
      setOpenSearchResult(true);
    };
  
    const addToCart = (book) => {
      if (!authContext.user.id) {
        navigate(RoutePaths.Login);
        toast.error("Please login before adding books to cart");
      } else {
        Shared.addToCart(book, authContext.user.id).then((res) => {
          if (res.error) {
            toast.error(res.error);
          } else {
            toast.success("Item added in cart");
            cartContext.updateCart();
          }
        });
      }
    };

    return(
      <div>
      <div className="topheader" style={{ display: open ? "none" : "block" }}></div>
  <div>
      <div className="navcontainer">
           <img src={tatvasoftLogo} alt='Logo' className='logoo' ></img>
          <div className="navbar">
              <div className="navbarstyle">
              {!authContext.user.id && (
                  <>
              <Link to={RoutePaths.Login}
                  style={{ 
                      marginLeft: 10, 
                      color: '#f14d54', 
                      textDecoration: 'none',
                     
              }}>
                  
                  Login
              </Link>
              
              <span style={{ marginLeft:10, fontWeight:100, color:'lightgray'}}>  |   </span>
              
              <Link to={RoutePaths.Register} 
                  style={{ 
                      marginLeft: 10, 
                      color: '#f14d54', 
                      textDecoration: 'none' ,
                  }}
                  
                  >
                  Register
              </Link>
              
              </> 
              )}

              {items.map((item,index) => (
                  <span  key={index} >
                  <Link to={item.route} title={item.name}
                  style={{ 
                      marginLeft: 10, 
                      color: '#f14d54', 
                      textDecoration: 'none' 
              }}>
                  {item.name}
                  
                </Link>
                <span style={{ marginLeft:10, fontWeight:100, color:'lightgray'}}>  |  </span>
                </span>
              ))
              }
              </div> 
              
              <div className="cart-country-wrap">
              <Link to="/cart" title="Cart" className="cart">
                  <ShoppingCartIcon sx={{color:"#f14d54"}}/>
                  <span style={{margin:0,color:"#f14d54",fontWeight:500}} >
                      {cartContext.cartData.length} 
                      </span> 
                      Cart
              </Link>
               <div className="hamburger" onClick={openMenu}>  
                 <span></span>
               </div>
              </div>

              {authContext.user.id && (
                 <div className='logout'>
                    <Button 
                        onClick={() => logOut()}
                        variant="outlined"
                         style={{
                          borderColor:"lightgray",
                          color:"black",
                          marginLeft:20,
                          fontWeight:500,
                          
                          "&:hover": {
                              backgroundColor: "#5FA021",
                              cursor: "pointer"
                          }
                          }}>
                       Log out
                     </Button>
                 </div>
               )}
          </div>
      </div>
  </div> 
  
  <div
        className="search-overlay"
        onClick={() => {
          setOpenSearchResult(false);
          document.body.classList.remove("search-results-open");
        }}
      ></div>
  <div className="appbar">
      <div className="appcontainer">
          <div className="search_outer">
            <div className="search_inner">
            <div className="text-wrapper">
              <TextField 
                  id="text"
                  name="text"
                  placeholder="What are you looking for..."
                  variant="outlined"
                  size='small'
                  style={{width:560}}
                  value={query}
                  onChange={(e) => setquery(e.target.value)}
                  />

                  {openSearchResult && (
                    <>
                      <div className="product-listing">
                        {bookList?.length === 0 && (
                          <p className="no-product">No product found</p>
                        )}

                        {/* <p className="loading">Loading....</p> */}
                        <List className="related-product-list">
                          {bookList?.length > 0 &&
                            bookList.map((item, i) => {
                              return (
                                <ListItem key={i} 
                                  sx={{
                                    cursor:"pointer",
                                    padding:"10px 5px",
                                    "&:hover":{
                                      backgroundColor:"#f4f4f4",
                                    }
                                    }}>
                                  <div className="inner-block">
                                    <div className="left-col">
                                      <span className="title">{item.name}</span>
                                      <p>{item.description}</p>
                                    </div>
                                    <div className="right-col">
                                      <span className="price">
                                        {item.price}
                                      </span>
                                      <Link onClick={() => addToCart(item)} style={{color:"#f14d54",textDecoration:"none"}}>
                                        Add to cart
                                      </Link>
                                    </div>
                                  </div>
                                </ListItem>
                              );
                            })}
                        </List>
                      </div>
                    </>
                  )}
                </div>

                  

              <Button 
                  className="search-btn"
                  type="submit"
                  disableElevation
                  variant="contained"  
                  onClick={search}
                  sx={{
                      backgroundColor:"#80BF32",
                      color:"white",
                      height:40,
                      width:120,
                      fontSize:16,
                      marginLeft:1,
                      textTransform:"capitalize",
                      transition: "background-color 0.3s",
                      "&:hover": {
                          backgroundColor: "#5FA021",
                          cursor: "pointer"
                      }
                  }}>
                      <SearchIcon sx={{color:"white",fontWeight:500}}/>
                          <span>Search</span>
              </Button>
              </div>
          </div>
      </div>
  </div>
</div>


    )

};

export default Header;