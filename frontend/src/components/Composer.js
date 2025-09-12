import React, { useState } from "react";
import axios from "axios";
import PostcardPreview from "./PostcardPreview";
import { API_URL } from "../config";

const Composer = ({ onPostCreated }) => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [postData, setPostData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClassify = async () => {
    if (!text && !image) return;
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("text", text);
      if (image) formData.append("image", image);
      const res = await axios.post(`${API_URL}/posts/classify`, formData);
      const category = res?.data?.category || "";
      const imagePath = res?.data?.imagePath || null;
      setPostData({ title: "", location: "", date: "", description: text, type: category, imageUrl: imagePath });
    } catch (e) {
      console.error(e);
      alert("Failed to classify. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearInputs = () => {
    setText("");
    setImage(null);
  };

  return (
    <>
      {postData && (
        <PostcardPreview postData={postData} setPostData={setPostData} onPostCreated={() => { onPostCreated(); clearInputs(); }} />
      )}
      <div className="composer">
        <div className="composer-inner">
          <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Share something with campus..." />
          <div className="composer-row">
            <label className="file-button" htmlFor="fileInput">Choose file</label>
            <input id="fileInput" type="file" onChange={(e) => setImage(e.target.files && e.target.files[0])} />
            <button disabled={isSubmitting} onClick={handleClassify}>{isSubmitting ? "Classifying..." : "Create"}</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Composer;
