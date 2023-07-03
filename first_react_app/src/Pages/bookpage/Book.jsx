import React, { useEffect, useState } from "react";
import "./book.css";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import bookService from "../../Service/book.service";
import Shared from "../../utils/shared";
import { toast } from "react-toastify";
import ConfirmationDialog from "../../Components/confirmation/ConfirmationDialog";
import categoryService from "../../Service/category.service";

const Book = () => {

    const [filters, setFilters] = useState({
        pageIndex: 1,
        pageSize: 10,
        keyword: "",
      });
      const [bookRecords, setBookRecords] = useState({
        pageIndex: 0,
        pageSize: 10,
        totalPages: 1,
        items: [],
        totalItems: 0,
      });
      const navigate = useNavigate();
      const [open, setOpen] = useState(false);
      const [selectedId, setSelectedId] = useState(0);
      const [categories, setCategories] = useState([]);

      useEffect(() => {
        getAllCategories();
      }, []);
    
      const getAllCategories = async () => {
        await categoryService.getAll().then((res) => {
          if (res) {
            setCategories(res);
          }
        });
      };

    useEffect(() => {
        const timer = setTimeout(() => {
          if (filters.keyword === "") delete filters.keyword;
          searchAllBooks({ ...filters });
        }, 500);
        return () => clearTimeout(timer);
      }, [filters]);
    
      const searchAllBooks = (filters) => {
        bookService.getAll(filters).then((res) => {
          setBookRecords(res);
        });
      };

      const RecordsPerPage = [2, 5, 10, 100];

      const columns = [
        { id: "name", label: "Book Name"  },
        { id: "price", label: "Price" },
        { id: "category", label: "Category"},
      ];
    
      const onConfirmDelete = () => {
        bookService
          .deleteBook(selectedId)
          .then((res) => {
            toast.success(Shared.messages.DELETE_SUCCESS);
            setOpen(false);
            setFilters({ ...filters, pageIndex: 1 });
          })
          .catch((e) => toast.error(Shared.messages.DELETE_FAIL));
      };

  return(
    <div className="container_bookpage">
        <div className='center_bookpage'>
        <h1 className="bookpage_header">
            Book Page
        <span className="underline_bookpage"></span>
        </h1>
        </div>

        <div className="add-btn">
            <TextField
                id="text"
                name="text"
                placeholder="Search..."
                variant="outlined"
                size="small"
                style={{width:300}}
                onChange={(e) => {
                    setFilters({ ...filters, keyword: e.target.value, pageIndex: 1 });
                  }}/>
            <Button
                type="button"
                className="btn pink_btn"
                variant="contained"
                disableElevation
                style={{ 
                    backgroundColor: '#f14d54', 
                    color: 'white', 
                    fontFamily:("Roboto", "Helvetica", "Arial", "sans-serif"),
                    marginRight:10
                    }}
                onClick={() => navigate("/add-book")}>
                Add
            </Button>
        </div>


        <TableContainer>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                    {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    style={{ minWidth:100,fontWeight:600 }}
                  >
                    {column.label}
                  </TableCell>
                ))}
                <TableCell></TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                  {bookRecords?.items?.map((row, index) => (
                    <TableRow key={row.id}>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.price}</TableCell>
                        <TableCell>
                            {categories.find((c) => c.id === row.categoryId)?.name}
                        </TableCell>
                        
                        <TableCell >
                            <Button
                                type="button"
                                className="edit-btn btn"
                                variant="contained"
                                disableElevation
                                onClick={() => {
                                navigate(`/edit-book/${row.id}`);
                                }}
                            >
                                Edit
                            </Button>
                            <Button
                                type="button"
                                className="btn delete-btn"
                                variant="contained"
                                disableElevation
                                onClick={() => {
                                    setOpen(true);
                                    setSelectedId(row.id ?? 0);
                                }}
                            >
                                Delete
                            </Button>
                        </TableCell>
                    </TableRow>
                  ))}
                    {!bookRecords.items.length && (
                        <TableRow className="TableRow">
                            <TableCell colSpan={5} className="TableCell">
                                <Typography align="center" className="noDataText">
                                    No Books
                                </Typography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
        
        <div style={{marginBottom:20}}></div>

        <TablePagination
          rowsPerPageOptions={RecordsPerPage}
          component="div"
          count={bookRecords.totalItems}
          rowsPerPage={filters.pageSize || 0}
          page={filters.pageIndex - 1}
          onPageChange={(e, newPage) => {
            setFilters({ ...filters, pageIndex: newPage + 1 });
          }}
          onRowsPerPageChange={(e) => {
            setFilters({
              ...filters,
              pageIndex: 1,
              pageSize: Number(e.target.value),
            });
          }}
        />
        

        <ConfirmationDialog
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={() => onConfirmDelete()}
          title="Delete book"
          description="Are you sure you want to delete this book?"
        /> 


    </div>
  )
};

export default Book;