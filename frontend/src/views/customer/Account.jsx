import React from "react";
import Sidebar from "./Sidebar";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiInstance from "../../utils/axios";
import UserData from "../plugin/UserData";

function Account() {
    const [profile, setProfile] = useState({});
    const userData = UserData();

    useEffect(() => {
        if (userData) {
            apiInstance
                .get(`/user/profile/${userData.user_id}/`)
                .then((res) => {
                    setProfile(res.data);
                    console.log(res.data);
                })
                .catch((error) => {
                    console.error("Failed to fetch user data:", error);
                });
        }
    }, []);

    return (
        <main className="mt-5">
            <div className="container">
                <section className="">
                    <div className="row">
                        <Sidebar />
                        <div className="col-lg-9 mt-1">
                            <main className="mb-5" style={{}}>
                                <div className="container px-4">
                                    <section className=""></section>
                                    <section className="">
                                        <div className="row rounded shadow p-3">
                                            <h2>Hi {profile.full_name}, </h2>
                                            <div
                                                id="dashboard"
                                                className="col-lg-12 mb-4 mb-lg-0 h-100"
                                            >
                                                From your account dashboard. you can easily check
                                                &amp; view your{" "}
                                                <strong>
                                                    <a href="">orders</a>
                                                </strong>
                                                , manage your{" "}
                                                <strong>
                                                    <a href="">shipping</a>
                                                </strong>
                                                <span> or </span>
                                                <strong>
                                                    <a href="">edit account</a>.{" "}
                                                </strong>
                                                Just use the sidebar to get started.
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </main>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}

export default Account;