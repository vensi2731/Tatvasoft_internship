import React, { useEffect, useState } from "react";
import "./category.css";
import { toast } from "react-toastify";
import Shared from "../../utils/shared";
import { useNavigate } from "react-router-dom";
import categoryService from "../../Service/category.service";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from "@mui/material";
import ConfirmationDialog from "../../Components/confirmation/ConfirmationDialog";

const Category = () => {
   
  const [filters, setFilters] = useState({
    pageIndex: 1,
    pageSize: 10,
    keyword: "",
  });
  const [categoryRecords, setCategoryRecords] = useState({
    pageIndex: 0,
    pageSize: 10,
    totalPages: 1,
    items: [],
    totalItems: 0,
  });
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(0);

  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.keyword === "") delete filters.keyword;
      searchAllCategories({ ...filters });
    }, 500);
    return () => clearTimeout(timer);
  }, [filters]);

  const searchAllCategories = (filters) => {
    categoryService.getAll(filters).then((res) => {
      setCategoryRecords(res);
    });
  };

  const RecordsPerPage = [2, 5, 10, 100];

  const columns = [{ id: "name", label: "Category Name", minWidth: 100 }];

  const onConfirmDelete = () => {
    categoryService
      .deleteCategory(selectedId)
      .then((res) => {
        toast.success(Shared.messages.DELETE_SUCCESS);
        setOpen(false);
        setFilters({ ...filters });
      })
      .catch((e) => toast.error(Shared.messages.DELETE_FAIL));
  };


    return(
    <div className="container_category">
        <div className='center_category'>
        <h1 className="category_header">
            Category
        <span className="underline_category"></span>
        </h1>
        </div>

        <div className="add-btn_category">
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
                className="btn add__btn"
                variant="contained"
                disableElevation
                style={{ 
                    backgroundColor: '#f14d54', 
                    color: 'white', 
                    fontFamily:("Roboto", "Helvetica", "Arial", "sans-serif"),
                    marginRight:10,
                    }}
                onClick={() => navigate("/add-category")}>
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
                    style={{ minWidth: column.minWidth,fontWeight:600 }}
                  >
                    {column.label}
                  </TableCell>
                ))}
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categoryRecords?.items?.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      className="editbtn btn"
                      variant="contained"
                      disableElevation

                      onClick={() => {
                        navigate(`/edit-category/${row.id}`);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      className="btn deletebtn"
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
              {!categoryRecords?.items.length && (
                <TableRow className="TableRow">
                  <TableCell colSpan={6} className="TableCell">
                    <Typography align="center" className="noDataText">
                      No Category
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
          count={categoryRecords?.totalItems || 0}
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
          title="Delete category"
          description="Are you sure you want to delete this category?"
        />

    </div>

    );
}

export default Category;