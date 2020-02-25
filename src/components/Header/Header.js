import React, {useEffect, useState} from 'react'
import logo from './IconeTwitch.svg'
import menuIco from './MenuIco.svg'
import search from './Search.svg'
import Croix from './Croix.svg'

import {Link} from 'react-router-dom'

export const Header = () => {

    const [menu, showMenu] = useState(false)
    const [smallScreen, setSmallScreen] = useState(false)
    const [searchInput, setSearchInput] = useState('')

    useEffect(() => {
        //RESPONSIVE : dès que la page se charge on vérifie si on est en dessous ou au dessus de 900px pour afficher ou non notre menu
        const mediaQuery = window.matchMedia('(max-width: 900px)') //matchMedia c'est le media Queries de javascript
        // addListener c'est comme addEventListener mais pour les media queries en js
        mediaQuery.addListener(handleMediaQueryChange)
        handleMediaQueryChange(mediaQuery) // fontion callback qui s'active toute seule

        return () => {
            mediaQuery.removeListener(handleMediaQueryChange) //avec le return on remet les compteurs à 0 
        }

    }, [])
    
    const handleMediaQueryChange = mediaQuery => {
        if (mediaQuery.matches) { // .matches vérifie si le query est true ou false 
            setSmallScreen(true)
        } else {
            setSmallScreen(false)
        }
    }

    const toggleNavRes = () => {
        showMenu(!menu)
    }
    
    const hideMenu = () => {
        if(menu) {
            showMenu(!menu)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
    }

    const handleKeyPress = (e) => {
        setSearchInput(e.target.value)
    }

    return (
        <>
            <nav className="headerTop">
                {(menu || !smallScreen) && (
                    <ul className="listeMenu">
                        <li onClick={hideMenu} className="liensNav">
                            <Link className='lien' to='/'>
                                <img src={logo} alt="logo twitch" className="logo"/>
                            </Link>
                        </li>
                        <li onClick={hideMenu} className="liensNav">
                            <Link className='lien' to ='/'>
                                Top Games
                            </Link>
                        </li>
                        <li onClick={hideMenu} className="liensNav">
                            <Link className='lien' to ='/top-streams'>
                                Top Streams
                            </Link>
                        </li>
                        <li className="liensNav">
                            <form className="formSubmit" onSubmit={handleSubmit}>
                                <input required value={searchInput} onChange={(e) => handleKeyPress(e)} type="text" className="inputRecherche"/>
                                <Link
                                    className='lien'
                                    to={{
                                        pathname: `/resultats/${searchInput}`
                                    }}
                                >
                                    <button type='submit'>
                                        <img src={search} alt="icon loupe" className="logoLoupe"/>
                                    </button>
                                </Link>
                                
                            </form>
                        </li>
                    </ul>
                )}
            </nav>

            <div className="menuResBtn">
                <img onClick={toggleNavRes} src={!menu ? menuIco : Croix} alt="icon menu" className='menuIco'/>
            </div>
        </>
    )
}
