import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPost } from "../redux/postsSlice";
import { fetchUser } from "../redux/usersSlice";
import { fetchComments } from "../redux/commentsSlice";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";

function PostDetailsPage() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const post = useSelector((state) =>
    state.posts.find((post) => post.id === Number(id))
  );
  const user = useSelector((state) => state.users[post?.userId]);
  const comments = useSelector((state) => state.comments[id]);

  useEffect(() => {
    if (!post) {
      dispatch(fetchPost(id));
    } else {
      if (!user) {
        dispatch(fetchUser(post.userId));
      }
      if (!comments) {
        dispatch(fetchComments(post.id));
      }
    }
  }, [dispatch, post, user, comments, id]);

  if (!post || !user || !comments) {
    return <Loader />;
  }

  return (
    <div className="container flex items-center justify-center h-full p-4 mx-auto bg-gray-100">
      <div className="w-full max-w-4xl p-1 shadow-sm rounded-3xl">
        <h1 className="p-4 mb-4 text-3xl font-bold text-center border-b-2 border-red-800 text-amber-700">
          Post by: {user.name}
        </h1>
        <div className="mb-4 overflow-hidden bg-white rounded-lg shadow-md">
          <div className="px-6 py-4">
            <div className="mb-2 text-xl font-bold">
              <span className="font-bold text-green-800">Title: </span>
              {post.title}
            </div>
            <p className="text-base text-gray-700">
              <span className="font-bold text-green-800">Content: </span>
              {post.body}
            </p>
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Author: {user.name}</h3>
              <p className="text-gray-600">Email: {user.email}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4">
            <h3 className="mb-2 text-xl font-bold text-red-800">Comments:</h3>
            {comments.map((comment) => (
              <div key={comment.id} className="pb-4 border-b">
                <p className="text-gray-700">{comment.body}</p>
                <p className="mt-1 text-sm text-violet-700">- {comment.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostDetailsPage;
