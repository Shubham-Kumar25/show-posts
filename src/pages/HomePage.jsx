import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPosts } from "../redux/postsSlice";
import { fetchUser } from "../redux/usersSlice";
import { Link } from "react-router-dom";

function HomePage() {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const users = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  useEffect(() => {
    posts.forEach((post) => {
      if (!users[post.userId]) {
        dispatch(fetchUser(post.userId));
      }
    });
  }, [dispatch, posts, users]);

  return (
    <div className="container p-4 mx-auto">
      <h1 className="p-4 mb-4 text-3xl font-bold text-center border-b-2 border-red-800 text-amber-700">
        All Posts
      </h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
        {posts.map((post) => (
          <div
            key={post.id}
            className="overflow-hidden transition duration-300 bg-white border border-gray-200 shadow-xl rounded-3xl hover:shadow-lg"
          >
            <Link to={`/post/${post.id}`}>
              <div className="px-6 py-4">
                <div className="mb-2 text-xl font-semibold text-violet-800">
                  <span className="font-bold text-green-800">Title:</span>{" "}
                  {post.title}
                </div>
                <p className="text-base text-gray-700">
                  <span className="font-semibold text-green-800">Content:</span>{" "}
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
    </div>
  );
}

export default HomePage;
