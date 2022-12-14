import React from 'react';
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Card from "react-bootstrap/Card";
import Media from "react-bootstrap/Media";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import styles from "../../styles/GalleryPost.module.css";
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { axiosRes } from '../../api/axiosDefaults';
import { MoreDropdown } from '../../components/MoreDropdown';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const GalleryPost = (props) => {

    const {
        id,
        owner,
        profile_id,
        profile_image,
        gallery_comments_count,
        gallery_likes_count,
        like_id,
        title,
        category,
        content,
        image,
        updated_on,
        GalleryPostPage,
        setGalleryPosts,
    } = props;

    const currentUser = useCurrentUser();
    const is_owner = currentUser?.username === owner;

    const history = useHistory();

    const handleEdit = () => {
      history.push(`/gallery-posts/${id}/edit`);
    };
  
    const handleDelete = async () => {
      try {
        await axiosRes.delete(`/gallery-posts/${id}/`);
        history.push('/gallery-posts');
      } catch (err) {
        // console.log(err);
      }
    };


    const handleLike = async () => {
        try {
          const { data } = await axiosRes.post("/likes/", { gallery_post: id });
          setGalleryPosts((prevGalleryPosts) => ({
            ...prevGalleryPosts,
            results: prevGalleryPosts.results.map((gallery_post) => {
              return gallery_post.id === id
                ? { ...gallery_post, gallery_likes_count: gallery_post.gallery_likes_count + 1, like_id: data.id }
                : gallery_post;
            }),
          }));
        } catch (err) {
          // console.log(err);
        }
      };

      const handleUnlike = async () => {
        try {
          await axiosRes.delete(`/likes/${like_id}/`);
          setGalleryPosts((prevGalleryPosts) => ({
            ...prevGalleryPosts,
            results: prevGalleryPosts.results.map((gallery_post) => {
              return gallery_post.id === id
                ? { ...gallery_post, gallery_likes_count: gallery_post.gallery_likes_count - 1, like_id: null }
                : gallery_post;
            }),
          }));
        } catch (err) {
          // console.log(err);
        }
      };

    return <Card className={styles.GalleryPost}>
        <Card.Body>
            <Media className="align-items-center justify-content-between">
                <Link to={`/profiles/${profile_id}`}>
                    <Avatar src={profile_image} height={55} />
                    {owner}
                </Link>
                
                <div className="d-flex align-items-center">
                    <span>{updated_on}</span>
                    {is_owner && GalleryPostPage && (
                      <MoreDropdown
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                      />
                    )}
                </div>
            </Media>
        </Card.Body>

        
        <Link to={`/gallery-posts/${id}`}>
            <Card.Img src={image} alt={title} />
        </Link>
        <Card.Body>
            {category && <Card.Text>
              <span className={styles.Icon}><i className="fas fa-thumbtack" /></span>
              {category}
            </Card.Text>}
            {title && <Card.Title className="text-centre"><strong>{title}</strong></Card.Title>}
            <hr />
            <p className="text-center"><strong>Description</strong></p>
            {content && <Card.Text>{content}</Card.Text>}       
            <div className={styles.PostBar}>
                {is_owner ? (
                    <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>You cannot like your own post!</Tooltip>}
                    >
                    <i className="far fa-heart" />
                    </OverlayTrigger>
                ) : like_id ? (
                    <span onClick={handleUnlike}>
                    <i className={`fas fa-heart ${styles.Heart}`} />
                    </span>
                ) : currentUser ? (
                    <span onClick={handleLike}>
                    <i className={`far fa-heart ${styles.HeartOutline}`} />
                    </span>
                ) : (
                    <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Log in to like gallery posts!</Tooltip>}
                    >
                    <i className="far fa-heart" />
                    </OverlayTrigger>
                )}
                {gallery_likes_count}
                <Link to={`/gallery-posts/${id}`}>
                    <i className="far fa-comments" />
                </Link>
                {gallery_comments_count}
            </div>
        </Card.Body>
    </Card>
}

export default GalleryPost
