import style from './CSS/Header.module.css'

function Header( {tooggleFilter, onChangeFilter} ) {

    return (

        <div className={style.Header}>

            <img className={style.Logo} src="Logo.png" alt="logo" />

            <input className={style.inputSearch} type="text" placeholder='Searching for something ?' onChange={onChangeFilter}/>

            <button onClick={tooggleFilter}  className={style.button}>show filter</button>

        </div>
    )
}

export default Header