import React from "react";
import axios from "axios";
import { API_URL } from "../config";

const PostcardPreview = ({ postData, setPostData, onPostCreated }) => {
  const handleChange = (e) => {
    setPostData({ ...postData, [e.target.name]: e.target.value });
  };

  const handlePost = async () => {
    const data = { ...postData };
    await axios.post(`${API_URL}/posts/create`, data);
    setPostData(null);
    onPostCreated();
  };

  return (
    <div className="postcard">
      <h3>Post preview</h3>
      <input name="title" value={postData.title} onChange={handleChange} placeholder="Title" />
      <input name="location" value={postData.location} onChange={handleChange} placeholder="Location" />
      <input name="date" value={postData.date} onChange={handleChange} placeholder="Date" />
      <textarea name="description" value={postData.description} onChange={handleChange} placeholder="Description" />
      {postData.imageUrl && (
        <img src={API_URL + postData.imageUrl} alt="uploaded" style={{ maxWidth: "100%", borderRadius: 8 }} />
      )}
      <p>Type: {postData.type}</p>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={handlePost}>Post</button>
        <button onClick={() => setPostData(null)} style={{ background: "#1f1f22", border: "1px solid var(--border)" }}>Cancel</button>
      </div>
    </div>
  );
};

export default PostcardPreview;
