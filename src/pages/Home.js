import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getDocs,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../firebase/config";
import Modal from "react-modal";
import DeleteIcon from "../assets/delete.svg";

// styles
import "./Home.css";

Modal.setAppElement("#root");

const Home = () => {
  const [articles, setArticles] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentArticleId, setCurrentArticleId] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    title: "",
    content: "",
    author: "",
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const fetchArticles = async () => {
    const ref = collection(db, "articles");
    const snapshot = await getDocs(ref);
    const results = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setArticles(results);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDelete = async (id) => {
    const ref = doc(db, "articles", id);
    await deleteDoc(ref);
    fetchArticles();
  };

  const openUpdateModal = (article) => {
    setCurrentArticleId(article.id);
    setUpdatedData({
      title: article.title,
      description: article.description,
      author: article.author,
    });
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    const ref = doc(db, "articles", currentArticleId);
    await updateDoc(ref, updatedData);
    setIsModalOpen(false);
    fetchArticles();
  };

  return (
    <div className="home">
      {user ? (
        <>
          <h2>Articles</h2>
          {articles &&
            articles.map((article) => (
              <div key={article.id} className="card">
                <h3>{article.title}</h3>
                <p>Written by {article.author}</p>
                <Link to={`/articles/${article.id}`}>Read More...</Link>
                <div className="buttons">
                  <button
                    className="update-btn"
                    onClick={() => openUpdateModal(article)}
                  >
                    Update
                  </button>
                  <img
                    className="icon"
                    onClick={() => handleDelete(article.id)}
                    src={DeleteIcon}
                    alt="delete icon"
                  />
                </div>
              </div>
            ))}

          <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            contentLabel="Update Article"
            className="modal"
            overlayClassName="overlay"
          >
            <h2>Update Article</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate();
              }}
            >
              <label>
                Title:
                <input
                  type="text"
                  value={updatedData.title}
                  onChange={(e) =>
                    setUpdatedData({ ...updatedData, title: e.target.value })
                  }
                />
              </label>
              <br />
              <label>
                Description:
                <textarea
                  value={updatedData.description}
                  onChange={(e) =>
                    setUpdatedData({
                      ...updatedData,
                      description: e.target.value,
                    })
                  }
                />
              </label>
              <br />
              <label>
                Author:
                <input
                  type="text"
                  value={updatedData.author}
                  onChange={(e) =>
                    setUpdatedData({ ...updatedData, author: e.target.value })
                  }
                />
              </label>
              <br />
              <button type="submit">Update</button>
              <button type="button" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
            </form>
          </Modal>
        </>
      ) : (
        <p>
          Please <Link to="/login">login</Link> to see the articles.
        </p>
      )}
    </div>
  );
};

export default Home;
