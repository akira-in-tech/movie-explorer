import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function ProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ bio: "", email: "" });
  const token = localStorage.getItem("token");

  const headers = token ? { Authorization: "Bearer " + token } : {};

  useEffect(() => {
    const endpoint = id
      ? `http://localhost:5500/api/users/${id}`
      : "http://localhost:5500/api/auth/profile";
    axios.get(endpoint, { headers }).then((res) => {
      setProfile(res.data);
      if (!id) {
        setFormData({ bio: res.data.bio || "", email: res.data.email || "" });
      }
    });
  }, [id]);

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        "http://localhost:5500/api/users",
        formData,
        { headers }
      );
      setProfile(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div>
      <h2>{id ? `${profile.username}'s Profile` : "Your Profile"}</h2>
      <p>Email: {profile.email || "N/A"}</p>
      <p>Bio: {profile.bio || "N/A"}</p>

      {!id && token && (
        <div>
          <button className="btn btn-secondary mb-3" onClick={handleEditToggle}>
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
          {isEditing && (
            <form onSubmit={handleSave}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="bio" className="form-label">
                  Bio
                </label>
                <textarea
                  className="form-control"
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="3"
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </form>
          )}
        </div>
      )}

      <h3>Followers: {profile.followers ? profile.followers.length : 0}</h3>
      <h3>Following: {profile.following ? profile.following.length : 0}</h3>
      <h3>
        Bookmarks: {profile.bookmarks ? profile.bookmarks.join(", ") : "None"}
      </h3>
    </div>
  );
}

export default ProfilePage;
