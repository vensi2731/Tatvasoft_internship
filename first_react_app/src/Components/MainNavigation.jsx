import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuthContext } from "../context/auth";
import { RoutePaths } from "../utils/enum";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import BookList from "../Pages/book-listing/BookList";
import Book from "../Pages/bookpage/Book";
import EditBook from "../Pages/bookpage/editbook/EditBook";
import UpdateProfile from "../Pages/update-profile/UpdateProfile";
import Category from "../Pages/category/Category";
import EditCategory from "../Pages/category/editCategory/EditCategory";
import User from "../Pages/user/User";
import EditUser from "../Pages/user/editUser/EditUser";
import Cart from "../Pages/cart/Cart";

const AppRoutes = () => {
  const authContext = useAuthContext();

  const Redirect = <Navigate to={RoutePaths.Login} />;

  return (
    <Routes>
      <Route exact path={RoutePaths.Login} element={<Login />} />
      <Route
        exact
        path={RoutePaths.Register}
        element={!authContext.user.id ? <Register /> : Redirect}
      />
      <Route
        exact
        path={RoutePaths.BookListing}
        element={authContext.user.id ? <BookList /> : Redirect}
      />

      <Route
        exact
        path={RoutePaths.Book}
        element={authContext.user.id ? <Book /> : Redirect}
      />

      <Route
        exact
        path={RoutePaths.EditBook}
        element={authContext.user.id ? <EditBook /> : Redirect}
      />
      <Route
        exact
        path={RoutePaths.AddBook}
        element={authContext.user.id ? <EditBook /> : Redirect}
      />
      <Route
        exact
        path={RoutePaths.UpdateProfile}
        element={authContext.user.id ? <UpdateProfile /> : Redirect}
      />
      <Route
        exact
        path={RoutePaths.Category}
        element={authContext.user.id ? <Category /> : Redirect}
      />
      <Route
        exact
        path={RoutePaths.EditCategory}
        element={authContext.user.id ? <EditCategory /> : Redirect}
      />
      <Route
        exact
        path={RoutePaths.AddCategory}
        element={authContext.user.id ? <EditCategory /> : Redirect}
      />
      <Route
        exact
        path={RoutePaths.User}
        element={authContext.user.id ? <User /> : Redirect}
      />
      <Route
        exact
        path={RoutePaths.EditUser}
        element={authContext.user.id ? <EditUser /> : Redirect}
      />
      <Route
        exact
        path={RoutePaths.Cart}
        element={authContext.user.id ? <Cart /> : Redirect}
      />

    </Routes> 
  );
};

export default AppRoutes;
