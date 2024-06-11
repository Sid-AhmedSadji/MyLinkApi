import headerStyle from './CSS/Header.module.css'

function Header({ toggleFilter, onChangeFilter,value , clearFilter }) {

    return (

        <div className={headerStyle.Header}>
            <button onClick={clearFilter} className={headerStyle.buttonLogo} >
                <img className={headerStyle.Logo} src="Logo.png" alt="logo" />
            </button>
            <input onFocus={e => e.target.select()} className={headerStyle.inputSearch} type="text" placeholder='Searching for something ?' onChange={onChangeFilter} value={value} />
            <button onClick={toggleFilter} className={headerStyle.button}>show filter</button>
        </div>
    )
}

export default Header
