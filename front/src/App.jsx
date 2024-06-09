import style from './CSS/App.module.css'
import Header from './Header.jsx' ;
import { useState, useEffect } from 'react';
import Api from './ApiCall.jsx';
import Link from './Link.jsx'
import { HiOutlinePlus, HiOutlineMinus,HiOutlineX  } from "react-icons/hi";


const typeOfOrder = ["alphabetical","alphabetical-reverse", "date","date-reverse", "most liked","most liked-reverse", "url dead first", "url dead last"];


function App() {

  const [showFilter, setShowFilter] = useState(false)
  const [orderedBy, setOrderedBy] = useState(null)
  const [links, setLinks] = useState([])
  const [filterLinks, setFilterLinks] = useState([])
  const [filter , setFilter] = useState("")
  const [toogle, setToogle] = useState(false)
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [review, setReview] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    postLink(name, link, review);
    setName('');
    setLink('');
    setReview('');
    setToogle(false)
  };

  const postLink = async (name, link, review) => {
    try {
      const response = await Api.postLink({name : name, link : link, liked : false, review : review, isDead : false, date : new Date()});
      console.log(response)
      fetchData()
    } catch (error) {
      console.log(error)
    }
  }
  

  const fetchData = async () => {
    const query = {};
    try {
      const response = await Api.getLinks(query);
      setLinks(response);
      setFilterLinks(response);
    } catch (error) {
      console.log(error);
    }
};


  const onChangeFilter = (event) => {
    setFilter(event.target.value)
  }
  const toggleFilter = () => {
    setShowFilter(!showFilter)
  }
  const changeOrder = () => {
    if (orderedBy< typeOfOrder.length -1 ) {
      setOrderedBy(orderedBy + 1)
    } else {
      setOrderedBy(0)
    }  
  }
  useEffect(() => {
    fetchData() 
    setOrderedBy(0)
  }, [])
  useEffect (() => {
    if (filter) {
      setFilterLinks(links.filter(link => link.name.toLowerCase().includes(filter.toLowerCase()) || link.link.toLowerCase().includes(filter.toLowerCase() )))
    }else {
      setFilterLinks([...links])
    }
  }, [filter])

  useEffect(() => {
      if ( filterLinks && filterLinks.length > 0) {
        //trier links
        setFilterLinks([...filterLinks].sort((a, b) => {
          if (typeOfOrder[orderedBy] === "alphabetical") {
            return a.name.localeCompare(b.name)
          } else if (typeOfOrder[orderedBy] === "alphabetical-reverse") {
            return b.name.localeCompare(a.name)
          } else if (typeOfOrder[orderedBy] === "date") {
            return new Date(a.date) - new Date(b.date)
          } else if (typeOfOrder[orderedBy] === "date-reverse") {
            return new Date(b.date) - new Date(a.date)
          } else if (typeOfOrder[orderedBy] === "most liked") {
            return a.liked - b.liked
          } else if (typeOfOrder[orderedBy] === "most liked-reverse") {
            return b.liked - a.liked
          } else if (typeOfOrder[orderedBy] === "url dead first") {
            return a.isDead - b.isDead
          } else if (typeOfOrder[orderedBy] === "url dead last") {
            return b.isDead - a.isDead
          }
        }))
      
      
    }
  }, [orderedBy]); // Dépendance sur filterLinks
  

  return (
    <div className={style.GlobalDiv}>

      <Header tooggleFilter={toggleFilter} onChangeFilter={onChangeFilter}/>
      <hr style={{ width: "75%" }} />

      <div className={`${style.filterDiv} ${showFilter ? style.visible : ""}`}>
        show filter
        <p/>
        aj 
        <p/>
        aj 
        <p/>
        aj 
        <p/>
        ah 
        aj 
      </div>

      <button className={style.filterButton} onClick={changeOrder}>filtered by : {typeOfOrder[orderedBy]}</button>

      <div className={style.mainDiv}>
        <div className={style.ListeDiv}>
          <ul className={style.ul}>
          {
            filterLinks.map((link) => {
              return (<li key = {link._id}><Link link = {link} fetchData = {fetchData}/></li>)
            })
          }
          </ul>
        </div>

      </div>
      <button className={style.add} onClick={() => setToogle(!toogle)}>{toogle ? <HiOutlineMinus/> : <HiOutlinePlus/>}</button>

      { toogle ? 
        <div className={style.ajoutLink}>
          <button  onClick={() => setToogle(false)} className={` ${style.close}`}><HiOutlineX /></button>                
          <form className={style.LinkForm} onSubmit={handleSubmit}>
            <input 
              className={style.smallInput} 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder='Name'
            />
            <input 
              className={style.smallInput} 
              type="text" 
              value={link} 
              onChange={(e) => setLink(e.target.value)} 
              placeholder='Link'
            />
            <input 
              className={style.smallInput} 
              type="text" 
              value={review} 
              onChange={(e) => setReview(e.target.value)} 
              placeholder='Review'
            />
            <button className={style.buttonSubmit} type="submit">Add</button>
          </form>
        </div> : null
      }
    </div>
  )
}

export default App







