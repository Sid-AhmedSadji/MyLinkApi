import React, { useState } from 'react';
import { HiThumbUp, HiOutlineExclamation, HiOutlineTrash, HiOutlinePencil, HiOutlineX } from 'react-icons/hi';
import styles from './CSS/Link.module.css';
import TimeAgo from 'react-timeago';
import Api from './ApiCall.jsx';
import toast from 'react-hot-toast';

function CreateLink({ link, fetchData }) {
  const [show, setShow] = useState(false);
  const [name, setName] = useState(link.name);
  const [linkUrl, setLinkUrl] = useState(link.link);
  const [review, setReview] = useState(link.review);

  const updateLink = async (link, query) => {
      await Api.updateLink(link._id, query);
      // modifie link avec les nouvelles valeurs
      link.name = query.name;
      link.link = query.link;
      link.review = query.review;
      link.liked = query.liked;
      link.isDead = query.isDead;
      link.date = query.date;

  };

  const deleteLink = async (link) => {
    try {
      await Api.deleteLink(link._id);
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const query = { name, link: linkUrl, review, date: new Date() };
    
    toast.promise (
      (async () => {
        await updateLink(link, query);
        setShow(!show);
      })(),
      {
        loading: 'Connecting to server ...',
        success: `${name} successfully updated!`,
        error: (err) => `${err?.response?.data || 'Internal server error'}`
      });
  }


  return (
    <div className={styles.mainDiv}>
      <a className={styles.link} href={link.link} target="_blank" rel="noopener noreferrer">
        {link.name}
      </a>
      <p className={styles.date}>
        <TimeAgo date={link.date} />
      </p>
      <p />
      {link.review}
      <button onClick={() => setShow(!show)} className={`${styles.button} ${styles.edit}`}>
        <HiOutlinePencil />
      </button>
      <button
        onClick={() => updateLink(link, { liked: !link.liked })}
        className={`${styles.button} ${styles.like} ${link.liked ? styles.liked : ''}`}
      >
        <HiThumbUp />
      </button>
      <button
        onClick={() => updateLink(link, { isDead: !link.isDead })}
        className={`${styles.button} ${styles.report} ${link.isDead ? styles.isDead : ''}`}
      >
        <HiOutlineExclamation />
      </button>
      <button onClick={() => deleteLink(link)} className={`${styles.button} ${styles.delete}`}>
        <HiOutlineTrash />
      </button>
      {show ? (
        <div className={styles.linkUpdate}>
          <button onClick={() => setShow(false)} className={`${styles.button} ${styles.close}`}>
            <HiOutlineX />
          </button>
          <form className={styles.LinkForm} onSubmit={handleSubmit}>
            <input className={styles.smallInput} type="text" value={name} onChange={(event) => setName(event.target.value)} />
            <input className={styles.smallInput} type="text" value={linkUrl} onChange={(event) => setLinkUrl(event.target.value)} onFocus={e => e.target.select()} />
            <input className={styles.smallInput} type="text" value={review} onChange={(event) => setReview(event.target.value)} onFocus={e => e.target.select()} />
            <button className={styles.buttonSubmit} type="submit">
              Submit
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}

export default CreateLink;

