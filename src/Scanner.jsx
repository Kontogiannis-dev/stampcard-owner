import { useEffect, useState, useRef } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { Link, useNavigate } from 'react-router-dom'
import './shared.css'
import './Scanner.css'

const HOST_IP = import.meta.env.VITE_HOST_IP

function Scanner() {
    const token = sessionStorage.getItem('ownerToken')
    const [message, setMessage] = useState("Point camera at customer's QR code")
    const navigate = useNavigate()
    const hasScanned = useRef(false)
    const scannerRef = useRef(null)
    const [toastType, setToastType] = useState(null)

    function handleScanSuccess(decodedText) {
        if (hasScanned.current) return
        hasScanned.current = true

        if (scannerRef.current) {
            try {
                scannerRef.current.stop()
            } catch (error) {
                console.error("Stop failed:", error)
            }
        }

        fetch(`https://${HOST_IP}:8000/owner/1/stamp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${token}`
            },
            body: `identifier=${decodedText}`
        })
            .then(response => {
                if (response.ok) {
                    return response.json()
                } else {
                    setMessage(`Failed to add stamp — check login or customer ID`)
                    hasScanned.current = false
                    throw new Error("stamp failed")  // stops the chain from continuing to the next .then
                }
            })
            .then(data => {
                if (data.action === "redeemed") {
                    setMessage(`🎉 Reward redeemed: ${data.reward_description}!`)
                } else {
                    setMessage(`✅ Stamp added (${data.stamp_count}/${data.stamps_required})`)
                }
                setToastType(data.action)
                setTimeout(() => navigate('/dashboard'), 2000)
            })
            .catch(() => {})  // swallow the thrown error so it doesn't show as unhandled in console
    }

    useEffect(() => {
        const readerElement = document.getElementById("reader")
        if (readerElement) {
            readerElement.innerHTML = ""
        }


        let isActive = true

        const timer = setTimeout(() => {
            if (!isActive) return

            scannerRef.current = new Html5Qrcode("reader")

            scannerRef.current.start(
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
            if (scannerRef.current) {
                try {
                    scannerRef.current.stop()
                } catch (error) {
                    console.error("Scanner cleanup failed:", error)
                }
            }
        }
    }, [])

    return (
        <div className="scanner-page">
            <h1>Scan Customer QR</h1>
            <div className="scanner-frame">
                <div id="reader"></div>
            </div>
            {!toastType && <p>{message}</p>}
            {toastType && <div className={`scan-toast scan-toast-${toastType}`}>{message}</div>}
            <Link to="/dashboard" className="scanner-back-link">Back to Dashboard</Link>
        </div>
    )
}

export default Scanner