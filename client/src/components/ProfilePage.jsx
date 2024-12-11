import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function ProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const token = localStorage.getItem("token");

  const headers = token ? { Authorization: "Bearer " + token } : {};

  useEffect(() => {
    const endpoint = id
      ? `http://localhost:5500/api/users/${id}`
      : "http://localhost:5500/api/auth/profile";
    axios.get(endpoint, { headers }).then((res) => setProfile(res.data));
  }, [id]);

  if (!profile) return <div>Loading...</div>;

  return (
    <div>
      <h2>{profile.username}'s Profile</h2>
      {profile.email && <p>Email: {profile.email}</p>}
      <p>Bio: {profile.bio}</p>
      {!id && token && (
        <p>You can edit your profile (not fully implemented here).</p>
      )}
      <h3>Followers: {profile.followers ? profile.followers.length : 0}</h3>
      <h3>Following: {profile.following ? profile.following.length : 0}</h3>
      <h3>
        Bookmarks: {profile.bookmarks ? profile.bookmarks.join(", ") : ""}
      </h3>
    </div>
  );
}

export default ProfilePage;
