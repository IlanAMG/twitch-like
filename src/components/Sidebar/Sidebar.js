import React, {useEffect, useState} from 'react'
import api from '../../api';
import {Link} from 'react-router-dom'

export const Sidebar = () => {

    const [topStreams, setTopStreams] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const result = await api.get('https://api.twitch.tv/kraken/streams')
            let dataArray = result.data.data
            // console.log(result)
            
            let gamesIDs = dataArray.map(stream => {
                return stream.game_id // on récupère le game_id pour chaque top stream
            })

            let userIDs = dataArray.map(stream => {
                return stream.user_id // on récupère le user_id pour chaque top stream
            })

            //création des URLs personnalisés
            let baseUrlGames = 'https://api.twitch.tv/kraken/games?' // Get Games sur Twitch dev // on met un ? car il y aura des id 
            let baseUrlUsers = 'https://api.twitch.tv/kraken/users?' // Get Users sur Twitch dev // idem pour les users

            // cela va contenir tout les id qu'on va rajouter à nos urls
            let queryParamsGames = ''
            let queryParamsUsers = ''

            gamesIDs.map(id => {
                return (queryParamsGames = queryParamsGames + `id=${id}&`)
            })
            userIDs.map(id => {
                return (queryParamsUsers = queryParamsUsers + `id=${id}&`)
            })
            //Url final : on assemble la base de l'url avec tous les id des jeux et des users
            let urlFinalGames = baseUrlGames + queryParamsGames
            let urlFinalUsers = baseUrlUsers + queryParamsUsers
            // console.log(urlFinalGames)

            let gamesNames = await api.get(urlFinalGames) // on fait un appels de nos belles nouvelles url toute propre avec tout nos id
            let gamesUsers = await api.get(urlFinalUsers) // pour les jeux et pour les users
            // console.log(gamesNames, gamesUsers)

            let gamesNamesArray = gamesNames.data.data 
            let gamesUsersArray = gamesUsers.data.data // on récupère les infos qu'on veut, soit le nom du jeu et le login du streamer
            // console.log(gamesNamesArray, gamesUsersArray)

            // Création du tableau final 
            let finalArray = dataArray.map(stream => { // on fait une boucle sur notre premier result qu'on a stocké dans dataArray tout en haut 
                stream.gameName = ''
                stream.truePic = ''
                stream.login = ''
                // on vérifie si les éléments de gamesNames et gamesUsers corresponde avec ceux de dataArray
                // afin de leurs rajouter nos variables gameName, truePic et login
                gamesNamesArray.forEach(name => {
                    gamesUsersArray.forEach(user => {
                        if(stream.user_id === user.id && stream.game_id === name.id) {

                            stream.truePic = user.profile_image_url
                            stream.gameName = name.name
                            stream.login = user.login
                        }
                    })
                })
                return stream // on retourne pour chaque élément de dataArray, un nouvel élément qu'on appel stream avec 3 nouvelles valeurs dedans
            })
            setTopStreams(finalArray.slice(0,6)) //on fait un .slice pour lui laisser seulement les 6 premiers top streamers
        }
        fetchData()
    }, [])

    // console.log(topStreams) //ici on peut voir ce qu'on a réalisé dans notre useEffect
    // En gros on a récupéré les données dans result, mais on a rajouté pour chaque streams, 3 données importantes, 
    // qui est la photo du streamer, le nom du jeu auxquel il joue, et son login et on a tout mis dans notre state 
    // revoir la vidéo si trop compliqué à relire 

    return (
        <div className='sidebar'>
            <h2 className="titreSidebar">Chaîne Recommandées</h2>
            <ul className="listeStream">
                {topStreams.map((stream, index) => (

                    <Link
                        key={index}
                        className='lien'
                        to={{
                            pathname:`/live/${stream.login}`
                        }}
                    >
                        <li className="containerFlexSidebar">
                            <img src={stream.truePic} alt="logo user" className="profilPicRonde"/>
                            <div className='streamUser'>{stream.user_name}</div>
                            <div className="viewerRight">
                                <div className="pointRouge"></div>
                                <div>{stream.viewer_count}</div>
                            </div>
                            <div className="gameNameSidebar">{stream.gameName}</div>
                        </li>
                    </Link>
                    
                ))}
            </ul>
        </div>
    )
}
