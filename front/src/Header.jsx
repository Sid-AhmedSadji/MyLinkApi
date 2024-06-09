import headerStyle from './CSS/Header.module.css'

function Header({ toggleFilter, onChangeFilter }) {

    return (

        <div className={headerStyle.Header}>
            <img className={headerStyle.Logo} src="Logo.png" alt="logo" />
            <input className={headerStyle.inputSearch} type="text" placeholder='Searching for something ?' onChange={onChangeFilter}/>
            <button onClick={toggleFilter} className={headerStyle.button}>show filter</button>
        </div>
    )
}

export default Header
