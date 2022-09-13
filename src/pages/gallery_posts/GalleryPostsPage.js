/* eslint-disable */
import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import GalleryPost from "./GalleryPost";
import Asset from "../../components/Asset";

import appStyles from "../../App.module.css";
import styles from "../../styles/PostsPage.module.css";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { axiosReq } from "../../api/axiosDefaults";

import NoResults from "../../assets/no-results.png";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import { useRedirect } from "../../hooks/useRedirect";

function GalleryPostsPage({ message, filter = "" }) {
    useRedirect("loggedOut");
    const[galleryPosts, setGalleryPosts] = useState({results: []});
    const [hasLoaded, setHasLoaded] = useState(false);
    const { pathname } = useLocation();

    const [query, setQuery] = useState("");

    useEffect(() => {
        const fetchGalleryPosts = async () => {
          try {
            const { data } = await axiosReq.get(`/gallery-posts/?${filter}search=${query}`);
            setGalleryPosts(data);
            setHasLoaded(true);
          } catch (err) {
            console.log(err);
          }
        };
    
        setHasLoaded(false);
        const timer = setTimeout(() => {
          fetchGalleryPosts();
        }, 1000);
    
        return () => {
          clearTimeout(timer);
        };
      }, [filter, query, pathname]);
  
      return (
        <Row className="h-100">
          <Col className="py-2 p-0 p-lg-2" lg={8}>
            <p>Popular profiles mobile</p>
            <i className={`fas fa-search ${styles.SearchIcon}`} />
            <Form
              className={styles.SearchBar}
              onSubmit={(event) => event.preventDefault()}
            >
              <Form.Control
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                type="text"
                className="mr-sm-2"
                placeholder="Search gallery posts"
              />
            </Form>


            {hasLoaded ? (
              <>
                {galleryPosts.results.length ? (
                  <InfiniteScroll
                    children={
                      galleryPosts.results.map((gallery_post) => (
                        <GalleryPost key={gallery_post.id} {...gallery_post} setGalleryPosts={setGalleryPosts} />
                      ))
                    }
                    dataLength={galleryPosts.results.length}
                    loader={<Asset spinner />}
                    hasMore={!!galleryPosts.next}
                    next={() => fetchMoreData(galleryPosts, setGalleryPosts)}
                  />
                ) : (
                  <Container className={appStyles.Content}>
                    <Asset src={NoResults} message={message} />
                  </Container>
                )}
              </>
            ) : (
              <Container className={appStyles.Content}>
                <Asset spinner />
              </Container>
            )}
          </Col>
          <Col md={4} className="d-none d-lg-block p-0 p-lg-2">
            <p>Popular profiles for desktop</p>
          </Col>
        </Row>
      );
    }

export default GalleryPostsPage;