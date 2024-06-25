import React from "react";
import Sidebar from "./Sidebar";
import apiInstance from "../../utils/axios";
import { useEffect, useState } from "react";
import UserData from "../plugin/UserData";
import Swal from "sweetalert2";
import moment from "moment";

function Settings() {
    const userData = UserData();

    const [profile, setProfile] = useState({});

    const fetchProfileData = () => {
        apiInstance
            .get(`/user/profile/${userData?.user_id}/`)
            .then((res) => {
                setProfile(res.data);
            })
            .catch((error) => {
                console.error("Failed to fetch profile data:", error);
            });
    };

    useEffect(() => {
        fetchProfileData();
    }, []);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === "email" || name === "phone") {
            setProfile({
                ...profile,
                user: {
                    ...profile.user,
                    [name]: value,
                },
            });
        } else {
            setProfile({
                ...profile,
                [name]: value,
            });
        }
    };

    const handleImageChange = (event) => {
        setProfile({ ...profile, [event.target.name]: event.target.files[0] });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const res = await apiInstance.get(`/user/profile/${userData?.user_id}/`);
        if (profile.image && profile.image !== res.data.profile_image) {
            const formData = new FormData();
            formData.append("image", profile.image);
            formData.append("full_name", profile.full_name);
            // formData.append("email", profile.user.email);
            // formData.append("phone", profile.user.phone);
            formData.append("address", profile.address);
            formData.append("city", profile.city);
            formData.append("state", profile.state);
            formData.append("country", profile.country);

            try {
                await apiInstance.patch(`/user/profile/${userData?.user_id}/`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
            } catch (error) {
                console.error("Failed to update profile:", error);
            }
        }
    };

    return (
        <main className="mt-5">
            <div className="container">
                <section className="">
                    <div className="row">
                        {/* <Sidebar /> */}
                        <Sidebar />
                        <div className="col-lg-9 mt-1">
                            <section className="">
                                <main className="mb-5" style={{}}>
                                    <div className="container px-4">
                                        <section className="">
                                            <h3 className="mb-3">
                                                {" "}
                                                <i className="fas fa-gear fa-spin" /> Settings{" "}
                                            </h3>
                                            <form
                                                encType="multipart/form-data"
                                                onSubmit={handleFormSubmit}
                                            >
                                                <div className="row">
                                                    <div className="col-lg-12">
                                                        <label
                                                            htmlFor="exampleInputEmail1"
                                                            className="form-label"
                                                        >
                                                            Profile Image
                                                        </label>
                                                        <input
                                                            type="file"
                                                            className="form-control"
                                                            aria-describedby="emailHelp"
                                                            onChange={handleImageChange}
                                                            name="image"
                                                            // value={profile?.profile_image || " "}
                                                        />
                                                    </div>
                                                    <div className="col-lg-12 mt-3">
                                                        <label
                                                            htmlFor="exampleInputEmail1"
                                                            className="form-label"
                                                        >
                                                            Full Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            aria-describedby="emailHelp"
                                                            value={profile?.full_name || " "}
                                                            onChange={handleInputChange}
                                                            name="full_name"
                                                        />
                                                    </div>
                                                    <div className="col-lg-6 mt-3">
                                                        <label
                                                            htmlFor="exampleInputEmail1"
                                                            className="form-label"
                                                        >
                                                            Email address
                                                        </label>
                                                        <input
                                                            type="email"
                                                            className="form-control"
                                                            aria-describedby="emailHelp"
                                                            value={profile?.user?.email || " "}
                                                            onChange={handleInputChange}
                                                            name="email"
                                                            readOnly={true}
                                                        />
                                                    </div>
                                                    <div className="col-lg-6 mt-3">
                                                        <label
                                                            htmlFor="exampleInputEmail1"
                                                            className="form-label"
                                                        >
                                                            Mobile
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            aria-describedby="emailHelp"
                                                            value={profile?.user?.phone || " "}
                                                            onChange={handleInputChange}
                                                            name="phone"
                                                            readOnly={true}
                                                        />
                                                    </div>
                                                </div>
                                                <br />
                                                <div className="row">
                                                    <div className="col-lg-6">
                                                        <label
                                                            htmlFor="exampleInputEmail1"
                                                            className="form-label"
                                                        >
                                                            Address
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            aria-describedby="emailHelp"
                                                            value={profile?.address || " "}
                                                            onChange={handleInputChange}
                                                            name="address"
                                                        />
                                                    </div>
                                                    <div className="col-lg-6 ">
                                                        <label
                                                            htmlFor="exampleInputEmail1"
                                                            className="form-label"
                                                        >
                                                            City
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            aria-describedby="emailHelp"
                                                            value={profile?.city || " "}
                                                            onChange={handleInputChange}
                                                            name="city"
                                                        />
                                                    </div>
                                                    <div className="col-lg-6 mt-3">
                                                        <label
                                                            htmlFor="exampleInputEmail1"
                                                            className="form-label"
                                                        >
                                                            State
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            aria-describedby="emailHelp"
                                                            value={profile?.state || " "}
                                                            onChange={handleInputChange}
                                                            name="state"
                                                        />
                                                    </div>
                                                    <div className="col-lg-6 mt-3">
                                                        <label
                                                            htmlFor="exampleInputEmail1"
                                                            className="form-label"
                                                        >
                                                            Country
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            aria-describedby="emailHelp"
                                                            value={profile?.country || " "}
                                                            onChange={handleInputChange}
                                                            name="country"
                                                        />
                                                    </div>
                                                </div>
                                                <button
                                                    type="submit"
                                                    className="btn btn-primary mt-5"
                                                >
                                                    Save Changes
                                                </button>
                                            </form>
                                        </section>
                                    </div>
                                </main>
                            </section>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}

export default Settings;