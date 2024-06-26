import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPosts } from "../redux/postsSlice";
import { fetchUser } from "../redux/usersSlice";
import { fetchComments } from "../redux/commentsSlice";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";

function HomePage() {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const users = useSelector((state) => state.users);
  const comments = useSelector((state) => state.comments);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [sort, setSort] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

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

  useEffect(() => {
    const fetchCommentsForPosts = async () => {
      try {
        if (posts.length > 0) {
          for (const post of posts) {
            await dispatch(fetchComments(post.id));
          }
        }
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      }
    };

    fetchCommentsForPosts();
  }, [dispatch, posts, selectedAuthor, searchKeyword, sort]);

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

  const handleSearch = (e) => {
    setSearchKeyword(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (e) => {
    setSort(e.target.value);
  };

  const filteredPosts = posts.filter((post) => {
    const matchAuthor = selectedAuthor
      ? post.userId === Number(selectedAuthor)
      : post;
    const searchPost =
      post.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      post.body.toLowerCase().includes(searchKeyword.toLowerCase());

    return matchAuthor && searchPost;
  });

  const sortedPosts = useMemo(() => {
    return filteredPosts.sort((a, b) => {
      if (sort === "title") {
        return a.title.localeCompare(b.title);
      } else if (sort === "author") {
        const authorA = users[a.userId]?.name || "";
        const authorB = users[b.userId]?.name || "";
        return authorA.localeCompare(authorB);
      }
      return 0;
    });
  }, [sort, filteredPosts, users]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = useMemo(
    () => sortedPosts.slice(indexOfFirstPost, indexOfLastPost),
    [indexOfFirstPost, indexOfLastPost, sortedPosts]
  );

  const pageNumbers = useMemo(() => {
    const numbers = [];
    for (let i = 1; i <= Math.ceil(sortedPosts.length / postsPerPage); i++) {
      numbers.push(i);
    }
    return numbers;
  }, [sortedPosts.length, postsPerPage]);

  const getCommentCount = (postId) => {
    return comments[postId] ? comments[postId].length : 0;
  };

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
            <label htmlFor="author" className="mb-2 font-medium text-white">
              Filter by Author :
            </label>
            <select
              id="author"
              onChange={handleAuthorChange}
              value={selectedAuthor}
              className="w-full p-2 mb-4 rounded-full"
            >
              <option value="">Select Author</option>
              {Object.values(users).map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
            <label htmlFor="search" className="mb-2 font-medium text-white">
              Search Posts....
            </label>
            <input
              type="text"
              id="search"
              placeholder="search by keyword"
              value={searchKeyword}
              onChange={handleSearch}
              className="w-full p-2 mb-4 rounded-full"
            />
            <label htmlFor="sort" className="mb-2 font-medium text-white">
              Sort By :
            </label>
            <select
              id="sort"
              value={sort}
              onChange={handleSort}
              className="w-full p-2 mb-4 rounded-full"
            >
              <option value="">Sort By</option>
              <option value="title">Title</option>
              <option value="author">Author</option>
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
                      {post.title} ({getCommentCount(post.id)})
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
