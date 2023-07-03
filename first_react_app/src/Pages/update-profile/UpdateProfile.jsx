import { toast } from "react-toastify";
import "./updateprofile.css";
import React, { useContext, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import {AuthContext, useAuthContext} from "../../context/auth";
import { Button, TextField } from "@mui/material";
import Shared from "../../utils/shared";
import userService from "../../Service/user.service";

const UpdateProfile = () => {
  const authContext = useAuthContext();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const initialValueState = {
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    newPassword: "",
    confirmPassword: ""
  }

  // const [initialValueState, setinitialValueState] = useState({
  //     email: user.email,
  //     firstName: user.firstName,
  //     lastName: user.lastName,
  //     newPassword: "",
  //     confirmPassword: ""
  //   }
  // );
  const [updatePassword, setUpdatePassword] = useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address format")
      .required("Email is required"),
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    newPassword: Yup.string().min(5, "Minimum 5 charactor is required"),
    confirmPassword: updatePassword
      ? Yup.string()
          .required("Must required")
          .oneOf([Yup.ref("newPassword")], "Passwords is not match")
      : Yup.string().oneOf([Yup.ref("newPassword")], "Passwords is not match"),
  });

  const onSubmit = async (values) => {
    const password = values.newPassword ? values.newPassword : user.password;
    delete values.confirmPassword;
    delete values.newPassword;
    const data = Object.assign(user, { ...values, password });
    const res = await userService.updateProfile(data);
    if (res) {
      authContext.setUser(res);
      toast.success(Shared.messages.UPDATED_SUCCESS);
      navigate("/");
    }
  };

  return(
    <div className="container_profile_">
    <div className='center_profile_'>
        <h1 className="profile_header_">
           Update Profile
        <span className="underline_profile_"></span>
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
            <>
              <form action="" onSubmit={handleSubmit}>
              <div className='sidebyside'>
                <div>
                    <div className='label_profile'>First Name *</div>
                    <TextField
                      id="first-name"
                      type='text'
                      name="firstName"
                      variant="outlined"
                      value={values.firstName}
                      style={{width:'550px',border: 'none'}}
                      size="small"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.firstName && touched.firstName&& <div style={{
                        color: "red",
                        fontSize: 14,
                        position:"absolute"
                    }}>{errors.firstName}</div>}
                </div>

                <div>
                    <div className='label_profile'>Last Name *</div>
                    <TextField
                      type='text'
                      id="last-name"
                      name="lastName"
                      variant="outlined"
                      value={values.lastName}
                      style={{width:'550px',border: 'none'}}
                      size="small"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.lastName && touched.lastName && <div style={{
                        color: "red",
                        fontSize: 14,
                        position:"absolute"
                    }}>{errors.lastName}</div>}
                </div>
              </div>
   
                  <div className='sidebyside'>
                  <div>
                    <div className='label_profile'>Email *</div>
                    <TextField
                      id="email"
                      type='email'
                      name="email"
                      variant="outlined"
                      value={values.email}
                      style={{width:'550px',border: 'none'}}
                      size="small"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                   {errors.email && touched.email && <div style={{
                        color: "red",
                        fontSize: 14,
                        position:"absolute"
                    }}>{errors.email}</div>}
                  </div>
                  <div>
                    <div className='label_profile'>New Password</div>
                    <TextField
                      type='password'
                      id="newPassword"
                      name="newPassword"
                      variant="outlined"
                      value={values.newPassword}
                      style={{width:'550px',border: 'none'}}
                      size="small"
                      onChange={(e) => {
                        e.target.value !== ""
                          ? setUpdatePassword(true)
                          : setUpdatePassword(false);
                        handleChange(e);
                      }}
                      onBlur={handleBlur}
                    />
                    {errors.newPassword && touched.newPassword && <div style={{
                        color: "red",
                        fontSize: 14,
                        position:"absolute"
                    }}>{errors.newPassword}</div>}
                  </div>
                  </div>
                  <div style={{paddingBottom:35}}>
                    <div className='label_profile'>Confirm Password</div>
                    <TextField
                      type='password'
                      id="confirmPassword"
                      name="confirmPassword"
                      variant="outlined"
                      value={values.confirmPassword}
                      style={{width:'550px',border: 'none'}}
                      size="small"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.confirmPassword && touched.confirmPassword && <div style={{
                        color: "red",
                        fontSize: 14,
                        position:"absolute"
                    }}>{errors.confirmPassword}</div>}
                  </div>
                
                <div className="btn_profile">
                  <Button
                    className="save-btn btn"
                    variant="contained"
                    type="submit"
                    style={{marginRight:10}}
                    disableElevation
                    // onClick={() => {
                    //  navigate("/");
                    // }}
                  >
                    Save
                  </Button>
                  <Button
                    className="cancel-btn btn"
                    variant="contained"
                    type="submit"
                    disableElevation
                    onClick={() => {
                      navigate("/");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </>
          )}
        </Formik>

    </div>
  )
}

export default UpdateProfile;