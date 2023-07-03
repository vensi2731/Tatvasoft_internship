import React, { useEffect, useMemo, useState } from "react";
import "./booklisting.css";
import { Button, FormControl, Grid,MenuItem, Pagination, Select, TextField, Typography } from "@mui/material";
import {useAuthContext} from "../../context/auth";
import bookService from "../../Service/book.service";
import { useCartContext } from "../../context/cart";
import Shared from "../../utils/shared";
import categoryService from "../../Service/category.service";
import { toast } from "react-toastify";
 

const BookList = () => {
  const authContext = useAuthContext();
  const cartContext = useCartContext();
    const [bookResponse, setBookResponse] = useState({
        pageIndex: 0,
        pageSize: 10,
        totalPages: 1,
        items: [],
        totalItems: 0,
      });
      const [filters, setFilters] = useState({
        pageIndex: 1,
        pageSize: 10,
        keyword: "",
      });
      const [sortBy, setSortBy] = useState();
      const [categories, setCategories] = useState([]);

      useEffect(() => {
        getAllCategories();
      }, []);

      useEffect(() => {
        const timer = setTimeout(() => {
          if (filters.keyword === "") delete filters.keyword;
          searchAllBooks({ ...filters });
        }, 500);
        return () => clearTimeout(timer);
      }, [filters]);

      const searchAllBooks = (filters) => {
        bookService.getAll(filters).then((res) => {
          setBookResponse(res);
        });
      };

      const getAllCategories = async () => {
        await categoryService.getAll().then((res) => {
          if (res) {
            setCategories(res);
          }
        });
      };

      const books = useMemo(() => {
        const bookList = [...bookResponse.items];
        if (bookList) {
          bookList.forEach((element) => {
            element.category = categories.find(
              (a) => a.id === element.categoryId
            )?.name;
          });
          return bookList;
        }
        return [];
      }, [categories, bookResponse]);

      const addToCart = (book) => {
        Shared.addToCart(book, authContext.user.id).then((res) => {
          if (res.error) {
            toast.error(res.message);
          } else {
            toast.success(res.message);
            cartContext.updateCart();
          }
        });
      };
    
      const sortBooks = (e) => {
        setSortBy(e.target.value);
        const bookList = [...bookResponse.items];
    
        bookList.sort((a, b) => {
          if (a.name < b.name) {
            return e.target.value === "a-z" ? -1 : 1;
          }
          if (a.name > b.name) {
            return e.target.value === "a-z" ? 1 : -1;
          }
          return 0;
        });
        setBookResponse({ ...bookResponse, items: bookList });
      };
      
    return(

    <div className="container_book">
        <div className='center_listing'>
        <h1 className="book_header">
            Book Listing
            <span className="underline_listing"></span>
            </h1>
        </div>
        
        
        <Grid container className="title_row_wrapper">
          <Grid item xs={6}>
            <Typography variant="h6" >
                Total
                <span> - {bookResponse.totalItems} items</span>
            </Typography>
          </Grid>

          <div className="dropdown_search">
            <TextField
              id="text"
              name="text"
              placeholder="Search..."
              variant="outlined"
              size="small"
              onChange={(e) => {
              setFilters({
                ...filters,
                keyword: e.target.value,
                pageIndex: 1,
              });
            }} />
          </div>

          <FormControl className="dropdown_wrapper" variant="outlined" size="small" >
            <div style={{marginRight:10}}>Sort By</div>
            <Select
               style={{minWidth:200}}
              onChange={sortBooks}
              value={sortBy}
            >
              <MenuItem value="a-z">a - z</MenuItem>
              <MenuItem value="z-a">z - a</MenuItem>
            </Select>
          </FormControl>
        </Grid>


       
        <div className="book_list_wrapper">
          <div className="book_list_inner_wrapper">
            {books.map((book, index) => (
              <div className="book_list" key={index}>
                <div className="book_list_inner">
                  <em>
                    <img src={book.base64image}  className="image"  alt="dummyimage" />
                  </em>
                  <div className="content_wrapper">
                    <Typography variant="h3">{book.name}</Typography>
                    <span className="category">{book.category}</span>
                    <p className="description">{book.description}</p>
                    <p className="price">
                      <span className="discount-price">
                        MRP &#8377; {book.price}
                      </span>
                    </p>
                    <Button 
                       variant="contained"
                       disableElevation
                       className="btn pink-btn "
                       style={{ 
                        backgroundColor: '#f14d54', 
                        color: 'white', 
                        fontFamily:("Roboto", "Helvetica", "Arial", "sans-serif"),
                        }}
                       >
                      <span
                        className="MuiButton-label"
                        onClick={() => addToCart(book)}
                      >
                        ADD TO CART
                      </span>
              
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>


        <div className="pagination_wrapper">
          <Pagination
            count={bookResponse.totalPages}
            page={filters.pageIndex}
            onChange={(e, newPage) => {
              setFilters({ ...filters, pageIndex: newPage });
            }}
          />
        </div>
       

    </div>
    )
};

export default BookList;