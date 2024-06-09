import React from 'react'
import { HiThumbUp,HiOutlineExclamation,HiOutlineTrash, HiOutlinePencil, HiOutlineX } from "react-icons/hi";
import style from './CSS/Link.module.css'
import TimeAgo from 'react-timeago';
import Api from './ApiCall.jsx';
import { useState } from 'react';


function createLink({link, fetchData}) {
    const [show , setShow] = useState(false)
    const [name , setName] = useState(link.name)
    const [Link , setLink] = useState(link.link)
    const [review , setReview] = useState(link.review)
    async function updateLink(link, query) {
        try {
          await Api.updateLink(link._id, query)
          fetchData() 
        }catch (error) {
          console.log(error)
        }
      }

      async function deleteLink(link) {
        try {
          const response = await Api.deleteLink(link._id)
          console.log(response)

          fetchData() 
        }catch (error) {
          console.log(error)
        }
      }

      function handleSubmit () {
        const query = {name : name, link : Link, review : review,  date : new Date()}; 
        updateLink(link , query);
        setShow(!show)
      };
      
    return (
        <div className={style.mainDiv}>
            <a className = {style.link} href={link.link} target="_blank" rel="noopener noreferrer">{link.name}</a>   
            <p className={style.date}><TimeAgo date={link.date} /></p> 
            <p/>
            {link.review}
            <button onClick={() => setShow(!show)} className={`${style.button} ${style.edit}`}><HiOutlinePencil/></button>
            <button onClick={() => updateLink(link, {liked : !link.liked})} className={`${style.button} ${style.like} ${link.liked ? style.liked : ''}`}><HiThumbUp/></button>
            <button onClick={() => updateLink(link, {isDead : !link.isDead})} className={`${style.button} ${style.report} ${link.isDead ? style.isDead : ''}`}><HiOutlineExclamation/></button>
            <button onClick={() => deleteLink(link)} className={`${style.button} ${style.delete}`}><HiOutlineTrash/></button>

            {show ? 
            <div className={style.linkUpdate}>
                <button  onClick={() => setShow(false)} className={`${style.button} ${style.close}`}><HiOutlineX /></button>  
                <form className={style.LinkForm} onSubmit={handleSubmit}> 
                    <input className={style.smallInput} type="text" value={name} onChange={(event) => setName(event.target.value)}/>
                    <input className={style.smallInput} type="text" value={Link} onChange={(event) => setLink(event.target.value)}/>
                    <input className={style.smallInput} type="text" value={review} onChange={(event) => setReview(event.target.value)}/>   
                    <button className={style.buttonSubmit} type="submit">Submit</button>
                </form>      
            </div> : null}
            
        </div>
        
    );
};

export default createLink
