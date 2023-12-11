import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import type { UserData } from "./types";
import axios from "axios";
import { useCookies } from "react-cookie";

function EditUser() {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state;
  const [userData, setUserData] = useState<UserData | null>(null);
  const [msg, setMsg] = useState("Loading user profile...");
  const [cookies, removeCookie] = useCookies(["token"]);
  const [admin, setAdmin] = useState(false);
  useEffect(() => {
    if (!cookies || !cookies.token) {
      navigate("/login");
    }
    axios
      .get(`/EditUser?id=${userId}`, { withCredentials: true })
      .then((response) => {
        if (response.data.status) {
          if (response.data.admin) {
            setAdmin(true);
            setUserData(response.data.data);
          } else {
            alert("access denied");
            navigate("/profile");
          }
        } else {
          document.cookie =
            "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          navigate("/login");
        }
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
        setMsg("Error");
      });
  }, [userId]);

  const handleInputChange = (key: string, value: string | boolean) => {
    setUserData((prevUserData: UserData | null) => ({
      ...prevUserData!,
      [key]: value,
    }));
  };

  function handleSave() {
    axios
      .post("/SaveUserChanges", { userId, userData })
      .then((response) => {
        if (response.data.data.code == 200) {
          navigate("/admin/edit");
        } else {
          alert(response.data.data.msg);
          navigate("/profile");
        }
      })
      .catch((error) => {
        console.error("Error updating user data:", error);
        alert("error");
      });
  }

  return (
    <>
      <Navbar admin={admin} />
      <div className="user-profile">
        <h1>Edit User</h1>
        {userData ? (
          <form>
            {Object.entries(userData).map(([key, value]) => (
              <div key={key} className="form-group">
                <label>{key}:</label>
                {key === "admin" ? (
                  <input
                    type="checkbox"
                    checked={!!value}
                    onChange={(e) => handleInputChange(key, e.target.checked)}
                  />
                ) : key === "birthDate" || key === "hireDate" ? (
                  <input
                    type="date"
                    value={value as string} // assuming value is a string
                    onChange={(e) => handleInputChange(key, e.target.value)}
                  />
                ) : (
                  <input
                    type="text"
                    value={value as string} // assuming value is a string
                    onChange={(e) => handleInputChange(key, e.target.value)}
                  />
                )}
              </div>
            ))}
            <button type="button" onClick={handleSave}>
              Save
            </button>
          </form>
        ) : (
          <p className="loading">{msg}</p>
        )}
      </div>
    </>
  );
}

export default EditUser;
