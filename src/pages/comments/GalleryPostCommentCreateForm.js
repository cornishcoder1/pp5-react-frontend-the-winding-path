import React, { useState } from "react";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import styles from "../../styles/CommentCreateEditForm.module.css";
import Avatar from "../../components/Avatar";
import { axiosRes } from "../../api/axiosDefaults";

function GalleryPostCommentCreateForm(props) {
  const { gallery_post, setGalleryPost, setGalleryComments, profileImage, profile_id } = props;
  const [content, setContent] = useState("");

  const handleChange = (event) => {
    setContent(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axiosRes.post("/comments-gallery/", {
        content,
        gallery_post,
      });
      setGalleryComments((prevGalleryComments) => ({
        ...prevGalleryComments,
        results: [data, ...prevGalleryComments.results],
      }));
      setGalleryPost((prevGalleryPost) => ({
        results: [
          {
            ...prevGalleryPost.results[0],
            gallery_comments_count: prevGalleryPost.results[0].gallery_comments_count + 1,
          },
        ],
      }));
      setContent("");
    } catch (err) {
      // console.log(err);
    }
  };
  
  return (
    <Form className="mt-2" onSubmit={handleSubmit}>
      <Form.Group>
        <InputGroup>
          <Link to={`/profiles/${profile_id}`}>
            <Avatar src={profileImage} />
          </Link>
          <Form.Control
            className={styles.Form}
            placeholder="my comment..."
            as="textarea"
            value={content}
            onChange={handleChange}
            rows={2}
          />
        </InputGroup>
      </Form.Group>
      <button
        className={`${styles.Button} d-block ml-auto`}
        type="submit"
        disabled={!content.trim()}
      >
        post
      </button>
    </Form>
  );
}

export default GalleryPostCommentCreateForm;