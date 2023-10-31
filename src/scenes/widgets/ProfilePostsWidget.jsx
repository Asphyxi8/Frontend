import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../state";
import ProfilePostWidget from "./ProfilePostWidget";

const ProfilePostsWidget = ({ userId, ogID }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

  const getUserPosts = async () => {
    const response = await fetch(
      `https://linkup-etey.onrender.com/posts/${userId}/posts`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };

  useEffect(() => {
    getUserPosts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {Array.isArray(posts) ? (
  posts.map(
    ({
      _id,
      userId,
      firstName,
      lastName,
      description,
      location,
      picturePath,
      videoPath,
      userPicturePath,
      likes,
      comments,
    }) => (
      <ProfilePostWidget
        key={_id}
        postId={_id}
        postUserId={userId}
        name={`${firstName} ${lastName}`}
        description={description}
        location={location}
        picturePath={picturePath}
        videoPath={videoPath}
        userPicturePath={userPicturePath}
        likes={likes}
        comments={comments}
      />
    )
  )
) : (
  <p>No posts available</p>
)}
    </>
  );
};

export default ProfilePostsWidget;
