import React, { useEffect, useState } from "react";
import "./editcategory.css";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import Shared from "../../../utils/shared";
import { Formik } from "formik";
import { toast } from "react-toastify";
import categoryService from "../../../Service/category.service";
import { Button, TextField } from "@mui/material";


const EditCategory = () => {
  const navigate = useNavigate();
  const initialValues = { name: "" };
  const [initialValueState, setInitialValueState] = useState(initialValues);
  const { id } = useParams();

  useEffect(() => {
    if (id) getCategoryById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Category Name is required"),
  });

  const getCategoryById = () => {
    categoryService.getById(Number(id)).then((res) => {
      setInitialValueState({
        id: res.id,
        name: res.name,
      });
    });
  };

  const onSubmit = (values) => {
    categoryService
      .save(values)
      .then((res) => {
        toast.success(Shared.messages.UPDATED_SUCCESS);
        navigate("/category");
      })
      .catch((e) => toast.error(Shared.messages.UPDATED_FAIL));
  };

    return(
<div className="container_category_">
    <div className='center_category_'>
        <h1 className="category_header_">
           {id ? "Edit" : "Add" } Category
        <span className="underline_category_"></span>
        </h1>
    </div>

    <div style={{marginTop:50}}></div>

    <Formik
          initialValues={initialValueState}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={onSubmit}
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
              
                <div>
                <div className='label_category'>Category Name *</div>
                  <TextField
                    id="first-name"
                    type='text'
                    name="name"
                    variant="outlined"
                    style={{width:'550px',border: 'none'}}
                    size="small"
                    value={values.name}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  {errors.name && touched.name && <div style={{
                        color: "red",
                        fontSize: 14,
                        position:"absolute"
                    }}>{errors.name}</div>}
                </div>
              
            <div style={{marginBottom:35}}></div>
              <div className="btn_edit_category">
                <Button
                  className="save_category_btn btn"
                  variant="contained"
                  type="submit"
                  disableElevation
                  style={{marginRight:10}}
                >
                  Save
                </Button>
                <Button
                  className="cancel_category_btn btn"
                  variant="contained"
                  type="button"
                  disableElevation
                  onClick={() => {
                    navigate("/category");
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

export default EditCategory;