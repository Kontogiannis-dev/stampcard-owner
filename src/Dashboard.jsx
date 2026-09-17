import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './shared.css'
import './Dashboard.css'

function Dashboard() {
    const pin = sessionStorage.getItem('ownerPin')
    const [customers, setCustomers] = useState([])
    const [redeemCode, setRedeemCode] = useState("")
    const [message, setMessage] = useState("")
    const [showAll, setShowAll] = useState(false)

    function loadCustomers() {
        fetch(`https://192.168.1.148:8000/api/owner/1/customers?pin=${pin}`)
            .then(response => response.json())
            .then(data => setCustomers(data))
    }

    useEffect(() => {
        loadCustomers()
    }, [])

    function handleVerifyCode() {
        fetch(`https://192.168.1.148:8000/owner/1/verify-code?pin=${pin}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `code=${redeemCode}`
        })
            .then(response => {
                if (response.ok) {
                    setMessage("Reward redeemed successfully!")
                    setRedeemCode("")
                    loadCustomers()
                } else {
                    setMessage("Invalid or already-used code")
                }
            })
    }

    const visibleCustomers = showAll ? customers : customers.slice(0, 4)

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <h1>Hello, MFS</h1>
                <Link to="/scan" className="scan-button">📷 Scan Customer QR</Link>
            </div>

            <div className="dashboard-section">
                <h2>Redeem a code</h2>
                <input
                    type="text"
                    value={redeemCode}
                    onChange={(e) => setRedeemCode(e.target.value)}
                    placeholder="Enter customer code"
                />
                <button onClick={handleVerifyCode}>Verify & Redeem</button>
                {message && <p className="dashboard-message">{message}</p>}
            </div>

            <div className="dashboard-section">
                <h2>Customers</h2>
                {visibleCustomers.map(c => (
                    <div className="customer-row" key={c.identifier}>
                        <span className="customer-name">{c.name || "—"}</span>
                        <span className="customer-stamps">{c.stamp_count}/{c.stamps_required}</span>
                    </div>
                ))}
                {customers.length > 4 && (
                    <button className="view-more-button" onClick={() => setShowAll(!showAll)}>
                        {showAll ? "Show less" : `View more (${customers.length - 4})`}
                    </button>
                )}
            </div>
        </div>
    )
}

export default Dashboard