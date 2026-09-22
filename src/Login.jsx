import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './shared.css'
import './Login.css'

function Login() {
    const [pin, setPin] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()


    function handleLogin() {
        setError("")
        fetch(`https://192.168.1.148:8000/owner/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `shop_id=1&pin=${pin}`
        })
            .then(response => {
                if (response.ok) {
                    return response.json()
                } else {
                    throw new Error(`Server responded with error: ${response.status}`)
                }
            })
            .then(data => {
                sessionStorage.setItem('ownerToken', data.token)
                navigate('/dashboard')
            })
            .catch(err => {
                setError(err.message)
            })
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <h1>Owner Login</h1>
                <input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Enter PIN"
                />
                <button onClick={handleLogin}>Enter</button>
                {error && <p className="login-error">{error}</p>}
            </div>
        </div>
    )
}

export default Login