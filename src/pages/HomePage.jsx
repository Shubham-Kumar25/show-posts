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
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="rounded-3xl overflow-hidden shadow-xl bg-white border border-gray-200 hover:shadow-lg transition duration-300"
          >
            <Link to={`/post/${post.id}`}>
              <div className="px-6 py-4">
                <div className="font-semibold text-xl mb-2 text-violet-800">
                  <span className="text-green-800 font-bold">Title:</span>{" "}
                  {post.title}
                </div>
                <p className="text-gray-700 text-base">
                  <span className="text-green-800 font-semibold">Content:</span>{" "}
                  {post.body}
                </p>
                {users[post.userId] && (
                  <p className="text-red-500 text-base mt-4 font-semibold">
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
