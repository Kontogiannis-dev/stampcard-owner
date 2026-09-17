import { useEffect, useState, useRef } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { Link, useNavigate } from 'react-router-dom'
import './shared.css'
import './Scanner.css'

function Scanner() {
    const pin = sessionStorage.getItem('ownerPin')
    const [message, setMessage] = useState("Point camera at customer's QR code")
    const navigate = useNavigate()
    const hasScanned = useRef(false)

    function handleScanSuccess(decodedText) {
        if (hasScanned.current) return
        hasScanned.current = true

        fetch(`https://192.168.1.148:8000/owner/1/stamp?pin=${pin}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `identifier=${decodedText}`
        })
            .then(response => {
                if (response.ok) {
                    navigate('/dashboard')
                } else {
                    setMessage(`Failed to add stamp — check PIN or customer ID`)
                    hasScanned.current = false
                }
            })
    }

    useEffect(() => {
        const readerElement = document.getElementById("reader")
        if (readerElement) {
            readerElement.innerHTML = ""
        }

        let html5Qrcode
        let isActive = true

        const timer = setTimeout(() => {
            if (!isActive) return

            html5Qrcode = new Html5Qrcode("reader")

            html5Qrcode.start(
                { facingMode: "environment" },
                { fps: 20, qrbox: { width: 280, height: 280 } },
                (decodedText) => {
                    if (isActive) {
                        handleScanSuccess(decodedText)
                    }
                },
                () => {}
            ).catch((error) => {
                console.error("Camera start failed:", error)
            })
        }, 300)

        return () => {
            isActive = false
            clearTimeout(timer)
            if (html5Qrcode) {
                html5Qrcode.stop().catch((error) => {
                    console.error("Scanner cleanup failed:", error)
                })
            }
        }
    }, [])

    return (
        <div className="scanner-page">
            <h1>Scan Customer QR</h1>
            <div className="scanner-frame">
                <div id="reader"></div>
            </div>
            <p>{message}</p>
            <Link to="/dashboard" className="scanner-back-link">Back to Dashboard</Link>
        </div>
    )
}

export default Scanner