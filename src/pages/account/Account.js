import React, { useCallback, useEffect, useState } from "react";
import Header from "../../component/core/Header";
import Footer from "../../component/core/Footer";
import { Link, useNavigate } from "react-router-dom";
import ContactUs from "../contactUs/ContactUs";
import {
  addressAdd,
  addressRemove,
  listAdress,
  profilePic,
} from "./accountSlice";
import { useDispatch } from "react-redux";
import {
  getProfile,
  passwordChange,
  removeToken,
  useUserProfile,
} from "../../component/auth/authSlice";
import { addClass, removeClass } from "../../asset/js/script";
import { ProgressSpinner } from "primereact/progressspinner";
import * as Yup from "yup";
import { useFormik } from "formik";
import { ToastContainer, toast } from "react-toastify";
import { imageType } from "../../shared/constants";
import { baseUrl, s3Url } from "../../api/baseUrl";
import { listAllUserOrder } from "../Admin/orderSlice";
import { Country, State, City } from "country-state-city";

import { Tooltip } from 'primereact/tooltip';
import { InputText } from 'primereact/inputtext';

import axios from "axios";

export default function Account() {
  const dispatch = useDispatch();

  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pic, setPic] = useState("");
  const [addressData, setAddressData] = useState({});
  const [orderData, setOrderData] = useState([]);
  const [addressList, setAddressList] = useState([]);
  const { profile_pic } = useUserProfile();
  const [phoneCode, setPhoneCode] = useState("");
  const [phone, setPhone] = useState("");
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  // console.log("user : ", userDetails);
  // const user = userDetails?.user;
  // const logout = () => {
  // 	window.open(`${process.env.REACT_APP_API}/api/logout`, "_self");
  // };

  const getCities = async (sta) => {
    try {
      const res = City.getCitiesOfState(sta.countryCode, sta.isoCode).map(
        (city) => ({
          name: city.name,
        })
      );
      // const response = await axios.get(
      //   "https://api.countrystatecity.in/v1/countries",
      //   requestOptions
      // );
      setCityList(res);
    } catch (err) {
      // console.log(err);
    }
  };

  const getStates = (code) => {
    try {
      const res = State.getStatesOfCountry(code.isoCode).map((state) => ({
        countryCode: state.countryCode,
        isoCode: state.isoCode,
        name: state.name,
      }));
      console.log(res[0].name);
      // const response = axios.get(
      //   "https://api.countrystatecity.in/v1/countries",
      //   requestOptions
      // );
      // addressFormik.values.state = res[0].name;
      setStateList(res);
    } catch (err) {
      // console.log(err);
    }
  };

  const getCountries = () => {
    const res = Country.getAllCountries();
    // addressFormik.values.country = res[0].name;
    setCountryList(res);
    // const headers = new Headers();

    // headers.append("Accept", "application/json");
    // headers.append(
    //   "api-token",
    //   "4miVsswg2DCCrhKDf1WJFtw-kGO4fqmJg1tnYOshmDrRg379uOHIQoU55aj6ZhBSfoU"
    // );
    // headers.append("user-email", "lukhidixit149@gmail.com");
    // // req.headers({
    // try {
    //   var accessToken = await axios.get(
    //     "https://www.universal-tutorial.com/api/getaccesstoken",
    //     { header: headers }
    //   );

    //   console.log(accessToken);
    //   // var req = await axios.get("https://www.universal-tutorial.com/api/getaccesstoken", headers);
    //   // console.log(req);
    //   getStates();
    // } catch (error) {
    //   console.log(error);
    // }
    //   "Authorization": "Bearer 4miVsswg2DCCrhKDf1WJFtw-kGO4fqmJg1tnYOshmDrRg379uOHIQoU55aj6ZhBSfoU",
    //   "Accept": "application/json"
    // });

    // try {
    //   const response = await axios.get("https://api.countrystatecity.in/v1/countries", requestOptions);
    //   console.log("country : ", response);
    //   setCountryList(response);
    //   getStates();
    // } catch (err) {
    //   console.log(err);
    // }
  };
  const passInitialState = {
    password: "",
    confirm_password: "",
  };

  const addressInitialState = {
    addressid: "",
    first_name: "",
    last_name: "",
    company: "",
    address1: "",
    address2: "",
    city: "",
    post_code: "",
    country: "",
    state: "",
    mobile: "",
    default_address: "",
  };

  const addressValidationSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "Too Short!")
      .max(40, "Too Long!")
      .required("Category is required*"),
  });

  const handelAddAddress = async (values) => {
    // setLoading(true);
    values.mobile = phoneCode + phone;

    try {
      const payload = Object.assign({}, values);
      const response = await dispatch(addressAdd(payload)).unwrap();
      if (response.data?.IsSuccess) {
        toast.success(response.data.Message);
        getUserAddress();
        addressFormik.resetForm();
        // toast.success("Registered successfully.")
        // setTimeout(() => {
        // navigate(`/verificationcode`);
        // localStorage.setItem("email", response.data.Data.email);
        // }, 1000);
      } else {
        // toast.error(response.data.Message);
      }
    } catch (error) {
      // toast.error("something Went to Wrong!!");
    }
  };

  const handelProflePic = async (event) => {
    const size = 2;
    let selected = event.target.files[0];

    try {
      if (selected && imageType.includes(selected.type)) {
        if (selected.size < size * 1024 * 1024) {
          const formData = new FormData();
          formData.append("file", selected);
          // let uploadUrl;

          if (typeof selected === "object") {
            const response = await dispatch(profilePic(formData)).unwrap();
            if (response.data.IsSuccess) {
              // uploadUrl = response.data.Data.url;
              getUserProfile();
              // setPic(response.data.Data.url);
            }
          }
        } else {
          console.log("File size should be <= 2 MB");
        }
      } else {
        // setErrorMessage(`${intl.formatMessage({ id: "PLEASE SELECT VALID IMAGE FILE." })}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handelRemoveAddress = async (id) => {
    // setLoading(true);

    try {
      const payload = { addressid: id };
      const response = await dispatch(addressRemove(payload)).unwrap();
      if (response.data?.IsSuccess) {
        getUserAddress();
        // toast.success("Registered successfully.")
        // setTimeout(() => {
        // navigate(`/verificationcode`);
        // localStorage.setItem("email", response.data.Data.email);
        // }, 1000);
      } else {
        // toast.error(response.data.Message);
      }
    } catch (error) {
      // toast.error("something Went to Wrong!!");
    }
  };

  const handelPassword = async (values) => {
    // setLoading(true);
    console.log(values);
    if (values.password === values.confirm_password) {
      try {
        const payload = { old_password: "", new_password: values.password };
        const response = await dispatch(passwordChange(payload)).unwrap();
        if (response.data?.IsSuccess) {
          // toast.success("Registered successfully.")
        } else {
          // toast.error(response.data.Message);
        }
      } catch (error) {
        // toast.error("something Went to Wrong!!");
      }
    } else {
      console.log("password does not match");
    }
  };

  const addressFormik = useFormik({
    initialValues: addressInitialState,
    // validationSchema: validationSchema,
    onSubmit: handelAddAddress,
  });

  const setAddressInputValue = useCallback(
    (key, value) =>
      addressFormik.setValues({
        ...addressFormik.values,
        [key]: value,
      }),
    [addressFormik]
  );

  const passFormik = useFormik({
    initialValues: passInitialState,
    // validationSchema: validationSchema,
    onSubmit: handelPassword,
  });

  const setPassInputValue = useCallback(
    (key, value) =>
      passFormik.setValues({
        ...passFormik.values,
        [key]: value,
      }),
    [passFormik]
  );

  const getUserProfile = async () => {
    try {
      const response = await dispatch(getProfile()).unwrap();
      if (response.data.IsSuccess) {
        setUser(response.data.Data);
        setLoading(false);
      } else {
        console.log(response.data.Message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUserAddress = async () => {
    try {
      const response = await dispatch(listAdress()).unwrap();
      if (response.data.IsSuccess) {
        setAddressList(response.data.Data);
      } else {
        console.log(response.data.Message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUserOrder = async () => {
    try {
      const response = await dispatch(listAllUserOrder()).unwrap();
      if (response.data.IsSuccess) {
        setOrderData(response.data.Data?.purchases);
      } else {
        console.log(response.data.Message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddressValue = (add) => {
    addressFormik.values.addressid = add?._id;
    addressFormik.values.first_name = add?.first_name;
    addressFormik.values.last_name = add?.last_name;
    addressFormik.values.company = add?.company;
    addressFormik.values.address1 = add?.address1;
    addressFormik.values.address2 = add?.address2;
    addressFormik.values.city = add?.city;
    addressFormik.values.post_code = add?.post_code;
    addressFormik.values.country = add?.country;
    addressFormik.values.state = add?.state;
    addressFormik.values.default_address = add?.default_address;
    setAddressInputValue("addressid", add?._id);
  };
  useEffect(() => {
    getUserProfile();
    getUserAddress();
    getUserOrder();
    getCountries();
  }, []);

  const handleLogout = async () => {
    // window.open(`${baseUrl}/api/logout`, "_self");
    dispatch(removeToken());
    // await axios.get(`${baseUrl}/api/logout`);

    navigate("/");
  };
  return (
    <>
      <Header />

      <section className="border border-b border-black">
        <div className="p-5 md:py-12 flex flex-wrap items-center justify-center gap-5">
          <button
            className="btn bg-black text-white hover:opacity-75 btn-dark"
            onClick={() => {
              addClass("#Addresses", "hidden");
              addClass("#Order", "hidden");
              removeClass("#Profile", "hidden");
            }}
          >
            Profile
          </button>
          <button
            className="btn bg-black text-white hover:opacity-75"
            onClick={() => {
              addClass("#Profile", "hidden");
              addClass("#Order", "hidden");
              removeClass("#Addresses", "hidden");
            }}
          >
            Address
          </button>
          <button
            className="btn bg-black text-white hover:opacity-75"
            onClick={() => {
              addClass("#Addresses", "hidden");
              addClass("#Profile", "hidden");
              removeClass("#Order", "hidden");
            }}
          >
            Order
          </button>
          <button
            className="btn bg-black text-white hover:opacity-75"
            onClick={() => handleLogout()}
          >
            Logout
          </button>
        </div>
      </section>

      {loading ? (
        <>
          <div className="fixed inset-0 flex items-center justify-center backdrop-blur z-40">
            <ProgressSpinner
              style={{ width: "50px", height: "50px" }}
              strokeWidth="8"
              fill="var(--surface-ground)"
              animationDuration=".5s"
            />
          </div>
        </>
      ) : (
        <>
          {/* <!-- Profile [S] --> */}
          <section id="Profile" className="bg-white dark:bg-gray-900">
            <div className="container px-6 py-7 md:py-12 lg:py-16 xl:py-24 mx-auto">
              <div className="title space-y-4 text-center">
                <div className="flex items-center justify-center space-x-4 text-yellow-600">
                  <span className="h-px bg-current w-16"></span>
                  <p className="text-current font-play">Profile</p>
                  <span className="h-px bg-current w-16"></span>
                </div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-play font-bold text-black xl:text-5xl dark:text-white">
                  My Account
                </h2>
              </div>
              {/*  profile pic */}
              <div className="w-32 h-32 p-1 mx-auto mt-10 border-2 border-gray-400 bg-white rounded-md relative group">
                {profile_pic && profile_pic !== "" ? (
                  <img
                    src={
                      profile_pic && profile_pic !== ""
                        ? s3Url + profile_pic
                        : "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80"
                    }
                    className="object-cover w-full h-full"
                    alt="avatar"
                  />
                ) : (
                  <div className="profile-picture">
                    {user?.first_name?.toString().charAt(0).toUpperCase()}
                  </div>
                )}
                <label
                  htmlFor="upload"
                  className="upload upload-popup opacity-0 group-hover:opacity-100 absolute inset-0 m-auto w-6 h-6 border rounded-md flex items-center justify-center cursor-pointer bg-dark transition-all duration-300"
                >
                  <input
                    type="file"
                    name="images"
                    id="upload"
                    className="appearance-none hidden"
                    onChange={handelProflePic}
                  />
                  <svg
                    className="w-full h-full"
                    xmlns="http://www.w3.org/2000/svg"
                    width="800"
                    height="800"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="#000"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M21.28 6.4l-9.54 9.54c-.95.95-3.77 1.39-4.4.76-.63-.63-.2-3.45.75-4.4l9.55-9.55a2.58 2.58 0 113.64 3.65v0z"
                    ></path>
                    <path
                      stroke="#000"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M11 4H6a4 4 0 00-4 4v10a4 4 0 004 4h11c2.21 0 3-1.8 3-4v-5"
                    ></path>
                  </svg>
                </label>
              </div>
              {/*  profile pic */}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-10">
                <div className="flex flex-col text-left lg:p-5 space-y-6">
                  <div className="">
                    <h2 className="text-3xl font-play font-bold text-black xl:text-4xl dark:text-white">
                      Change Password
                    </h2>
                    <span className="block w-60 h-1 btn-dark mt-3 mb-7"></span>
                  </div>
                  <form
                    onSubmit={passFormik.handleSubmit}
                    className="space-y-6"
                  >
                    <div className="flex flex-col space-y-2">
                      <label className="" htmlFor="Password">
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        id="Password"
                        placeholder="Password"
                        onChange={(e) =>
                          setPassInputValue("password", e.target.value)
                        }
                        className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                      />
                    </div>
                    <div className="flex flex-col space-y-2">
                      <label
                        className="block mb-2 text-sm text-gray-600 dark:text-gray-200"
                        htmlFor="PasswordConfirm"
                      >
                        Password Confirm
                      </label>
                      <input
                        type="password"
                        name="passwordConfirm"
                        id="PasswordConfirm"
                        placeholder="PasswordConfirm"
                        onChange={(e) =>
                          setPassInputValue("confirm_password", e.target.value)
                        }
                        className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                      />
                    </div>
                    <button type="submit" className="btn btn-dark w-full py-4">
                      UPDATE PASSWORD
                    </button>
                  </form>
                </div>
                <div className="flex flex-col text-left lg:p-5 space-y-6">
                  <div className="">
                    <h2 className="text-3xl font-play font-bold text-black xl:text-4xl dark:text-white">
                      My Account Information
                    </h2>
                    <span className="block w-60 h-1 btn-dark mt-3 mb-7"></span>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label
                      className="block mb-2 text-sm text-gray-600 dark:text-gray-200"
                      htmlFor="FirstName"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      name="first-name"
                      id="FirstName"
                      placeholder="First Name"
                      className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                      value={user.first_name}
                      disabled
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label
                      className="block mb-2 text-sm text-gray-600 dark:text-gray-200"
                      htmlFor="LastName"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="last-name"
                      id="LastName"
                      placeholder="Last Name"
                      className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                      value={user.last_name}
                      disabled
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label
                      className="block mb-2 text-sm text-gray-600 dark:text-gray-200"
                      htmlFor="EMail"
                    >
                      E-mail
                    </label>
                    <input
                      type="email"
                      name="e-mail"
                      id="EMail"
                      placeholder="email"
                      className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                      value={user.email}
                      disabled
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label
                      className="block mb-2 text-sm text-gray-600 dark:text-gray-200"
                      htmlFor="MobileNumber"
                    >
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      name="mobile-number"
                      id="MobileNumber"
                      placeholder="Mobile Number"
                      className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                      value={user?.mobile}
                      disabled
                    />
                  </div>
                  {/* <button className="btn btn-dark w-full py-4">SAVE PROFILE</button> */}
                </div>
              </div>
            </div>
          </section>
          {/* <!-- Profile [E] --> */}
        </>
      )}
      {/* <!-- My Addresses [S] --> */}
      <section id="Addresses" className="bg-white dark:bg-gray-900 hidden">
        <div className="container px-6 py-7 md:py-12 lg:py-16 xl:py-24 mx-auto">
          <div className="title space-y-4 text-center">
            <div className="flex items-center justify-center space-x-4 text-yellow-600">
              <span className="h-px bg-current w-16"></span>
              <p className="text-current font-play">Address</p>
              <span className="h-px bg-current w-16"></span>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-play font-bold text-black xl:text-5xl dark:text-white">
              Address Book
            </h2>
          </div>
          <div className="flex flex-wrap items-start mt-10">
            <div className="w-full lg:w-1/2 flex flex-col text-left lg:p-5 space-y-6">
              <div className="">
                <h2 className="text-3xl font-play font-bold text-black xl:text-4xl dark:text-white">
                  Address Book
                </h2>
                <span className="block w-60 h-1 btn-dark mt-3 mb-7"></span>
              </div>
              {addressList?.length > 0 ? (
                <>
                  {addressList.map((add) => (
                    <>
                      <div
                        key={add._id}
                        className="flex flex-col sm:flex-row items-end justify-between border border-black rounded-md p-5 space-y-2"
                      >
                        <div className="flex flex-col space-y-0.5">
                          <p>
                            {add.first_name} {add.last_name}
                          </p>
                          {/* <p>{add.company}</p> */}
                          <p>{add.address1}</p>
                          <p>{add.address2}</p>
                          <p>
                            {add.city} {add.post_code}
                          </p>
                          <p>{add.state}</p>
                          <p>{add.country}</p>
                          <p>{add.mobile}</p>
                        </div>
                        <div className="flex sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2">
                          <p>{add.default_address === true ? "Default" : ""}</p>
                          <button
                            className="btn btn-dark w-full"
                            onClick={() => handleAddressValue(add)}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handelRemoveAddress(add._id)}
                            className="btn btn-dark w-full"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </>
                  ))}
                </>
              ) : (
                ""
              )}
            </div>
            <form
              onSubmit={addressFormik.handleSubmit}
              className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-5 text-left lg:p-5"
            >
              <div className="sm:col-span-2">
                <h2 className="text-3xl font-play font-bold text-black xl:text-4xl dark:text-white">
                  Add / Update Address
                </h2>
                <span className="block w-60 h-1 btn-dark mt-3 mb-7"></span>
              </div>
              <div className="flex flex-col space-y-2">
                <label
                  className="block mb-2 text-sm text-gray-600 dark:text-gray-200"
                  htmlFor="Country"
                >
                  Country
                </label>
                {/* <input
                  type="text"
                  name="country"
                  id="Country"
                  value={addressFormik.values.country}
                  onChange={(e) =>
                    setAddressInputValue("country", e.target.value)
                  }
                  placeholder="Country"
                  className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                /> */}
                <select
                          className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                          onChange={(e) => {
                            setAddressInputValue(
                              "country",
                              JSON.parse(e.target.value).name
                            );
                            setPhoneCode(JSON.parse(e.target.value).phonecode);
                            getStates(JSON.parse(e.target.value));
                          }}
                        >
                          {countryList &&
                            countryList.length > 0 &&
                            countryList.map((cn, index) => (
                              <option key={index} value={JSON.stringify(cn)}>
                                {cn.name}
                              </option>
                            ))}
                        </select>
              </div>
              <div className="flex flex-col space-y-2">
                <label
                  className="block mb-2 text-sm text-gray-600 dark:text-gray-200"
                  htmlFor="FirstName"
                >
                  First Name
                </label>
                <input
                  type="text"
                  name="first-name"
                  id="FirstName"
                  value={addressFormik.values.first_name}
                  onChange={(e) =>
                    setAddressInputValue("first_name", e.target.value)
                  }
                  placeholder="First Name"
                  className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label
                  className="block mb-2 text-sm text-gray-600 dark:text-gray-200"
                  htmlFor="LastName"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  name="last-name"
                  id="LastName"
                  placeholder="Last Name"
                  value={addressFormik.values.last_name}
                  onChange={(e) =>
                    setAddressInputValue("last_name", e.target.value)
                  }
                  className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                />
              </div>
              {/* <div className="flex flex-col space-y-2 sm:col-span-2">
                <label
                  className="block mb-2 text-sm text-gray-600 dark:text-gray-200"
                  htmlFor="Company"
                >
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  id="Company"
                  value={addressFormik.values.company}
                  onChange={(e) =>
                    setAddressInputValue("company", e.target.value)
                  }
                  placeholder="Company"
                  className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                />
              </div> */}
              <div className="flex flex-col space-y-2 sm:col-span-2">
                <label
                  className="block mb-2 text-sm text-gray-600 dark:text-gray-200"
                  htmlFor="Address1"
                >
                  Address 1
                </label>
                <input
                  type="text"
                  name="address-1"
                  id="Address1"
                  value={addressFormik.values.address1}
                  onChange={(e) =>
                    setAddressInputValue("address1", e.target.value)
                  }
                  placeholder="Address 1"
                  className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                />
              </div>
              <div className="flex flex-col space-y-2 sm:col-span-2">
                <label
                  className="block mb-2 text-sm text-gray-600 dark:text-gray-200"
                  htmlFor="Address2"
                >
                  Address 2
                </label>
                <input
                  type="text"
                  name="address-2"
                  id="Address2"
                  value={addressFormik.values.address2}
                  onChange={(e) =>
                    setAddressInputValue("address2", e.target.value)
                  }
                  placeholder="Address 2"
                  className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label
                  className="block mb-2 text-sm text-gray-600 dark:text-gray-200"
                  htmlFor="RegionState"
                >
                  Region / State
                </label>
                <select
                          className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                          onChange={(e) => {
                            setAddressInputValue(
                              "state",
                              JSON.parse(e.target.value).name
                            );
                            getCities(JSON.parse(e.target.value));
                          }}
                        >
                          {stateList &&
                            stateList.length > 0 &&
                            stateList.map((st, index) => (
                              <option key={index} value={JSON.stringify(st)}>
                                {st.name}
                              </option>
                            ))}
                        </select>
              </div>
              <div className="flex flex-col space-y-2">
                <label
                  className="block mb-2 text-sm text-gray-600 dark:text-gray-200"
                  htmlFor="City"
                >
                  City
                </label>
                <select
                          className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                          onChange={(e) =>
                            setAddressInputValue("city", e.target.value)
                          }
                        >
                          {cityList &&
                            cityList.length > 0 &&
                            cityList.map((ct, index) => (
                              <option key={index} value={ct.name}>
                                {ct.name}
                              </option>
                            ))}{" "}
                        </select>
              </div>
              <div className="flex flex-col space-y-2">
                <label
                  className="block mb-2 text-sm text-gray-600 dark:text-gray-200"
                  htmlFor="PostCode"
                >
                  Post Code
                </label>
                <input
                  type="text"
                  name="post-code"
                  id="PostCode"
                  value={addressFormik.values.post_code}
                  onChange={(e) =>
                    setAddressInputValue("post_code", e.target.value)
                  }
                  placeholder="Post Code"
                  className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                />
              </div>

              <div>
                <label className="block mb-1 text-gray-600 dark:text-gray-200">
                  Phone number
                </label>
                <input
                  type="text"
                  placeholder=""
                  className="block w-full px-5 py-3 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-400 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 focus:border-yellow-400 dark:focus:border-yellow-400 focus:ring-yellow-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  readOnly
                  value={phoneCode}
                  // onChange={(e) =>
                  //   setAddressInputValue("mobile", e.target.value)
                  // }
                />
                <input
                  type="text"
                  placeholder="XXX-XX-XXXX-XXX"
                  className="block w-full px-5 py-3 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-400 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 focus:border-yellow-400 dark:focus:border-yellow-400 focus:ring-yellow-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              
              <Tooltip target=".phone-tooltip" />

<div className="phone-tooltip" data-pr-tooltip="Incase we need to contanct about your order"
data-pr-position="right">Q</div>
              <div className="flex flex-col space-y-2 sm:col-span-2">
                <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                  Default Address
                </label>
                {addressFormik.values.default_address}
                <div className="flex items-center space-x-7">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="default-address"
                      checked={
                        addressFormik.values.default_address === true
                          ? true
                          : false
                      }
                      onChange={(e) =>
                        setAddressInputValue("default_address", true)
                      }
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="default-address"
                      checked={
                        addressFormik.values.default_address === false
                          ? true
                          : false
                      }
                      onChange={(e) =>
                        setAddressInputValue("default_address", false)
                      }
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-dark w-full py-4 sm:col-span-2"
              >
                SAVE
              </button>
            </form>
          </div>
        </div>
      </section>
      {/* <!-- My Addresses [E] --> */}

      {/* Order [S] */}
      <section id="Order" className="bg-white dark:bg-gray-900">
        <div className="container px-6 py-7 md:py-12 lg:py-16 xl:py-24 mx-auto">
          <div className="title space-y-4 text-center">
            <div className="flex items-center justify-center space-x-4 text-yellow-600">
              <span className="h-px bg-current w-16"></span>
              <p className="text-current font-play">Profile</p>
              <span className="h-px bg-current w-16"></span>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-play font-bold text-black xl:text-5xl dark:text-white">
              My Order
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-10">
            <div className="flex flex-col text-left lg:p-5 space-y-6">
              <div className="">
                <h2 className="text-3xl font-play font-bold text-black xl:text-4xl dark:text-white">
                  My Order Information
                </h2>
                <span className="block w-60 h-1 btn-dark mt-3 mb-7"></span>
              </div>
              {orderData?.length > 0 ? (
                <>
                  {orderData.map((ord) => (
                    <>
                      <div className="flex items-center flex-wrap cart-row py-3.5">
                        <div className="cart-col cart-product">
                          <div className="flex items-center media">
                            <div className="mr-5 prod-img">
                              <img
                                alt=""
                                className="img-fluid item-img border"
                                src={
                                  ord?.metalid?.photos[0]?.url
                                    ? s3Url + ord?.metalid?.photos[0]?.url
                                    : ""
                                }
                              />
                            </div>
                            <div className="media-body">
                              <h6 className="text-xs mb-0 font-play sm:text-sm uppercase">
                                <Link
                                  className="hover:opacity-75"
                                  to={`/product-details?productid=${ord?.metalid?.productid?._id}&metal=${ord?.metalid?.metal}`}
                                >
                                  {ord?.metalid?.productid?.header_name}
                                </Link>
                              </h6>
                            </div>
                          </div>
                        </div>
                        <div className="cart-col md:text-left cart-clr text-center">
                          <div className="text-xs clr-swch">
                            <p className="mb-0">
                              <span
                                className="clr"
                                style={{ background: "#ff6969" }}
                              ></span>{" "}
                              <span className="ml-1">
                                {ord?.metalid?.metal}
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="cart-col md:text-left text-right cart-total">
                          <span className="text-xs amount tracking-wider">
                            $ {ord?.material_wise?.special_price}
                          </span>
                        </div>
                      </div>
                    </>
                  ))}
                </>
              ) : (
                <h2 className="text-3xl font-play font-bold text-black xl:text-4xl dark:text-white">
                  No order yet
                </h2>
              )}
              {/* <button className="btn btn-dark w-full py-4">SAVE PROFILE</button> */}
            </div>
          </div>
        </div>
      </section>
      {/* Order [E] */}
      {/* <ContactUs /> */}
      <Footer />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}
