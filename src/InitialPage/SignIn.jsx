/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { LoginImage, Logo, MailIcon } from "../EntryFile/imagePath";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { adminApiInstance } from "../api/axios";
import { useStorage } from "../constants/storage.tsx";

const SignInPage = (props) => {
  const [eye, setEye] = useState(true);
  const [loading, setLoading] = useState(false); // State variable for loading
  const { setItem } = useStorage();

  const onEyeClick = () => {
    setEye(!eye);
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email is required").email("Email is invalid"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters")
      .max(20, "Password must not exceed 20 characters"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true); // Start loading
      // Make API request to your login endpoint using adminApiInstance
      const response = await adminApiInstance.post("/login", data);
      if (response.data) {
        setItem("user", response.data);
        props.history.push("/dream-pos/dashboard");
      }
    } catch (error) {
      console.error(error.response.data.errMsg);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("reloaded")) {
      localStorage.setItem("reloaded", true);
      window.location.reload();
    }
  }, []);

  return (
    <>
      <div className="main-wrapper">
        <Helmet>
          <title>SignIn</title>
          <meta name="description" content="SignIn page" />
        </Helmet>
        <div className="account-content">
          <div className="login-wrapper">
            <div className="login-content">
              <div className="login-userset">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="login-logo">
                    <img src={Logo} alt="img" />
                  </div>
                  <div className="login-userheading">
                    <h3>Sign In</h3>
                    <h4>Please login to your account</h4>
                  </div>
                  <div className="form-login">
                    <label>Email</label>
                    <div className="form-addons">
                      <input
                        type="text"
                        {...register("email")}
                        className={` ${errors.email ? "is-invalid" : ""}`}
                        placeholder="Enter your email address"
                      />
                      <img src={MailIcon} alt="img" />
                      <div className="invalid-feedback">
                        {errors.email?.message}
                      </div>
                    </div>
                  </div>
                  <div className="form-login">
                    <label>Password</label>
                    <div className="pass-group">
                      <input
                        type={eye ? "password" : "text"}
                        className={` ${errors.password ? "is-invalid" : ""}`}
                        placeholder="Enter your password"
                        {...register("password")}
                      />
                      <span
                        onClick={onEyeClick}
                        className={`fas toggle-password ${
                          eye ? "fa-eye-slash" : "fa-eye"
                        } `}
                      />
                      <div className="invalid-feedback">
                        {errors.password?.message}
                      </div>
                    </div>
                  </div>
                  
                  <div className="form-login">
                    <button className="btn btn-login" disabled={loading}>
                      {loading && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>}
                      Sign In
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="login-img">
              <img src={LoginImage} alt="img" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignInPage;
