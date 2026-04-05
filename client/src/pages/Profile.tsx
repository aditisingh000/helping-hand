import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useAuth } from "../context/AuthContext.js";
import "../styles/Profile.css";

interface ProfileData {
  user: {
    id: string;
    name: string;
    bio: string | null;
    avatarUrl: string | null;
    locationAddress: string | null;
    createdAt: string;
  };
  stats: {
    hosted: number;
    attended: number;
    friends: number;
  };
}

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();

  // If no param, assume we want our own profile
  const targetId = id || currentUser?.id;

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");

  const isOwnProfile = currentUser?.id === targetId;

  const fetchProfile = async () => {
    if (!targetId) return;
    try {
      const res = await fetch(`/api/users/${targetId}`);
      if (!res.ok) throw new Error("Failed to load profile");
      const data = await res.json();
      setProfile(data);
      setEditName(data.user.name);
      setEditBio(data.user.bio || "");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetId]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await fetch(`/api/users/${targetId}/avatar`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to upload avatar");
      const data = await res.json();

      // Update local state
      setProfile((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          user: { ...prev.user, avatarUrl: data.avatarUrl },
        };
      });
    } catch (err) {
      console.error(err);
      alert("Error uploading avatar");
    }
  };

  const handleSaveProfile = async () => {
    try {
      const res = await fetch(`/api/users/${targetId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, bio: editBio }),
      });
      if (!res.ok) throw new Error("Failed to update profile");

      // Refresh local state
      setProfile((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          user: { ...prev.user, name: editName, bio: editBio },
        };
      });
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Error updating profile");
    }
  };

  if (loading)
    return (
      <div style={{ color: "white", textAlign: "center", padding: "50px" }}>Loading profile...</div>
    );
  if (error || !profile)
    return (
      <div style={{ color: "#FF6B6B", textAlign: "center", padding: "50px" }}>
        {error || "Profile not found"}
      </div>
    );

  return (
    <div className="profile-container fade-in">
      <div className="profile-header">
        <div className="profile-avatar-wrapper">
          <img
            src={
              profile.user.avatarUrl ||
              "https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png"
            }
            alt="Profile Avatar"
            className="profile-avatar"
          />
          {isOwnProfile && (
            <label className="avatar-upload-label" title="Change Avatar">
              📷
              <input
                type="file"
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </label>
          )}
        </div>

        <div className="profile-info">
          {!isEditing ? (
            <>
              <h1 className="profile-name">{profile.user.name}</h1>
              <p className="profile-bio">{profile.user.bio || "No bio provided yet."}</p>

              <div className="profile-stats">
                <div className="stat-box">
                  <div className="stat-number">{profile.stats.hosted}</div>
                  <div className="stat-label">Events Hosted</div>
                </div>
                <div className="stat-box">
                  <div className="stat-number">{profile.stats.attended}</div>
                  <div className="stat-label">Events Attended</div>
                </div>
                <div className="stat-box">
                  <div className="stat-number">{profile.stats.friends}</div>
                  <div className="stat-label">Friends</div>
                </div>
              </div>

              {isOwnProfile && (
                <button className="profile-edit-btn" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </button>
              )}
            </>
          ) : (
            <div className="edit-form">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Your Name"
              />
              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                placeholder="Tell us about yourself..."
                rows={4}
              />
              <div className="edit-actions">
                <button className="btn-save" onClick={handleSaveProfile}>
                  Save Changes
                </button>
                <button className="btn-cancel" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
