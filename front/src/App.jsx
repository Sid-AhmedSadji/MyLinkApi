import appStyle from './CSS/App.module.css'
import Header from './Header.jsx'
import { useState, useEffect } from 'react'
import Api from './ApiCall.jsx'
import Link from './Link.jsx'
import { HiOutlinePlus, HiOutlineMinus, HiOutlineX } from "react-icons/hi"

const sortTypes = [
  "alphabetical",
  "alphabetical-reverse",
  "date",
  "date-reverse",
  "most liked first",
  "most liked last",
  "url dead last",
  "url dead first"
]

function filterLinks(links, filter, setFilteredLinks) {
  if (filter) {
    setFilteredLinks(
      links.filter(link =>
        link.name.toLowerCase().includes(filter.toLowerCase()) ||
        link.link.toLowerCase().includes(filter.toLowerCase())
      )
    )
  } else {
    setFilteredLinks([...links])
  }
}

function sortLinks(links, sortedBy, setFilteredLinks) {
  if (links.length === 0) return
  switch (sortedBy) {
    case 0:
      // sort alphabetically
      setFilteredLinks([...links].sort((a, b) => a.name.localeCompare(b.name)))
      break
    case 1:
      // sort alphabetically reverse
      setFilteredLinks([...links].sort((a, b) => b.name.localeCompare(a.name)))
      break
    case 2:
      // sort by date
      setFilteredLinks([...links].sort((a, b) => new Date(b.date) - new Date(a.date)))
      break
    case 3:
      // sort by date reverse
      setFilteredLinks([...links].sort((a, b) => new Date(a.date) - new Date(b.date)))
      break
    case 4:
      // sort by liked
      setFilteredLinks([...links].sort((a, b) => b.review - a.review))
      break
    case 5:
      // sort by liked reverse
      setFilteredLinks([...links].sort((a, b) => a.review - b.review))
      break
    case 6:
      // sort by dead
      setFilteredLinks([...links].sort((a, b) => a.isDead - b.isDead))
      break
    case 7:
      // sort by dead reverse
      setFilteredLinks([...links].sort((a, b) => b.isDead - a.isDead))
      break
    default:
      break
  }
}

function App() {
  const [showFilter, setShowFilter] = useState(false)
  const [sortedBy, setSortedBy] = useState(0)
  const [links, setLinks] = useState([])
  const [filteredLinks, setFilteredLinks] = useState([])
  const [filter, setFilter] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [link, setLink] = useState('')
  const [review, setReview] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    await postLink(name, link, review)
    setName('')
    setLink('')
    setReview('')
    setIsOpen(false)
  }

  const postLink = async (name, link, review) => {
    try {
      const response = await Api.postLink({
        name: name,
        link: link,
        liked: false,
        review: review,
        isDead: false,
        date: new Date()
      })
      console.log(response)
      await fetchData()
    } catch (error) {
      console.log(error)
    }
  }

  const fetchData = async () => {
    const query = {}
    try {
      const response = await Api.getLinks(query)
      setLinks([...response].sort((a, b) => a.name.localeCompare( b.name)))
      setFilteredLinks( filterLinks( sortLinks(response, sortedBy, setFilteredLinks ), filter, setFilteredLinks) )
    } catch (error) {
      console.log(error)
    }
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const toggleFilter = () => {
    setShowFilter(!showFilter)
  }

  const changeSort = () => {
    setSortedBy((sortedBy + 1) % sortTypes.length)
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    filterLinks(links, filter, setFilteredLinks)
  }, [filter])

  useEffect(() => {
    sortLinks(links, sortedBy, setFilteredLinks)
  }, [sortedBy])

  return (
    <div className={appStyle.GlobalDiv}>
      <Header
        toggleFilter={toggleFilter}
        onChangeFilter={handleFilterChange}
      />
      <hr style={{ width: "75%" }} />

      <div
        className={`${appStyle.filterDiv} ${showFilter ? appStyle.visible : ""}`}
      >
        show filter
        <p />
        aj
        <p />
        aj
        <p />
        aj
        <p />
        ah
        aj
      </div>

      <button className={appStyle.filterButton} onClick={changeSort}>
        sorted by: {sortTypes[sortedBy]}
      </button>

      <div className={appStyle.mainDiv}>
        <div className={appStyle.ListeDiv}>
          <ul className={appStyle.ul}>
            {filteredLinks.map(link => {
              return (
                <li key={link._id}>
                  <Link link={link} fetchData={fetchData} />
                </li>
              )
            })}
          </ul>
        </div>
      </div>
      <button className={appStyle.add} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <HiOutlineMinus /> : <HiOutlinePlus />}
      </button>

      {isOpen ? (
        <div className={appStyle.addLink}>
          <button onClick={() => setIsOpen(false)} className={appStyle.close}>
            <HiOutlineX />
          </button>
          <form className={appStyle.LinkForm} onSubmit={handleSubmit}>
            <input
              className={appStyle.smallInput}
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder='Name'
            />
            <input
              className={appStyle.smallInput}
              type="text"
              value={link}
              onChange={e => setLink(e.target.value)}
              placeholder='Link'
            />
            <input
              className={appStyle.smallInput}
              type="text"
              value={review}
              onChange={e => setReview(e.target.value)}
              placeholder='Review'
            />
            <button className={appStyle.buttonSubmit} type="submit">
              Add
            </button>
          </form>
        </div>
      ) : null}
    </div>
  )
}

export default App

