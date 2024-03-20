const { NavLink } = ReactRouterDOM
const { useEffect, useState } = React
const { useNavigate } = ReactRouter

import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { userService } from '../services/user.service.js'

import { UserMsg } from './UserMsg.jsx'
import { LoginSignup } from './LoginSignup.jsx'


export function AppHeader() {

  const [user, setUser] = useState(userService.getLoggedinUser())
  const navigate = useNavigate()

  console.log('AppHeader - user', user)

  function onLogout() {
    userService.logout()
      .then(() => onSetUser(null))
      .then(() => { showSuccessMsg('Logged Out') })
      .catch(() => { showErrorMsg('Cannot Log Out') })
  }

  function onSetUser(user) {
    setUser(user)
    navigate('/')
  }

  return (
    <header>
      <UserMsg />
      <nav>
        <NavLink to="/">Home</NavLink> |<NavLink to="/bug">Bugs</NavLink> |
        <NavLink to="/about">About</NavLink>
      </nav>

      <section>
        <LoginSignup onSetUser={onSetUser} />
      </section>

      <section>
        <button onClick={onLogout}>LogOut</button>
      </section>
      {/* <Link ></Link> */}
      <h1>Bugs are Forever</h1>
    </header>
  )
}
