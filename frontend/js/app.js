// frontend/js/app.js (UPDATED with Voice Input)

// Fallback for different browser implementations
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
const voiceStatusEl = document.getElementById('voiceStatus');

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.onresult = (event) => {
        const result = event.results[0][0].transcript;
        const targetId = voiceStatusEl.dataset.targetId;
        
        if (targetId) {
            document.getElementById(targetId).value = result;
            voiceStatusEl.innerText = '✅ Recognized: ' + result;
        } else {
            voiceStatusEl.innerText = '✅ Recognized (No input field found)';
        }
    };
    
    recognition.onstart = () => {
        voiceStatusEl.innerText = '🔊 Listening... Speak clearly now.';
    };
    
    recognition.onend = () => {
        if (voiceStatusEl.innerText.includes('Listening...')) {
             voiceStatusEl.innerText = '🛑 Voice input stopped. No speech detected.';
        }
    };
    
    recognition.onerror = (event) => {
        voiceStatusEl.innerText = '❌ Voice Error: ' + event.error + '. Try again.';
        console.error('Speech Recognition Error:', event.error);
    };

} else {
    document.addEventListener('DOMContentLoaded', () => {
        const statusEl = document.getElementById('voiceStatus');
        if (statusEl) {
            statusEl.innerText = '❌ Voice input not supported by your browser.';
        }
        document.querySelectorAll('.mic-button').forEach(btn => btn.style.display = 'none');
    });
}

function startVoiceInput(targetId) {
    if (!recognition) {
        alert('Voice recognition is not available in this browser.');
        return;
    }
    
    voiceStatusEl.dataset.targetId = targetId; 
    
    try {
        recognition.start();
    } catch (e) {
        voiceStatusEl.innerText = '🛑 Already listening. Try again in a moment.';
    }
}


async function bookTrip() {
    const mode = document.getElementById('mode').value;
    const startAddress = document.getElementById('startAddress').value;
    const endAddress = document.getElementById('endAddress').value;
    const statusEl = document.getElementById('bookingStatus');
    statusEl.innerText = 'Requesting ride...';

    const startCoords = [32.5825, 0.3476]; 
    const endCoords = [32.6166, 0.3200];
    
    if (!startAddress || !endAddress) {
         statusEl.innerText = 'Please enter both pickup and destination addresses.';
         return;
    }

    try {
        const data = await apiFetch('/trips', 'POST', { 
            mode, 
            startAddress, 
            endAddress, 
            startCoords, 
            endCoords 
        });
        
        statusEl.style.backgroundColor = '#d4edda';
        statusEl.style.color = '#155724';
        statusEl.innerText = `✅ Success! Mode: ${mode.toUpperCase()}. Fare: $${data.fare.toFixed(2)}. OTP: ${data.otp}.`;
        
        fetchTrips();

    } catch (e) {
        statusEl.style.backgroundColor = '#f8d7da';
        statusEl.style.color = '#721c24';
        statusEl.innerText = `❌ Error: ${e.message}`;
    }
}

async function fetchTrips() {
    const historyEl = document.getElementById('tripHistory');
    
    try {
        const trips = await apiFetch('/trips', 'GET');
        
        if (trips.length === 0) {
            historyEl.innerHTML = '<p>No recent trips found.</p>';
            return;
        }

        historyEl.innerHTML = trips.map(trip => `
            <div class="trip-item">
                <strong>${trip.mode.toUpperCase()} Trip</strong> 
                <small style="float: right;">Status: ${trip.status.toUpperCase()}</small><br>
                From: ${trip.startAddress}<br>
                To: ${trip.endAddress}<br>
                Fare: <strong>$${trip.fare.toFixed(2)}</strong>
            </div>
        `).join('');

    } catch (e) {
        historyEl.innerHTML = `<p style="color: red;">Could not load trips: ${e.message}</p>`;
    }
}
