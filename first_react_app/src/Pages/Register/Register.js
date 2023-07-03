import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from '@mui/material/Button';
import { Breadcrumbs, TextField, Link, Typography} from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { Formik } from 'formik';
import * as Yup from "yup";
import { toast } from 'react-toastify';
import "./register_styles.css";
import authService from "../../Service/auth.service";
import userService from "../../Service/user.service";



const Register = () => {
    const [roleList,setRoleList]=useState([]);
    const navigate = useNavigate('');
    const initialValues = {
        firstName: '',
        lastName: '',
        email: '',
        roleId: 0,
        password: '',
        confirmPassword: '',
    }

    useEffect(() => {
        if (roleList.length) return;
        getRoles();
      }, [roleList]);
    
      const getRoles = () => {
        userService.getAllRoles().then((res) => {
          setRoleList(res);
        });
      };


    const validationSchema = Yup.object().shape({
        firstName: Yup.string().required("First name is required"),
        lastName: Yup.string().required('Last name is required'),
        email: Yup.string()
            .email("Invalid email address format")
            .required('Email is required'),
        password:Yup.string()
            .min(5,"Password must be 5 Characters at minimum")
            .required('Password is required'),
        confirmPassword:Yup.string()
            .required('Confirm Password is required')
            .oneOf(
                [Yup.ref('password'), null], 
                'Password and Confirm Password must be match'
                ),
        roleId: Yup.number().required("Role is required"),
    });

    const onSubmit = (data) => {
        delete data.confirmPassword;
        authService.create(data).then((res) => {
          navigate("/login");
          toast.success("Successfully registered");
        });
      };
    return (
        <>
            <div style={{ padding: 5 }}></div>
            <div >
                <div className="container">
                    <div style={{justifyContent:"center",display:"flex",fontSize:18}}>
                    <Breadcrumbs separator="›" aria-label="breadcrumb" className="breadcrumb-wrapper">
                    <Link color="inherit" href="/" title="Home" className="link-custom" style={{textDecoration:"none",fontSize:18}} >Home</Link>
                    <Typography className="typo-custom" style={{fontSize:18}}>Create an Account</Typography>
                    </Breadcrumbs></div>
                
                <div>
                    <div className='center'>
                        <h1 className="loginheader">
                            Login or Create an Account
                            <span className="underline"></span>
                            </h1>
                    </div>
                </div>
                
                <div style={{
                    width:'75%',
                    margin:'auto',
                }}>
                    
                        <Formik 
                              initialValues={initialValues} 
                              validationSchema={validationSchema} 
                              onSubmit={onSubmit}
                        >
                            {({ values, 
                                errors, 
                                touched,  
                                handleChange, 
                                handleBlur, 
                                handleSubmit }) => {
                                 return(
                                    <form onSubmit={handleSubmit} >
                                        <div className="form-box">
                                            <div className="personal_info">
                                                <div style={{marginTop:50}}></div>
                                                <Typography variant="h6" className="custom-typography" style={{fontWeight:500,paddingBottom:10}}>Personal Information</Typography>
                                                <p className='paraStyle'>Please enter the following information to create your account.</p>
                                        
                                        <div className='side-by-side'>
                                           <div>
                                            <div className='label'>First Name* </div>
                                            <TextField
                                                id="first-name"
                                                type='text'
                                                name="firstName"
                                                size="small"
                                                variant="outlined"
                                                style={{width:'532px',border: 'none'}}
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
                                            <div className='label'>Last Name* </div>
                                            <TextField
                                                type='text'
                                                name="lastName"
                                                id="last-name"
                                                size="small"
                                                variant="outlined"
                                                style={{width:'532px'}}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                            />
                                            {errors.lastName && touched.lastName && <div style={{
                                                color: 'red',
                                                fontSize: 14,
                                                position:"absolute"
                                            }}>{errors.lastName}</div>}
                                            </div>
                                        </div>
                                            
                                        {/* <div style={{padding:5}}></div> */}
                                    <div className='side-by-side'>
                                        <div>
                                            <div className='label'>Email Address* </div>
                                             <TextField
                                                type='email'
                                                id="email"
                                                size="small"
                                                variant="outlined"
                                                style={{width:'532px'}}
                                                onChange={handleChange}
                                                name="email"
                                                onBlur={handleBlur}
                                            />
                                            {errors.email && touched.email && <div style={{
                                                color: 'red',
                                                fontSize: 14,
                                                position:"absolute"
                                            }}>{errors.email}</div>}
                                            </div>

                                            <div>
                                            <div className='label'>Roles</div>
                                            <Select
                                            name='roleId'
                                            id={"roleId"}
                                            value={values.roleId}
                                            size="small"
                                            style={{width:'532px'}}
                                            onChange={handleChange}
                                                
                                            >
                                            {roleList.length > 0 &&
                                               roleList.map((role) => (
                                                  <MenuItem
                                                    value={role.id}
                                                    key={"name" + role.id}
                                                  >
                                                    {role.name}
                                                 </MenuItem>
                                            ))}
                                            </Select>
                                            {errors.roleId && touched.roleId && <div style={{
                                                color: 'red',
                                                fontSize: 14,
                                                position:"absolute"
                                            }}>{errors.roleId}</div>}
                                            </div>
                                    </div>
                                    </div>
                                            
                                            <div style={{
                                            display: "flex",
                                            flexDirection: 'column',
                                            rowGap: 10
                                        }}>
                                        <div style={{marginTop:30}}>
                                                <Typography variant="h6" className="custom-typography" style={{fontWeight:500,paddingBottom:10}}>Login Information</Typography>
                                               
                                        </div>
                                        <div className='side-by-side'>
                                                <div>
                                                <div className='label'>Password*</div>
                                                <TextField
                                                type='password'
                                                id="password"
                                                size="small"
                                                style={{width:'532px'}}
                                                onChange={handleChange}
                                                name="password"
                                                variant="outlined"
                                                onBlur={handleBlur}
                                                 />
                                                 {errors.password && touched.password && <div style={{
                                                color: 'red',
                                                fontSize: 14,
                                                position:"absolute"
                                            }}>{errors.password}</div>}
                                            </div>
                                            <div>
                                                <div className='label'>Confirm Password*</div>
                                                <TextField
                                                type='password'
                                                onChange={handleChange}
                                                style={{width:'532px'}}
                                                size="small"
                                                name="confirmPassword"
                                                id="confirm-password"
                                                variant="outlined"
                                                onBlur={handleBlur}
                                                 />
                                             {errors.confirmPassword && touched.confirmPassword && <div style={{
                                                color: 'red',
                                                fontSize: 14,
                                                position:"absolute"
                                            }}>{errors.confirmPassword}</div>}
                                            </div>
                                            </div>
                                        </div>
                                           <div style={{marginBottom:40}}></div>
                                           <div className="register_wrapper_btn">
                                            <Button 
                                            variant="contained" 
                                            type="submit" 
                                            className="register_btn btn"
                                            disableElevation
                                            >
                                                Register
                                            </Button> 
                                            </div> 

                                        </div>              
                                    </form>

                                
                                );
                            } }
                        </Formik>
                        </div>
                    </div>
                </div>
        </>);
}

export default Register;
