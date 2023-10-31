import {
    ChatBubbleOutlineOutlined,
    FavoriteBorderOutlined,
    FavoriteOutlined,
    Delete,
  } from "@mui/icons-material";
  import { red } from '@mui/material/colors';
  import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
  import FlexBetween from "../../components/FlexBetween";
  import ProfileFriend from "../../components/ProfileFriend";
  import WidgetWrapper from "../../components/WidgetWrapper";
  import { useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { setPost } from "../../state";
  
  const PostWidget = ({
    postId,
    postUserId,
    name,
    description,
    location,
    picturePath,
    videoPath,
    userPicturePath,
    likes,
    comments,
  }) => {
    const [isComments, setIsComments] = useState(false);
    const dispatch = useDispatch();
    const token = useSelector((state) => state.token);
    const loggedInUserId = useSelector((state) => state.user._id);
    const isLiked = Boolean(likes[loggedInUserId]);
    const likeCount = Object.keys(likes).length;
  
    const { palette } = useTheme();
    const main = palette.neutral.main;
    const primary = palette.primary.main;
  
    const patchLike = async () => {
      const response = await fetch(`https://linkup-etey.onrender.com/posts/${postId}/like`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId }),
      });
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
      window.location.reload();
    };
  
    const deletePost = async () => {
        try {
          const response = await fetch(`https://linkup-etey.onrender.com/posts/${postId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
      
          if (response.ok) {
            console.log("Post deleted successfully");
            const userConfirmed = window.confirm("Post deleted successfully. Click OK to reload the page.");
            if (userConfirmed) {
              window.location.reload();
            }
          } else {
            console.error("Failed to delete the post");
          }
        } catch (error) {
          console.error("An error occurred:", error);
        }
      };
    
    return (<Box backgroundColor="red">
      <WidgetWrapper m="2rem 0">
        <ProfileFriend
          friendId={postUserId}
          name={name}
          subtitle={location}
          userPicturePath={userPicturePath}
        />
        <Typography color={main} sx={{ mt: "1rem" }}>
          {description}
        </Typography>
        {picturePath && (
          <img
            width="100%"
            height="auto"
            alt="post"
            style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
            src={`https://linkup-etey.onrender.com/assets/${picturePath}`}
          />
        )}
        {videoPath && (
          <video
            controls // Add controls to allow users to play, pause, etc.
            width="100%"
            style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          >
            <source src={`https://linkup-etey.onrender.com/assets/${videoPath}`} type="video/mp4" />
            <source src={`https://linkup-etey.onrender.com/assets/${videoPath}`} type="video/quicktime" />
            <source src={`https://linkup-etey.onrender.com/assets/${videoPath}`} type="video/x-matroska" />
            Your browser does not support the video tag.
          </video>
        )}
  
        <FlexBetween mt="0.25rem">
          <FlexBetween gap="1rem">
            <FlexBetween gap="0.3rem">
              <IconButton onClick={patchLike}>
                {isLiked ? (
                  <FavoriteOutlined sx={{ color: primary }} />
                ) : (
                  <FavoriteBorderOutlined />
                )}
              </IconButton>
              <Typography>{likeCount}</Typography>
            </FlexBetween>
  
            <FlexBetween gap="0.3rem">
              <IconButton onClick={() => setIsComments(!isComments)}>
                <ChatBubbleOutlineOutlined />
              </IconButton>
              <Typography>{comments.length}</Typography>
            </FlexBetween>
          </FlexBetween>
        {loggedInUserId === postUserId && (
        <IconButton onClick={deletePost}>
          <Delete sx={{ color: red[500] }} />
        </IconButton>
      )}
        
          
        </FlexBetween>
        {isComments && (
          <Box mt="0.5rem">
            {comments.map((comment, i) => (
              <Box key={`${name}-${i}`}>
                <Divider />
                <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                  {comment}
                </Typography>
              </Box>
            ))}
            <Divider />
          </Box>
        )}
      </WidgetWrapper>
      </Box>
    );
  };
  
  export default PostWidget;
  