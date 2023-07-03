import React, { useEffect, useState } from "react";
import "./edituser.css";
import { Formik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import {useAuthContext} from "../../../context/auth";
import userService from "../../../Service/user.service";
import Shared from "../../../utils/shared";
import { toast } from "react-toastify";
import { Button, FormControl, MenuItem, Select, TextField } from "@mui/material";

const EditUser = () => {
    const authContext = useAuthContext();
    const [roles, setRoles] = useState([]);
    const [user, setUser] = useState();
    const navigate = useNavigate();
    const initialValues = {
      id: 0,
      email: "",
      lastName: "",
      firstName: "",
      roleId: 3,
    };
    const [initialValueState, setInitialValueState] = useState(initialValues);
    const { id } = useParams();
  
    useEffect(() => {
      getRoles();
    }, []);
  
    useEffect(() => {
      if (id) {
        getUserById();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);
  
    useEffect(() => {
      if (user && roles.length) {
        const roleId = roles.find((role) => role.name === user?.role)?.id;
        setInitialValueState({
          id: user.id,
          email: user.email,
          lastName: user.lastName,
          firstName: user.firstName,
          roleId,
          password: user.password,
        });
      }
    }, [user, roles]);
  
    const validationSchema = Yup.object().shape({
      email: Yup.string()
        .email("Invalid email address format")
        .required("Email is required"),
      firstName: Yup.string().required("First Name is required"),
      lastName: Yup.string().required("Last Name is required"),
      roleId: Yup.number().required("Role is required"),
    });
  
    const getRoles = () => {
      userService.getAllRoles().then((res) => {
        if (res) {
          setRoles(res);
        }
      });
    };
  
    const getUserById = () => {
      userService.getById(Number(id)).then((res) => {
        if (res) {
          setUser(res);
        }
      });
    };
  
    const onSubmit = (values) => {
      const updatedValue = {
        ...values,
        role: roles.find((r) => r.id === values.roleId).name,
      };
      userService
        .update(updatedValue)
        .then((res) => {
          if (res) {
            toast.success(Shared.messages.UPDATED_SUCCESS);
            navigate("/user");
          }
        })
        .catch((e) => toast.error(Shared.messages.UPDATED_FAIL));
    };

    return(
    <div className="container_user_">
        <div className='center_user_'>
            <h1 className="user_header_">
            Edit User 
            <span className="underline_user_"></span>
            </h1>
        </div>
        <div style={{marginTop:50}}></div>

        <Formik
          initialValues={initialValueState}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={onSubmit}
          validator={() => ({})}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
          }) => (
            <form onSubmit={handleSubmit}>
              
              <div className="section">
                <div>
                  <div className='label_user'>First Name *</div>
                  <TextField
                    id="first-name"
                    type='text'
                    name="firstName"
                    variant="outlined"
                    size="small"
                    style={{width:'550px',border: 'none'}}
                    value={values.firstName}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  {errors.firstName && touched.firstName && <div style={{
                      color: "red",
                      fontSize: 14,
                      position:"absolute"
                  }}>{errors.firstName}</div>}
                </div>


                <div>
                  <div className='label_user'>Last Name *</div>
                  <TextField
                    onBlur={handleBlur}
                    onChange={handleChange}
                    id="last-name"
                    name="lastName"
                    value={values.lastName}
                    variant="outlined"
                    type='text'
                    size="small"
                    style={{width:'550px',border: 'none'}}
                  />
                  {errors.lastName && touched.lastName && <div style={{
                      color: "red",
                      fontSize: 14,
                      position:"absolute"
                  }}>{errors.lastName}</div>}
                </div>
              </div>


              <div className="section">
                <div>
                  <div className='label_user'>Email *</div>
                  <TextField
                    onBlur={handleBlur}
                    onChange={handleChange}
                    id="email"
                    type='email'
                    name="email"
                    value={values.email}
                    variant="outlined"
                    size="small"
                    style={{width:'550px',border: 'none'}}
                  />
                 {errors.email && touched.email && <div style={{
                      color: "red",
                      fontSize: 14,
                      position:"absolute"
                  }}>{errors.email}</div>}
                </div>

                {values.id !== authContext.user.id && (
                  <div >
                    <FormControl
                      className="dropdown-wrapper"
                      variant="outlined"
                      disabled={values.id === authContext.user.id}
                    >
                      <div className='label_user'>Roles</div>
                      <Select
                        name="roleId"
                        id={"roleId"}
                        onChange={handleChange}
                        disabled={values.id === authContext.user.id}
                        size="small"
                        style={{width:'550px',border: 'none'}}
                        value={values.roleId}
                      >
                        {roles.length > 0 &&
                          roles.map((role) => (
                            <MenuItem value={role.id} key={"name" + role.id}>
                              {role.name}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </div>
                )}
              </div>
              
              <div className="btn_edituser_">
                <Button
                  className="save_user_btn btn"
                  variant="contained"
                  type="submit"
                  disableElevation
                  style={{marginRight:10}}
                >
                  Save
                </Button>
                <Button
                  className="cancel_user_btn btn"
                  variant="contained"
                  type="button"
                  disableElevation
                  onClick={() => {
                    navigate("/user");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </Formik>
        
    </div>    

    );

}

export default EditUser;