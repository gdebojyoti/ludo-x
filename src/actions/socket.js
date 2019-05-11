const remoteUrl = 'http://localhost:8000'

import openSocket from 'socket.io-client'
import { getPlayerDetails } from '../utilities/data'

const socket = openSocket(remoteUrl)

const subscribeToTimer = cb => {
  socket.on('timer', timestamp => cb(timestamp))
  socket.emit('subscribeToTimer', 2000)
}

const initialize = () => {
  return dispatch => {
    const { name, home } = getPlayerDetails()
    socket.emit('JOIN_MATCH', {
      name, home
    })
    
    // when current player (client) has joined
    socket.on('CLIENT_JOINED', ({ id, name, home, matchId }) => {
      // update current player's data
      dispatch({
        type: 'UPDATE_PROFILE_DATA',
        payload: {
          id, name, home, matchId
        }
      })

      // update list of all players
      dispatch({
        type: 'PLAYER_JOINED',
        payload: {
          id, name, home
        }
      })
    })

    // when a new player joins
    socket.on('PLAYER_JOINED', data => {
      // update list of all players
      dispatch({
        type: 'PLAYER_JOINED',
        payload: data
      })
    })

    // when a coin of any player changes position
    socket.on('UPDATE_COIN_POSITION', data => {
      console.log("updating coin position", data)
      // update data in list of all players
      dispatch({
        type: 'UPDATE_PLAYERS_DATA',
        payload: {
          id: data.playerId,
          coinId: data.coinId,
          coinPosition: data.position
        }
      })
    })

    // when a player leaves
    socket.on('PLAYER_LEFT', playerDetails => {
      console.log("a player has left", playerDetails)
    })
  }
}

export {
  initialize
}