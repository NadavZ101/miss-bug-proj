import { userService } from "../services/user.service.js"
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'


const { useState } = React

export function LoginSignup({ onSetUser }) {

    const [isSignup, setIsSignup] = useState(false)
    const [credentials, setCredentials] = useState(userService.getEmptyCredentials())

    function handleInput({ target }) {
        const { name: field, value } = target
        setCredentials(prevCredentials => ({ ...prevCredentials, [field]: value }))
    }

    function handleSubmit(ev) {
        ev.preventDefault()
        onLogin(credentials)
    }

    function onLogin(credentials) {
        isSignup ? signup(credentials) : login(credentials)
    }

    function login(credentials) {
        userService.login(credentials)
            .then(onSetUser)
            .then(() => { showSuccessMsg('Logged in successfully') })
            .catch((err) => { showErrorMsg('Cannot Login') })
    }

    function signup(credentials) {
        userService.signup(credentials)
            .then(onSetUser)
            .then(() => { showSuccessMsg('Signed in successfully') })
            .catch((err) => { showErrorMsg('Cannot sign') })
    }

    return <div className="login-page">
        <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <input
                type='text'
                name="username"
                value={credentials.username}
                onChange={handleInput}
                required
            />

            <label htmlFor="password">password</label>
            <input
                type="text"
                name="password"
                value={credentials.password}
                onChange={handleInput}
                required
            />

            {
                isSignup && <input
                    type="text"
                    name="fullname"
                    value={credentials.fullname}
                    onChange={handleInput}
                    placeholder="Full Name"
                    required
                />
            }
            <button>{isSignup ? 'SignUp' : 'Login'}</button>

            <div className="btns">
                <a href="#" onClick={() => setIsSignup(!isSignup)}>
                    {
                        isSignup ?
                            'Already a member? Login' :
                            'New user? Signup here'
                    }
                </a>
            </div>
        </form>
    </div>
}