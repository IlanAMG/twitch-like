import React, {useEffect, useState} from 'react'
import api from '../../api';
import {Link} from 'react-router-dom'

export const TopStreams = () => {

    const [channels, setChannels] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const result = await api.get('https://api.twitch.tv/helix/streams')
            let dataArray = result.data.data
            // console.log(result)
            
            let gamesIDs = dataArray.map(stream => {
                return stream.game_id // on récupère le game_id pour chaque top stream
            })

            let userIDs = dataArray.map(stream => {
                return stream.user_id // on récupère le user_id pour chaque top stream
            })

            //création des URLs personnalisés
            let baseUrlGames = 'https://api.twitch.tv/helix/games?' // Get Games sur Twitch dev // on met un ? car il y aura des id 
            let baseUrlUsers = 'https://api.twitch.tv/helix/users?' // Get Users sur Twitch dev // idem pour les users

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
                stream.login = ''
                // on vérifie si les éléments de gamesNames et gamesUsers corresponde avec ceux de dataArray
                // afin de leurs rajouter nos variables gameName, truePic et login
                gamesNamesArray.forEach(name => {
                    gamesUsersArray.forEach(user => {
                        if(stream.user_id === user.id && stream.game_id === name.id) {
                            stream.gameName = name.name
                            stream.login = user.login
                        }
                    })
                })

            let newUrl = stream.thumbnail_url // ici on met une dimension à l'image du stream 
                .replace('{width}', '320')
                .replace('{height}', '180')
                stream.thumbnail_url = newUrl

                return stream 
            })
            setChannels(finalArray) 
        }
        fetchData()
    }, [])

    // console.log(channels)

    return (
        <div>
            <h1 className="titreGames">Stream les plus populaires</h1>
            <div className="flexAccueil">
                {channels.map((channel, index) => (
                    <div key={index} className="carteStream">
                        <img src={channel.thumbnail_url} className='imgCarte' alt="jeu"/>
                        <div className="cardBodyStream">
                            <h5 className="titreCartesStream">{channel.user_name}</h5>
                            <p className="txtStream">Jeu : {channel.gameName}</p>
                            <p className="txtStream viewers">Viewers : {channel.viewer_count}</p>
                            <Link className='lien' to={{pathname:`/live/${channel.login}`}}>
                                <div className="btnCarte">Regarder {channel.user_name}</div>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

