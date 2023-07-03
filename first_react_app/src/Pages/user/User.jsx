import React, { useEffect, useState } from "react";
import "./user.css";
import { useNavigate } from "react-router-dom";
import Shared from "../../utils/shared";
import { toast } from "react-toastify";
import {useAuthContext} from "../../context/auth";
import userService from "../../Service/user.service";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from "@mui/material";
import ConfirmationDialog from "../../Components/confirmation/ConfirmationDialog";

const User = () => {

    const authContext = useAuthContext();
    const [filters, setFilters] = useState({
        pageIndex: 1,
        pageSize: 10,
        keyword: "",
      });
    const [userList, setUserList] = useState({
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
        getAllUsers({ ...filters });
      }, 500);
      return () => clearTimeout(timer);
    }, [filters]);
  
    const getAllUsers = async (filters) => {
      await userService.getAllUsers(filters).then((res) => {
        if (res) {
          setUserList(res);
        }
      });
    };

    const RecordsPerPage = [2, 5, 10, 100];
  
    const columns = [
      { id: "firstName", label: "First Name", minWidth: 100 },
      { id: "lastName", label: "Last Name", minWidth: 100 },
      {
        id: "email",
        label: "Email",
        minWidth: 170,
      },
      {
        id: "roleName",
        label: "Role",
        minWidth: 130,
      },
    ];
  
    const onConfirmDelete = async () => {
      await userService
        .deleteUser(selectedId)
        .then((res) => {
          if (res) {
            toast.success(Shared.messages.DELETE_SUCCESS);
            setOpen(false);
            setFilters({ ...filters });
          }
        })
        .catch((e) => toast.error(Shared.messages.DELETE_FAIL));
    };

    return(
    <div className="container_user">
        <div className='center_user'>
        <h1 className="user_header">
            User
        <span className="underline_user"></span>
        </h1>
        </div>

        <div className="user-btn">
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
        </div>

        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    style={{ minWidth: column.minWidth,fontWeight:600  }}
                  >
                    {column.label}
                  </TableCell>
                ))}
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userList?.items?.map((row, index) => (
                <TableRow key={`${index}-${row.id}-${row.email}`}>
                  <TableCell>{row.firstName}</TableCell>
                  <TableCell>{row.lastName}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.role}</TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      className="edit-user-btn btn"
                      variant="contained"
                      disableElevation
                      onClick={() => {
                        navigate(`/edit-user/${row.id}`);
                      }}
                    >
                      Edit
                    </Button>
                    {row.id !== authContext.user.id && (
                      <Button
                        type="button"
                        className="btn delete-user-btn"
                        variant="contained"
                        disableElevation
                        onClick={() => {
                          setOpen(true);
                          setSelectedId(row.id ?? 0);
                        }}
                      >
                        Delete
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {!userList?.items?.length && (
                <TableRow className="TableRow">
                  <TableCell colSpan={5} className="TableCell">
                    <Typography align="center" className="noDataText">
                      No Users
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
          count={userList?.totalItems || 0}
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
          title="Delete user"
          description={Shared.messages.USER_DELETE}
        />
    </div>
    );
}
export default User;