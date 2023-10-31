import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  Delete,
} from "@mui/icons-material";
import { red } from '@mui/material/colors';
import { Box, Divider, IconButton, Typography, useTheme, Button, TextField } from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import Friend from "../../components/Friend";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "../../state";
import { Formik } from "formik";
import * as yup from "yup";

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
  const initialValues = {comment : ""};

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const patchLike = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
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
      const response = await fetch(`http://localhost:3001/posts/${postId}`, {
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

  const handleFormSubmitOld = async (values, onSubmitProps) => {
    console.log(values);
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }
    
    const response = await fetch(`http://localhost:3001/posts/${postId}/addComment`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }
    );
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
    //window.location.reload();
    onSubmitProps.resetForm();
  };

  const handleFormSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}/addComment`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment: values.comment }),
      });
  
      if (response.ok) {
        const updatedPost = await response.json();
        dispatch(setPost({ post: updatedPost }));
        // Reset the comment field after successful submission
        resetForm();
      } else {
        console.error("Failed to add a comment");
      }
      window.location.reload();
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setSubmitting(false);
    }
  };
  

  return (<Box backgroundColor="red">
    <WidgetWrapper m="2rem 0">
      <Friend
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
          src={`http://localhost:3001/assets/${picturePath}`}
        />
      )}
      {videoPath && (
        <video
          controls // Add controls to allow users to play, pause, etc.
          width="100%"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
        >
          <source src={`http://localhost:3001/assets/${videoPath}`} type="video/mp4" />
          <source src={`http://localhost:3001/assets/${videoPath}`} type="video/quicktime" />
          <source src={`http://localhost:3001/assets/${videoPath}`} type="video/x-matroska" />
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

          <Formik
      onSubmit={handleFormSubmit}
      initialValues={initialValues}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <TextField
              label="Add a comment..."
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.comment}
              name="comment"
              error={
                Boolean(touched.comment) && Boolean(errors.comment)
              }
              helperText={touched.comment && errors.comment}
              sx={{ gridColumn: "span 5" }}
            />

          {/* Bottoms */}
          <Box>
            <Button
              fullWidth
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
            >
              Post
            </Button>
          </Box>
        </form>
      )}
    </Formik>
        </Box>
      )}
    </WidgetWrapper>
  </Box>
    
  );
};

export default PostWidget;
