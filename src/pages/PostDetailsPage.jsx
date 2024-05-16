import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPost } from "../redux/postsSlice";
import { fetchUser } from "../redux/usersSlice";
import { fetchComments } from "../redux/commentsSlice";
import { useParams } from "react-router-dom";

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
    }
    if (post && !user) {
      dispatch(fetchUser(post.userId));
    }
    if (post && !comments) {
      dispatch(fetchComments(post.id));
    }
  }, [dispatch, post, user, comments, id]);

  if (!post || !user || !comments) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 flex justify-center items-center h-full bg-gray-100">
      <div className="max-w-md p-4 rounded-3xl shadow-2xl w-full">
        <div className="bg-white rounded-lg overflow-hidden shadow-md mb-4">
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">
              <span className="text-green-800 font-bold">Title: </span>
              {post.title}
            </div>
            <p className="text-gray-700 text-base">
              <span className="text-green-800 font-bold">Content: </span>
              {post.body}
            </p>
            <div className="mt-4">
              <h3 className="font-semibold text-lg">Author: {user.name}</h3>
              <p className="text-gray-600">Email: {user.email}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4">
            <h3 className="font-bold text-red-800 text-xl mb-2">Comments:</h3>
            {comments.map((comment) => (
              <div key={comment.id} className="border-b pb-4">
                <p className="text-gray-700">{comment.body}</p>
                <p className="text-violet-700 text-sm mt-1">- {comment.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostDetailsPage;
