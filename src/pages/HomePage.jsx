import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPosts } from "../redux/postsSlice";
import { fetchUser } from "../redux/usersSlice";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";

function HomePage() {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const users = useSelector((state) => state.users);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAuthor, setSelectedAuthor] = useState("");

  const postsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchPosts());
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch]);

  const fetchUsers = useCallback(() => {
    posts.forEach((post) => {
      if (!users[post.userId]) {
        dispatch(fetchUser(post.userId));
      }
    });
  }, [posts, users, dispatch]);

  useEffect(() => {
    if (posts.length) {
      fetchUsers();
    }
  }, [posts, fetchUsers]);

  const handleAuthorChange = (e) => {
    setSelectedAuthor(e.target.value);
    setCurrentPage(1);
  };

  const filteredPosts = useMemo(
    () =>
      selectedAuthor
        ? posts.filter((post) => post.userId === Number(selectedAuthor))
        : posts,
    [selectedAuthor, posts]
  );

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = useMemo(
    () => filteredPosts.slice(indexOfFirstPost, indexOfLastPost),
    [indexOfFirstPost, indexOfLastPost, filteredPosts]
  );

  const pageNumbers = useMemo(() => {
    const numbers = [];
    for (let i = 1; i <= Math.ceil(filteredPosts.length / postsPerPage); i++) {
      numbers.push(i);
    }
    return numbers;
  }, [filteredPosts.length, postsPerPage]);

  return (
    <div className="container p-4 mx-auto">
      <h1 className="p-4 mb-4 text-3xl font-bold text-center border-b-2 border-orange-300 text-cyan-200">
        All Posts
      </h1>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div>
            <select
              value={selectedAuthor}
              onChange={handleAuthorChange}
              id="author"
              className="w-full p-2 mb-4 rounded-full"
            >
              <option value="">All Authors</option>
              {Object.values(users).map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {currentPosts.map((post) => (
              <div
                key={post.id}
                className="overflow-hidden transition duration-300 bg-gray-200 border border-gray-700 shadow-xl rounded-3xl hover:shadow-lg"
              >
                <Link to={`/post/${post.id}`}>
                  <div className="px-6 py-4">
                    <div className="mb-2 text-xl font-semibold text-violet-800">
                      <span className="font-bold text-green-800">Title:</span>{" "}
                      {post.title}
                    </div>
                    <p className="text-base text-gray-700">
                      <span className="font-semibold text-green-800">
                        Content:
                      </span>{" "}
                      {post.body}
                    </p>
                    {users[post.userId] && (
                      <p className="mt-4 text-base font-semibold text-red-500">
                        <span>Author:</span> {users[post.userId].name}
                      </p>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
      <div className="flex justify-center mt-4">
        <nav>
          <ul className="flex flex-wrap justify-center gap-2 list-none">
            {pageNumbers.map((number) => (
              <li key={number} className="mx-1">
                <button
                  onClick={() => setCurrentPage(number)}
                  className={`px-4 py-2 hover:bg-blue-200 border rounded-lg ${
                    currentPage === number
                      ? "bg-blue-500 text-white"
                      : "bg-white text-blue-500"
                  }`}
                >
                  {number}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default HomePage;
