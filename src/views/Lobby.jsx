import React, { Fragment } from 'react'

import copyText from '../utilities/copyText'

import '../styles/views/lobby'

const colors = [
  {
    label: 'RED',
    value: 'red'
  },
  {
    label: 'BLUE',
    value: 'blue'
  },
  {
    label: 'YELLOW',
    value: 'yellow'
  },
  {
    label: 'GREEN',
    value: 'green'
  }
]

// update UI & export this to a new file
const LobbyScreen = ({ onStart, onSelectColor, players, profile: { name, isHost, home }, matchId }) => {
  const sortedPlayers = {}
  colors.forEach(({ value }) => {
    for (let playerId in players) {
      const { home, name, status } = players[playerId] || {}
      if (home === value) {
        sortedPlayers[value] = {
          name,
          status
        }
      }
    }
  })

  let startButton = <button className='cta' onClick={onStart}>Start Match!</button>
  if (!home) {
    // if player hasn't selected color
    startButton = <div className='cta'>Select a color</div>
  } else if (Object.keys(players).length < 1) {
    // if minimum player count has not been reached
    startButton = <div className='cta'>Waiting for players..</div>
  }

  const shareMatch = () => {
    const url = window.location.origin + '/' + matchId
    copyText(url)
    if (navigator.share) {
      navigator.share({
        title: 'Play Ludo Online!',
        url
      }).then(() => {
        console.log('Thanks for sharing!')
      }).catch(console.error)
    }
  }

  return <Fragment>
    <div className='lobby'>
      {colors.map(({ label, value }) => {
        let miniCta = <button>Select</button>
        if (sortedPlayers[value]) {
          miniCta = <div className='lobby__cta'>{ sortedPlayers[value].name }</div>
        } else if (players[name]) {
          miniCta = <div>Waiting...</div>
        }
        return <div key={value} className='lobby__cell' onClick={() => onSelectColor(value)}>
          <div className='lobby__label'>{ label }</div>
          {miniCta}
        </div>
      })}
    </div>

    {matchId && <button className='cta cta--invite' onClick={shareMatch}>Copy code - { matchId }</button>}

    {isHost && startButton}
  </Fragment>
}

export default LobbyScreen
