import React, { useState, useEffect } from "react";
import Feed from "./components/Feed";
import Composer from "./components/Composer";
import { API_URL } from "./config";
import "./App.css";

function App() {
  const [feed, setFeed] = useState([]);

  const fetchFeed = async () => {
    const res = await fetch(`${API_URL}/posts/feed`);
    const data = await res.json();
    setFeed(data);
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  return (
    <div className="App app-shell">
      <h1>🎓 Campus Feed</h1>
      <Feed feed={feed} onRefresh={fetchFeed} />
      <Composer onPostCreated={fetchFeed} />
    </div>
  );
}

export default App;
