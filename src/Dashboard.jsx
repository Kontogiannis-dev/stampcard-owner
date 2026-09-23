import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './shared.css'
import './Dashboard.css'

const HOST_IP = import.meta.env.VITE_HOST_IP

function Dashboard() {
    const token = sessionStorage.getItem('ownerToken')
    const [customers, setCustomers] = useState([])
    const [showAll, setShowAll] = useState(false)

    function loadCustomers() {
        fetch(`https://${HOST_IP}:8000/api/owner/1/customers`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => setCustomers(data))
    }

    useEffect(() => {
        loadCustomers()
    }, [])


    const visibleCustomers = showAll ? customers : customers.slice(0, 4)

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <h1>Hello, MFS</h1>
                <Link to="/scan" className="scan-button">📷 Scan Customer QR</Link>
            </div>


            <div className="dashboard-section">
                <h2>Customers</h2>
                {visibleCustomers.map(c => (
                    <div className="customer-row" key={c.identifier}>
                        <span className="customer-name">{c.first_name} {c.last_name}</span>
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