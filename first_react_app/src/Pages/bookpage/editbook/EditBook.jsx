import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./editbook.css";
import { Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Shared from "../../../utils/shared";
import bookService from "../../../Service/book.service";
import { Button,MenuItem, Select, TextField } from "@mui/material";
import categoryService from "../../../Service/category.service";


const EditBook = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const initialValues = {
    name: "",
    price: "",
    categoryId: 0,
    description: "",
    base64image: "",
    };

    useEffect(() => {
        if (id) getBookById();
        categoryService.getAll().then((res) => {
          setCategories(res);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [id]);

    const [initialValueState, setInitialValueState] = useState(initialValues);
    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Book Name is required"),
        description: Yup.string().required("Description is required"),
        categoryId: Yup.number()
          .min(1, "Category is required")
          .required("Category is required"),
        price: Yup.number().required("Price is required"),
        base64image: Yup.string().required("Image is required"),
      });

      const getBookById = () => {
        bookService.getById(Number(id)).then((res) => {
          setInitialValueState({
            id: res.id,
            name: res.name,
            price: res.price,
            categoryId: res.categoryId,
            description: res.description,
            base64image: res.base64image,
          });
        });
      };

      const onSubmit = (values) => {
        bookService
          .save(values)
          .then((res) => {
            toast.success(
              values.id
                ? Shared.messages.UPDATED_SUCCESS
                : "Record created successfully"
            );
            navigate("/book");
          })
          .catch((e) => toast.error(Shared.messages.UPDATED_FAIL));
      };

      const onSelectFile = (e, setFieldValue, setFieldError) => {
        const files = e.target.files;
        if (files?.length) {
          const fileSelected = e.target.files[0];
          const fileNameArray = fileSelected.name.split(".");
          const extension = fileNameArray.pop();
          if (["png", "jpg", "jpeg"].includes(extension?.toLowerCase())) {
            if (fileSelected.size > 50000) {
              toast.error("File size must be less then 50KB");
              return;
            }
            const reader = new FileReader();
            reader.readAsDataURL(fileSelected);
            reader.onload = function () {
              setFieldValue("base64image", reader.result);
            };
            reader.onerror = function (error) {
              throw error;
            };
          } else {
            toast.error("only jpg,jpeg and png files are allowed");
          }
        } else {
          setFieldValue("base64image", "");
        }
      };
   return(
<div className="container_bookpage_">
    <div className='center_bookpage_'>
        <h1 className="bookpage_header_">
           {id ? "Edit" : "Add" } Book
        <span className="underline_bookpage_"></span>
        </h1>
    </div>
    
    <div style={{marginTop:50}}>
        
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
            setValues,
            setFieldError,
            setFieldValue,
        }) => (
            <form onSubmit={handleSubmit}>

                <div className='side_by_side'>
                    <div>
                        <div className='label_book'>Book Name *</div>
                        <TextField
                            id="first-name"
                            type='text'
                            name="name"
                            size="small"
                            variant="outlined"
                            style={{width:'550px',border: 'none'}}
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

                    <div>
                        <div className='label_book'>Book Price (RS)*</div>
                        <TextField
                            id="price"
                            type={"number"}
                            name="price"
                            size="small"
                            variant="outlined"
                            style={{width:'550px',border: 'none'}}
                            value={values.price}
                            onBlur={handleBlur}
                            onChange={handleChange}
                        />
                            {errors.price && touched.price && <div style={{
                                color: "red",
                                fontSize: 14,
                                position:"absolute"
                            }}>{errors.price}</div>}
                    </div> 
                </div>

                <div className='side_by_side'>
                    <div>
                        
                        <div className='label_book'>Category *</div>
                        <Select
                            name={"categoryId"}
                            id={"category"}
                            onChange={handleChange}
                            value={values.categoryId}
                            style={{width:'550px'}}
                            size="small"
                        >
                        {categories?.map((rl) => (
                        <MenuItem value={rl.id} key={"category" + rl.id}>
                          {rl.name}
                        </MenuItem>
                        ))}
                        </Select>
                        
                        {errors.categoryId && touched.categoryId && <div style={{
                                color: "red",
                                fontSize: 14,
                                position:"absolute"
                            }}>{errors.categoryId}</div>}
                        </div>


                        <div style={{paddingTop:35}} className="formm">
                            {!values.base64image && (
                            <>
                             {" "}
                                <label
                                    htmlFor="contained-button-file"
                                    className="file-upload-btn"
                                >
                                <TextField
                                    id="contained-button-file"
                                    type="file"
                                    size="small"
                                    style={{width:'550px'}}
                                    onBlur={handleBlur}
                                    onChange={(e) => {
                                        onSelectFile(e, setFieldValue, setFieldError);
                                    }}
                                />
                                <Button
                                    variant="contained"
                                    component="span"
                                    className="btn upload_btn"
                                    onChange={(e) => {
                                        onSelectFile(e, setFieldValue, setFieldError);
                                    }}
                                >
                                    Upload
                                </Button>
                                </label>
                                {errors.base64image && touched.base64image && <div style={{
                                    color: "red",
                                    fontSize: 14,
                                    position:"absolute"
                                }}>{errors.base64image}</div>}
                      
                            </>
                           )}   
                                {values.base64image && (
                                    <div className="uploaded-file-name" >
                                        
                                        <em>
                                            <img src={values.base64image} alt="" style={{marginTop:43}} />
                                        </em>

                                         <div style={{marginInline:5,marginTop:44}}>image{" "}</div>
                                        <span
                                            onClick={() => {
                                                setFieldValue("base64image", "");
                                            }}
                                            style={{marginTop:32}}
                                        >
                                            x
                                        </span>
                                        
                                    </div>
                                )}
                                
                        </div>
                    </div> 

                    <div style={{marginBottom:35}}>
                        <div className='label_book'>Description *</div>
                        <TextField
                            id="description"
                            name="description"
                            variant="outlined"
                            value={values.description}
                            multiline
                            rows={2}
                            style={{width:1140}}
                            onBlur={handleBlur}
                            onChange={handleChange}
                        />
                        {errors.description && touched.description && <div style={{
                                color: "red",
                                fontSize: 14,
                                position:"absolute"
                        }}>{errors.description}</div>}
                    </div>
                
                    <div className="btn_add_edit">
                        <Button
                            className="save_btn btn"
                            variant="contained"
                            type="submit"
                            disableElevation
                            style={{marginRight:10}}
                        >
                            Save
                        </Button>
                        <Button
                            className="cancel_btn btn"
                            variant="contained"
                            type="button"
                            disableElevation
                            onClick={() => {
                                navigate("/book");
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
            </form>
        )}

    </Formik>
    </div>
</div>
   )
};

export default EditBook;