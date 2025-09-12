import React from "react";
import { API_URL } from "../config";
import axios from "axios";

function formatPostedAt(timestamp) {
  if (!timestamp) return "";
  const d = new Date(Number(timestamp));
  const hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const isPM = hours >= 12;
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  const ampm = isPM ? 'pm' : 'am';
  const day = d.getDate();
  const month = d.toLocaleString(undefined, { month: 'long' });
  const ordinal = (n) => {
    const s = ["th","st","nd","rd"];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  };
  return `posted at ${hour12}:${minutes} ${ampm}, ${day}${ordinal(day)} ${month}`;
}

const Feed = ({ feed, onRefresh }) => {
  const rsvp = async (postId, response) => {
    try {
      await axios.post(`${API_URL}/posts/rsvp`, { postId, response });
      if (onRefresh) onRefresh();
    } catch (e) {
      console.error(e);
      alert("Failed to RSVP. Try again.");
    }
  };
  return (
    <div className="feed">
      <h2>Latest Posts</h2>
      {feed.map((post) => (
        <div key={post.id} className="postcard">
          <h3>{post.title || "Untitled"}</h3>
          <p style={{ color: "#666", marginTop: -10 }}>{post.createdAt ? formatPostedAt(post.createdAt) : null}</p>
          <p>Type: {post.type}</p>
          <p>Location: {post.location}</p>
          <p>Date: {post.date}</p>
          <p>{post.description}</p>
          {post.imageUrl && (
            <img src={API_URL + post.imageUrl} alt={post.title || "post image"} style={{ width: "100%", borderRadius: 12, marginTop: 8 }} />
          )}
          {post?.type === 'Event Posts' && (
            <div className="rsvp-buttons" style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button onClick={() => rsvp(post.id, 'going')}>Going ({post?.rsvp?.going || 0})</button>
              <button onClick={() => rsvp(post.id, 'maybe')}>Maybe ({post?.rsvp?.maybe || 0})</button>
              <button onClick={() => rsvp(post.id, 'notGoing')}>Not going ({post?.rsvp?.notGoing || 0})</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Feed;
