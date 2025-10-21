// Global Voice Assistance System for SafeMove
// This file provides comprehensive voice assistance across all pages

class VoiceAssistant {
    constructor() {
        this.recognition = null;
        this.synth = window.speechSynthesis;
        this.isListening = false;
        this.currentLanguage = localStorage.getItem('selectedLanguage') || 'en';
        this.isEnabled = localStorage.getItem('voiceEnabled') !== 'false';
        this.narrationEnabled = localStorage.getItem('narrationEnabled') === 'true';

        this.commands = {
            en: {
                // Navigation commands
                'go home': () => this.navigateTo('index.html'),
                'go to home': () => this.navigateTo('index.html'),
                'main page': () => this.navigateTo('index.html'),
                'home page': () => this.navigateTo('index.html'),
                'back to home': () => this.navigateTo('index.html'),

                'go to login': () => this.navigateTo('login.html'),
                'login page': () => this.navigateTo('login.html'),
                'sign in': () => this.navigateTo('login.html'),
                'login': () => this.navigateTo('login.html'),

                'go to register': () => this.navigateTo('register.html'),
                'register page': () => this.navigateTo('register.html'),
                'sign up': () => this.navigateTo('register.html'),
                'register': () => this.navigateTo('register.html'),

                'go to booking': () => this.navigateTo('booking.html'),
                'booking page': () => this.navigateTo('booking.html'),
                'book a ride': () => this.navigateTo('booking.html'),
                'book ride': () => this.navigateTo('booking.html'),
                'booking': () => this.navigateTo('booking.html'),

                'go to dashboard': () => this.navigateTo('rider-dashboard.html'),
                'dashboard': () => this.navigateTo('rider-dashboard.html'),
                'my dashboard': () => this.navigateTo('rider-dashboard.html'),
                'rider dashboard': () => this.navigateTo('rider-dashboard.html'),

                'track my trip': () => this.navigateTo('trip-tracking.html'),
                'trip tracking': () => this.navigateTo('trip-tracking.html'),
                'track trip': () => this.navigateTo('trip-tracking.html'),
                'tracking': () => this.navigateTo('trip-tracking.html'),

                'trip feedback': () => this.navigateTo('trip-feedback.html'),
                'give feedback': () => this.navigateTo('trip-feedback.html'),
                'rate trip': () => this.navigateTo('trip-feedback.html'),
                'feedback': () => this.navigateTo('trip-feedback.html'),

                // Language commands
                'change language': () => this.handleLanguageCommand(),
                'switch language': () => this.handleLanguageCommand(),
                'set language': () => this.handleLanguageCommand(),
                'language': () => this.handleLanguageCommand(),

                'english': () => this.setLanguage('en'),
                'set english': () => this.setLanguage('en'),
                'speak english': () => this.setLanguage('en'),

                'luganda': () => this.setLanguage('lg'),
                'set luganda': () => this.setLanguage('lg'),
                'speak luganda': () => this.setLanguage('lg'),

                'swahili': () => this.setLanguage('sw'),
                'set swahili': () => this.setLanguage('sw'),
                'speak swahili': () => this.setLanguage('sw'),

                // Voice control commands
                'voice help': () => this.speakHelp(),
                'help': () => this.speakHelp(),
                'what can you do': () => this.speakHelp(),
                'voice commands': () => this.speakHelp(),

                'enable voice': () => this.enableVoice(),
                'disable voice': () => this.disableVoice(),
                'turn on voice': () => this.enableVoice(),
                'turn off voice': () => this.disableVoice(),
                'voice on': () => this.enableVoice(),
                'voice off': () => this.disableVoice(),

                'enable narration': () => this.enableNarration(),
                'disable narration': () => this.disableNarration(),
                'narration on': () => this.enableNarration(),
                'narration off': () => this.disableNarration(),

                // Status commands
                'where am i': () => this.tellCurrentPage(),
                'current page': () => this.tellCurrentPage(),
                'what page': () => this.tellCurrentPage(),
                'page': () => this.tellCurrentPage(),

                // Emergency commands
                'emergency': () => this.handleEmergency(),
                'sos': () => this.handleEmergency(),
                'help me': () => this.handleEmergency(),
                'call emergency': () => this.handleEmergency(),

                // Logout
                'logout': () => this.logout(),
                'sign out': () => this.logout(),
                'log out': () => this.logout(),
            },
            lg: {
                // Navigation commands in Luganda
                'genda ku kkubo': () => this.navigateTo('index.html'),
                'genda ku main page': () => this.navigateTo('index.html'),
                'kkubo': () => this.navigateTo('index.html'),

                'genda ku login': () => this.navigateTo('login.html'),
                'nnoonya': () => this.navigateTo('login.html'),

                'genda ku register': () => this.navigateTo('register.html'),
                'zzaayo': () => this.navigateTo('register.html'),

                'genda ku booking': () => this.navigateTo('booking.html'),
                'bookinga': () => this.navigateTo('booking.html'),

                'genda ku dashboard': () => this.navigateTo('rider-dashboard.html'),
                'dashboard': () => this.navigateTo('rider-dashboard.html'),

                'track trip': () => this.navigateTo('trip-tracking.html'),
                'londoola olugendo': () => this.navigateTo('trip-tracking.html'),

                'feedback': () => this.navigateTo('trip-feedback.html'),
                'rate': () => this.navigateTo('trip-feedback.html'),

                // Language commands
                'kyuusa olulimi': () => this.handleLanguageCommand(),
                'change language': () => this.handleLanguageCommand(),

                'english': () => this.setLanguage('en'),
                'luganda': () => this.setLanguage('lg'),
                'swahili': () => this.setLanguage('sw'),

                // Voice control
                'yamba': () => this.speakHelp(),
                'help': () => this.speakHelp(),

                'enable voice': () => this.enableVoice(),
                'disable voice': () => this.disableVoice(),

                // Emergency
                'emergency': () => this.handleEmergency(),
                'sos': () => this.handleEmergency(),
                'mutuyambe': () => this.handleEmergency(),

                // Logout
                'logout': () => this.logout(),
                'sign out': () => this.logout(),
            },
            lg: {
                // Navigation commands in Luganda
                'genda ku kkubo': () => this.navigateTo('index.html'),
                'genda ku main page': () => this.navigateTo('index.html'),
                'kkubo': () => this.navigateTo('index.html'),
                'genda ku home': () => this.navigateTo('index.html'),
                'go home': () => this.navigateTo('index.html'),

                'genda ku login': () => this.navigateTo('login.html'),
                'nnoonya': () => this.navigateTo('login.html'),
                'genda ku sign in': () => this.navigateTo('login.html'),
                'login': () => this.navigateTo('login.html'),

                'genda ku register': () => this.navigateTo('register.html'),
                'zzaayo': () => this.navigateTo('register.html'),
                'genda ku sign up': () => this.navigateTo('register.html'),
                'register': () => this.navigateTo('register.html'),

                'genda ku booking': () => this.navigateTo('booking.html'),
                'bookinga': () => this.navigateTo('booking.html'),
                'book ride': () => this.navigateTo('booking.html'),
                'genda ku book': () => this.navigateTo('booking.html'),

                'genda ku dashboard': () => this.navigateTo('rider-dashboard.html'),
                'dashboard': () => this.navigateTo('rider-dashboard.html'),
                'my dashboard': () => this.navigateTo('rider-dashboard.html'),

                'track trip': () => this.navigateTo('trip-tracking.html'),
                'londoola olugendo': () => this.navigateTo('trip-tracking.html'),
                'genda ku tracking': () => this.navigateTo('trip-tracking.html'),

                'feedback': () => this.navigateTo('trip-feedback.html'),
                'rate': () => this.navigateTo('trip-feedback.html'),
                'genda ku feedback': () => this.navigateTo('trip-feedback.html'),

                // Language commands in Luganda
                'kyuusa olulimi': () => this.handleLanguageCommand(),
                'change language': () => this.handleLanguageCommand(),
                'switch language': () => this.handleLanguageCommand(),

                'english': () => this.setLanguage('en'),
                'luganda': () => this.setLanguage('lg'),
                'swahili': () => this.setLanguage('sw'),
                'ganda': () => this.setLanguage('lg'),

                // Voice control in Luganda
                'yamba': () => this.speakHelp(),
                'help': () => this.speakHelp(),
                'voice help': () => this.speakHelp(),

                'enable voice': () => this.enableVoice(),
                'disable voice': () => this.disableVoice(),
                'voice on': () => this.enableVoice(),
                'voice off': () => this.disableVoice(),

                // Status commands in Luganda
                'oli wa': () => this.tellCurrentPage(),
                'where am i': () => this.tellCurrentPage(),
                'current page': () => this.tellCurrentPage(),

                // Emergency in Luganda
                'emergency': () => this.handleEmergency(),
                'sos': () => this.handleEmergency(),
                'mutuyambe': () => this.handleEmergency(),
                'help me': () => this.handleEmergency(),

                // Logout in Luganda
                'logout': () => this.logout(),
                'sign out': () => this.logout(),
                'va mu sisitemu': () => this.logout(),
            },
            sw: {
                // Navigation commands in Swahili
                'nenda nyumbani': () => this.navigateTo('index.html'),
                'go home': () => this.navigateTo('index.html'),
                'main page': () => this.navigateTo('index.html'),
                'nenda home': () => this.navigateTo('index.html'),

                'nenda login': () => this.navigateTo('login.html'),
                'ingia': () => this.navigateTo('login.html'),
                'genda login': () => this.navigateTo('login.html'),
                'sign in': () => this.navigateTo('login.html'),

                'nenda register': () => this.navigateTo('register.html'),
                'jisajili': () => this.navigateTo('register.html'),
                'genda register': () => this.navigateTo('register.html'),
                'sign up': () => this.navigateTo('register.html'),

                'nenda booking': () => this.navigateTo('booking.html'),
                'book': () => this.navigateTo('booking.html'),
                'genda booking': () => this.navigateTo('booking.html'),
                'book ride': () => this.navigateTo('booking.html'),

                'nenda dashboard': () => this.navigateTo('rider-dashboard.html'),
                'dashboard': () => this.navigateTo('rider-dashboard.html'),
                'genda dashboard': () => this.navigateTo('rider-dashboard.html'),

                'track trip': () => this.navigateTo('trip-tracking.html'),
                'fuatilia safari': () => this.navigateTo('trip-tracking.html'),
                'genda tracking': () => this.navigateTo('trip-tracking.html'),

                'feedback': () => this.navigateTo('trip-feedback.html'),
                'toa maoni': () => this.navigateTo('trip-feedback.html'),
                'genda feedback': () => this.navigateTo('trip-feedback.html'),

                // Language commands in Swahili
                'badili lugha': () => this.handleLanguageCommand(),
                'change language': () => this.handleLanguageCommand(),
                'switch language': () => this.handleLanguageCommand(),

                'english': () => this.setLanguage('en'),
                'kiswahili': () => this.setLanguage('sw'),
                'luganda': () => this.setLanguage('lg'),
                'swahili': () => this.setLanguage('sw'),

                // Voice control in Swahili
                'saidia': () => this.speakHelp(),
                'help': () => this.speakHelp(),
                'voice help': () => this.speakHelp(),

                'enable voice': () => this.enableVoice(),
                'disable voice': () => this.disableVoice(),
                'voice on': () => this.enableVoice(),
                'voice off': () => this.disableVoice(),
                'narration on': () => this.enableNarration(),
                'narration off': () => this.disableNarration(),
                'narration on': () => this.enableNarration(),
                'narration off': () => this.disableNarration(),
                'narration on': () => this.enableNarration(),
                'narration off': () => this.disableNarration(),
                'narration on': () => this.enableNarration(),
                'narration off': () => this.disableNarration(),
                'enable narration': () => this.enableNarration(),
                'disable narration': () => this.disableNarration(),

                // Status commands in Swahili
                'niko wapi': () => this.tellCurrentPage(),
                'where am i': () => this.tellCurrentPage(),
                'current page': () => this.tellCurrentPage(),

                // Emergency in Swahili
                'emergency': () => this.handleEmergency(),
                'sos': () => this.handleEmergency(),
                'nisadie': () => this.handleEmergency(),
                'help me': () => this.handleEmergency(),

                // Logout in Swahili
                'logout': () => this.logout(),
                'toka': () => this.logout(),
                'sign out': () => this.logout(),
            },
            sw: {
                // Navigation commands in Swahili
                'nenda nyumbani': () => this.navigateTo('index.html'),
                'go home': () => this.navigateTo('index.html'),
                'main page': () => this.navigateTo('index.html'),

                'nenda login': () => this.navigateTo('login.html'),
                'ingia': () => this.navigateTo('login.html'),

                'nenda register': () => this.navigateTo('register.html'),
                'jisajili': () => this.navigateTo('register.html'),

                'nenda booking': () => this.navigateTo('booking.html'),
                'book': () => this.navigateTo('booking.html'),

                'nenda dashboard': () => this.navigateTo('rider-dashboard.html'),
                'dashboard': () => this.navigateTo('rider-dashboard.html'),

                'track trip': () => this.navigateTo('trip-tracking.html'),
                'fuatilia safari': () => this.navigateTo('trip-tracking.html'),

                'feedback': () => this.navigateTo('trip-feedback.html'),
                'toa maoni': () => this.navigateTo('trip-feedback.html'),

                // Language commands
                'badili lugha': () => this.handleLanguageCommand(),
                'change language': () => this.handleLanguageCommand(),

                'english': () => this.setLanguage('en'),
                'kiswahili': () => this.setLanguage('sw'),
                'luganda': () => this.setLanguage('lg'),

                // Voice control
                'saidia': () => this.speakHelp(),
                'help': () => this.speakHelp(),

                'enable voice': () => this.enableVoice(),
                'disable voice': () => this.disableVoice(),

                // Emergency
                'emergency': () => this.handleEmergency(),
                'sos': () => this.handleEmergency(),
                'nisadie': () => this.handleEmergency(),

                // Logout
                'logout': () => this.logout(),
                'toka': () => this.logout(),
            }
        };

        this.init();
    }

    init() {
        this.initSpeechRecognition();
        this.initSpeechSynthesis();
        this.addVoiceButtonsToPage();
        this.announcePageLoad(); // Announce page if narration is on
    }


    initNarration() {
        // Override console methods to also speak important messages
        this.originalLog = console.log;
        this.originalError = console.error;
        this.originalWarn = console.warn;

        // Add narration toggle to voice button
        this.addNarrationToggle();

        // Set up automatic narration for common actions
        this.setupActionNarration();
    }

    addNarrationToggle() {
        // Add narration toggle button near voice button
        const voiceBtn = document.getElementById('voice-assistance-btn');
        if (voiceBtn && !document.getElementById('narration-toggle')) {
            const narrationToggle = document.createElement('button');
            narrationToggle.id = 'narration-toggle';
            narrationToggle.innerHTML = '🗣️';
            narrationToggle.className = 'narration-toggle-btn';
            narrationToggle.title = 'Toggle Voice Narration';
            narrationToggle.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 80px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: ${this.narrationEnabled ? '#4CAF50' : '#666'};
                color: white;
                border: none;
                font-size: 16px;
                cursor: pointer;
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                transition: all 0.3s ease;
                z-index: 999;
            `;

            narrationToggle.onclick = () => this.toggleNarration();

            document.body.appendChild(narrationToggle);
        }
    }

    toggleNarration() {
        this.narrationEnabled = !this.narrationEnabled;
        localStorage.setItem('narrationEnabled', this.narrationEnabled);

        const toggleBtn = document.getElementById('narration-toggle');
        if (toggleBtn) {
            toggleBtn.style.background = this.narrationEnabled ? '#4CAF50' : '#666';
        }

        const status = this.narrationEnabled ? 'enabled' : 'disabled';
        this.speak(this.getLocalizedText('narration') + ' ' + status);
    }

    setupActionNarration() {
        // Narrate button clicks
        document.addEventListener('click', (e) => {
            if (this.narrationEnabled && e.target.tagName === 'BUTTON') {
                const buttonText = e.target.textContent.trim();
                if (buttonText) {
                    setTimeout(() => this.narrateAction(buttonText), 100);
                }
            }
        });

        // Narrate form submissions
        document.addEventListener('submit', (e) => {
            if (this.narrationEnabled) {
                setTimeout(() => this.narrateAction('Form submitted'), 100);
            }
        });

        // Narrate page navigation
        document.addEventListener('DOMContentLoaded', () => {
            if (this.narrationEnabled) {
                setTimeout(() => this.announcePageLoad(), 500);
            }
        });
    }

    announcePageLoad() {
        if (!this.narrationEnabled) return;

        const pageTitle = document.title;
        const pageDescription = this.getPageDescription();
        const welcomeMessage = `${pageTitle}. ${pageDescription}`;

        setTimeout(() => {
            this.speak(welcomeMessage);
        }, 1000);
    }

    getPageDescription() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const descriptions = {
            'index.html': this.getLocalizedText('homeDesc'),
            'login.html': this.getLocalizedText('loginDesc'),
            'register.html': this.getLocalizedText('registerDesc'),
            'booking.html': this.getLocalizedText('bookingDesc'),
            'trip-tracking.html': this.getLocalizedText('trackingDesc'),
            'trip-feedback.html': this.getLocalizedText('feedbackDesc'),
            'rider-dashboard.html': this.getLocalizedText('dashboardDesc'),
            'payments.html': this.getLocalizedText('paymentsDesc')
        };

        return descriptions[currentPage] || this.getLocalizedText('genericDesc');
    }

    narrateAction(action) {
        if (!this.narrationEnabled) return;

        // Debounce rapid actions
        if (this.lastNarration && Date.now() - this.lastNarration < 1000) {
            return;
        }

        this.lastNarration = Date.now();
        this.speak(action);
    }

    narrateStatus(message, type = 'info') {
        if (!this.narrationEnabled) return;

        const statusMessages = {
            en: {
                success: 'Success:',
                error: 'Error:',
                warning: 'Warning:',
                info: 'Information:'
            },
            lg: {
                success: 'Kiwedde:',
                error: 'Ensobi:',
                warning: 'Okulabula:',
                info: 'Amawulire:'
            },
            sw: {
                success: 'Imefaulu:',
                error: 'Kosa:',
                warning: 'Onyo:',
                info: 'Taarifa:'
            }
        };

        const prefix = statusMessages[this.currentLanguage]?.[type] || '';
        this.speak(prefix + ' ' + message);
    }

    narrateContent(elementId) {
        if (!this.narrationEnabled) return;

        const element = document.getElementById(elementId);
        if (element) {
            const content = element.textContent.trim();
            if (content) {
                this.speak(content);
            }
        }
    }

    // Enhanced speak method with narration support
    speak(text) {
        if (!this.isEnabled || !text) return;

        if (this.synth.speaking) {
            this.synth.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = this.getLanguageCode(this.currentLanguage);
        utterance.rate = 0.9;
        utterance.pitch = 1;

        if (this.currentVoice) {
            utterance.voice = this.currentVoice;
        }

        this.synth.speak(utterance);
    }

    initSpeechRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.maxAlternatives = 3; // Get multiple alternatives for better accuracy

            // Set language-specific recognition settings
            this.updateRecognitionLanguage();

            this.recognition.onstart = () => {
                this.isListening = true;
                this.updateVoiceButtonState();
                this.speak(this.getLocalizedText('listening'));
            };

            this.recognition.onresult = (event) => {
                // Try multiple alternatives for better recognition
                let transcript = '';
                let confidence = 0;

                for (let i = 0; i < event.results[0].length; i++) {
                    if (event.results[0][i].confidence > confidence) {
                        transcript = event.results[0][i].transcript;
                        confidence = event.results[0][i].confidence;
                    }
                }

                console.log('Heard:', transcript, 'Confidence:', confidence);
                this.handleVoiceCommand(transcript.toLowerCase());
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.speak(this.getLocalizedText('recognitionError'));
                this.isListening = false;
                this.updateVoiceButtonState();
            };

            this.recognition.onend = () => {
                this.isListening = false;
                this.updateVoiceButtonState();
            };
        }
    }

    updateRecognitionLanguage() {
        if (this.recognition) {
            const langCode = this.getLanguageCode(this.currentLanguage);

            // Set primary language
            this.recognition.lang = langCode;

            // For better recognition, especially for Luganda and Swahili,
            // we can try multiple language codes
            if (this.currentLanguage === 'lg') {
                // Try multiple East African language codes for better recognition
                this.recognition.lang = 'en-UG'; // English Uganda often works better
            } else if (this.currentLanguage === 'sw') {
                this.recognition.lang = 'sw-TZ'; // Swahili Tanzania
            }

            console.log('Speech recognition language set to:', this.recognition.lang);
        }
    }

    initSpeechSynthesis() {
        if ('speechSynthesis' in window) {
            // Load available voices
            let voices = this.synth.getVoices();
            if (voices.length === 0) {
                this.synth.onvoiceschanged = () => {
                    this.selectBestVoice();
                };
            } else {
                this.selectBestVoice();
            }
        }
    }

    selectBestVoice() {
        const voices = this.synth.getVoices();
        const langCode = this.getLanguageCode(this.currentLanguage);

        // Try to find a voice that matches the current language
        let selectedVoice = voices.find(voice => voice.lang.startsWith(langCode));

        if (!selectedVoice) {
            // For Luganda, try to find East African or English voices
            if (this.currentLanguage === 'lg') {
                selectedVoice = voices.find(voice =>
                    voice.lang.startsWith('en') &&
                    (voice.name.includes('East') || voice.name.includes('Africa') ||
                     voice.name.includes('Kenya') || voice.name.includes('Tanzania') ||
                     voice.name.includes('Uganda'))
                );
            }

            // For Swahili, try to find East African voices
            if (this.currentLanguage === 'sw') {
                selectedVoice = voices.find(voice =>
                    voice.lang.startsWith('sw') ||
                    (voice.lang.startsWith('en') &&
                     (voice.name.includes('Kenya') || voice.name.includes('Tanzania')))
                );
            }

            // Final fallback to English
            if (!selectedVoice) {
                selectedVoice = voices.find(voice => voice.lang.startsWith('en'));
            }
        }

        if (!selectedVoice && voices.length > 0) {
            selectedVoice = voices[0];
        }

        this.currentVoice = selectedVoice;

        // Log available voices for debugging
        console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));
        console.log('Selected voice:', selectedVoice ? `${selectedVoice.name} (${selectedVoice.lang})` : 'None');
    }

    addVoiceButtonsToPage() {
        // Add voice control button if it doesn't exist
        if (!document.getElementById('voice-assistance-btn')) {
            const voiceBtn = document.createElement('button');
            voiceBtn.id = 'voice-assistance-btn';
            voiceBtn.innerHTML = '🎤';
            voiceBtn.className = 'voice-assistance-btn';
            voiceBtn.title = 'Voice Assistant';
            voiceBtn.onclick = () => this.toggleListening();

            // Add CSS for the button
            voiceBtn.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: #2563eb;
                color: white;
                border: none;
                font-size: 24px;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                transition: all 0.3s ease;
                z-index: 1000;
            `;

            voiceBtn.onmouseover = () => {
                voiceBtn.style.transform = 'scale(1.1)';
                voiceBtn.style.background = '#1d4ed8';
            };

            voiceBtn.onmouseout = () => {
                voiceBtn.style.transform = 'scale(1)';
                voiceBtn.style.background = '#2563eb';
            };

            document.body.appendChild(voiceBtn);
        }

        // Add narration toggle button
        if (!document.getElementById('narration-toggle-btn')) {
            const narrationBtn = document.createElement('button');
            narrationBtn.id = 'narration-toggle-btn';
            narrationBtn.innerHTML = '🗣️';
            narrationBtn.className = 'narration-toggle-btn';
            narrationBtn.title = 'Toggle Voice Narration';
            narrationBtn.onclick = () => this.toggleNarration();

            narrationBtn.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 90px; /* Next to the main voice button */
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: ${this.narrationEnabled ? '#4CAF50' : '#6c757d'};
                color: white;
                border: none;
                font-size: 20px;
                cursor: pointer;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                transition: background 0.3s ease;
                z-index: 1000;
            `;

            document.body.appendChild(narrationBtn);
        }

        // Add keyboard shortcut (Space bar to toggle voice)
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && e.ctrlKey) {
                e.preventDefault();
                this.toggleListening();
            }
        });
    }

    toggleListening() {
        if (!this.recognition) {
            this.speak(this.getLocalizedText('notSupported'));
            return;
        }

        if (this.isListening) {
            this.recognition.stop();
        } else {
            this.recognition.start();
        }
    }

    updateVoiceButtonState() {
        const voiceBtn = document.getElementById('voice-assistance-btn');
        if (voiceBtn) {
            if (this.isListening) {
                voiceBtn.style.background = '#dc2626';
                voiceBtn.innerHTML = '🎙️';
            } else {
                voiceBtn.style.background = '#2563eb';
                voiceBtn.innerHTML = '🎤';
            }
        }
    }

    handleVoiceCommand(transcript) {
        console.log('Voice command received:', transcript);

        const command = transcript.toLowerCase().trim();
        const commands = this.commands[this.currentLanguage] || this.commands.en;

        // Try to find exact match first
        if (commands[command]) {
            commands[command]();
            return;
        }

        // Try to find partial matches
        for (const [key, action] of Object.entries(commands)) {
            if (command.includes(key) || key.includes(command)) {
                action();
                return;
            }
        }

        // Default response for unrecognized commands
        this.speak(this.getLocalizedText('notUnderstood'));
    }

    navigateTo(page) {
        this.speak(this.getLocalizedText('navigating') + ' ' + page);
        setTimeout(() => {
            window.location.href = page;
        }, 1000);
    }

    setLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('selectedLanguage', lang);

        // Update recognition language
        this.updateRecognitionLanguage();

        // Update global language if function exists
        if (window.setGlobalLanguage) {
            window.setGlobalLanguage(lang);
        }

        // Re-select best voice for new language
        this.selectBestVoice();

        this.speak(this.getLocalizedText('languageChanged') + ' ' + this.getLanguageName(lang));
    }

    handleLanguageCommand() {
        this.speak(this.getLocalizedText('sayLanguage'));
    }

    enableVoice() {
        this.isEnabled = true;
        localStorage.setItem('voiceEnabled', 'true');
        this.speak(this.getLocalizedText('voiceEnabled'));
    }

    disableVoice() {
        this.isEnabled = false;
        localStorage.setItem('voiceEnabled', 'false');
        if (this.isListening) {
            this.recognition.stop();
        }
        this.speak(this.getLocalizedText('voiceDisabled'));
    }

    enableNarration() {
        this.narrationEnabled = true;
        localStorage.setItem('narrationEnabled', 'true');
        this.updateNarrationButtonState();

        // Announce current page when narration is enabled
        setTimeout(() => {
            this.announcePageLoad();
        }, 500);

        this.speak(this.getLocalizedText('narration') + ' ' + this.getLocalizedText('enabled'));
    }

    disableNarration() {
        this.narrationEnabled = false;
        localStorage.setItem('narrationEnabled', 'false');
        this.updateNarrationButtonState();
        this.speak(this.getLocalizedText('narration') + ' ' + this.getLocalizedText('disabled'));
    }

    toggleNarration() {
        if (this.narrationEnabled) {
            this.disableNarration();
        } else {
            this.enableNarration();
        }
    }

    updateNarrationButtonState() {
        const toggleBtn = document.getElementById('narration-toggle-btn');
        if (toggleBtn) {
            toggleBtn.style.background = this.narrationEnabled ? '#4CAF50' : '#666';
        }
    }

    tellCurrentPage() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const pageNames = {
            'index.html': this.getLocalizedText('homePage'),
            'login.html': this.getLocalizedText('loginPage'),
            'register.html': this.getLocalizedText('registerPage'),
            'booking.html': this.getLocalizedText('bookingPage'),
            'trip-tracking.html': this.getLocalizedText('trackingPage'),
            'trip-feedback.html': this.getLocalizedText('feedbackPage'),
            'rider-dashboard.html': this.getLocalizedText('dashboardPage')
        };

        const pageName = pageNames[currentPage] || currentPage;
        this.speak(this.getLocalizedText('youAreOn') + ' ' + pageName);
    }

    handleEmergency() {
        this.speak(this.getLocalizedText('emergencyTriggered'));
        if (window.triggerSOS) {
            window.triggerSOS();
        } else {
            alert('🚨 EMERGENCY SOS TRIGGERED!\nHelp is on the way.');
        }
    }

    logout() {
        this.speak(this.getLocalizedText('loggingOut'));
        if (window.logout) {
            window.logout();
        } else {
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('token');
                localStorage.removeItem('userName');
                localStorage.removeItem('userRole');
                window.location.href = 'index.html';
            }
        }
    }

    announcePageLoad() {
        if (!this.narrationEnabled) return;

        const pageTitle = document.title;
        const pageDescription = this.getPageDescription();
        const welcomeMessage = `${pageTitle}. ${pageDescription}`;

        setTimeout(() => {
            this.speak(welcomeMessage);
        }, 1000);
    }

    getPageDescription() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const descriptions = {
            'index.html': this.getLocalizedText('homeDesc'),
            'login.html': this.getLocalizedText('loginDesc'),
            'register.html': this.getLocalizedText('registerDesc'),
            'booking.html': this.getLocalizedText('bookingDesc'),
            'trip-tracking.html': this.getLocalizedText('trackingDesc'),
            'trip-feedback.html': this.getLocalizedText('feedbackDesc'),
            'rider-dashboard.html': this.getLocalizedText('dashboardDesc'),
            'payments.html': this.getLocalizedText('paymentsDesc')
        };

        return descriptions[currentPage] || this.getLocalizedText('genericDesc');
    }

    speakHelp() {
        const helpText = this.getLocalizedText('helpText');
        this.speak(helpText);
    }

    getLanguageCode(lang) {
        const langMap = {
            'en': 'en-US',
            'lg': 'en-UG', // Use English Uganda for better recognition, fallback to Luganda when available
            'sw': 'sw-TZ'  // Swahili Tanzania
        };
        return langMap[lang] || 'en-US';
    }

    getLanguageName(lang) {
        const nameMap = {
            'en': 'English',
            'lg': 'Luganda',
            'sw': 'Swahili'
        };
        return nameMap[lang] || 'English';
    }

    getLocalizedText(key) {
        const texts = {
            en: {
                listening: "I'm listening. Please speak your command.",
                recognitionError: "Sorry, I didn't hear that clearly. Please try again.",
                notSupported: "Voice recognition is not supported in your browser.",
                notUnderstood: "I'm not sure what you mean. Try saying 'help' for assistance.",
                navigating: "Navigating to",
                languageChanged: "Language changed to",
                sayLanguage: "Please say English, Luganda, or Swahili to change language.",
                voiceEnabled: "Voice assistance enabled.",
                voiceDisabled: "Voice assistance disabled.",
                youAreOn: "You are currently on",
                emergencyTriggered: "Emergency SOS triggered!",
                loggingOut: "Logging out...",
                helpText: "I can help you navigate, change language, or access features. Try saying: go home, book a ride, change language, or help.",
                homePage: "the home page",
                loginPage: "the login page",
                registerPage: "the registration page",
                bookingPage: "the booking page",
                trackingPage: "the trip tracking page",
                feedbackPage: "the feedback page",
                dashboardPage: "the dashboard"
            },
            // Narration texts
            narration: "Voice narration",
            enabled: "enabled",
            disabled: "disabled",
            homeDesc: "Welcome to SafeMove homepage. Choose your transport mode or navigate to other sections.",
            loginDesc: "Login page. Enter your credentials or use voice authentication.",
            registerDesc: "Registration page. Create your SafeMove account.",
            bookingDesc: "Booking page. Select transport mode and book your ride.",
            trackingDesc: "Trip tracking page. Monitor your journey in real-time.",
            feedbackDesc: "Feedback page. Rate your trip and provide comments.",
            paymentsDesc: "Payments page. Manage your payment methods and card balance.",
            dashboardDesc: "Dashboard. View your trip history and account information.",
            genericDesc: "SafeMove application page.",
            lg: {
                listening: "Nkwuliriza. Gamba ekiragiro kyo.",
                recognitionError: "Nange ssaabitegeera bulungi. Ddamu ogezese.",
                notSupported: "Okutegeera eddoboozi tekuli mu browser yo.",
                notUnderstood: "Ssaabitegeera. Gamba 'yamba' okufuna obuyambi.",
                navigating: "Nkukyusa ku",
                languageChanged: "Olulimi lwakyuuseddwa ku",
                sayLanguage: "Gamba English, Luganda, oba Swahili okukyuusa olulimi.",
                voiceEnabled: "Obuyambi bw'eddoboozi buweddwa.",
                voiceDisabled: "Obuyambi bw'eddoboozi busaziddwa.",
                youAreOn: "Oli ku",
                emergencyTriggered: "SOS yako etandise!",
                loggingOut: "Okuva mu sisitemu...",
                helpText: "Nsobola okukuyamba okutambulira, okukyuusa olulimi, oba okufuna ebintu. Gezese: genda ku kkubo, bookinga, kyuusa olulimi, oba yamba.",
                homePage: "kkubo",
                loginPage: "login",
                registerPage: "register",
                bookingPage: "booking",
                trackingPage: "trip tracking",
                feedbackPage: "feedback",
                dashboardPage: "dashboard",
                // Narration texts
                narration: "Voice narration",
                homeDesc: "Welcome to SafeMove homepage. Choose your transport mode or navigate to other sections.",
                loginDesc: "Login page. Enter your credentials or use voice authentication.",
                registerDesc: "Registration page. Create your SafeMove account.",
                bookingDesc: "Booking page. Select transport mode and book your ride.",
                trackingDesc: "Trip tracking page. Monitor your journey in real-time.",
                feedbackDesc: "Feedback page. Rate your trip and provide comments.",
                paymentsDesc: "Payments page. Manage your payment methods and card balance.",
                dashboardDesc: "Dashboard. View your trip history and account information.",
                genericDesc: "SafeMove application page.",
                narrationEnabled: "Voice narration enabled.",
                narrationDisabled: "Voice narration disabled."
            },
            lg: {
                // ... existing Luganda content ...
                feedbackPage: "feedback",
                dashboardPage: "dashboard",
                // Narration texts in Luganda
                narration: "Okubuulira eddoboozi",
                homeDesc: "Tukwaniridde ku kkubo lya SafeMove. Londa ekika kyokutambuza oba genda ku bintu ebirala.",
                loginDesc: "Omuko gwokunoonya. Wandika ebyokwemiriza oba kozesa eddoboozi.",
                registerDesc: "Omuko gwokuzzaawo akawunti. Zzaawo akawunti yo ya SafeMove.",
                bookingDesc: "Omuko gwokubookinga. Londako ekika kyokutambuza era book olugendo lwo.",
                trackingDesc: "Omuko gwokulondoola olugendo. Londoola olugendo lwo ennyanga.",
                feedbackDesc: "Omuko gwokuteeka feedback. Sengeka olugendo lwo era wandika ebirowozo.",
                paymentsDesc: "Omuko gwokusuubiza. Kola n'endagiriro zo zokusuubiza era balance ya card.",
                dashboardDesc: "Dashboard. Laba history y olugendo lwo era amawulire g akawunti.",
                genericDesc: "Omuko gwa SafeMove."
            },
            sw: {
                // ... existing Swahili content ...
                feedbackPage: "ukurasa wa maoni",
                dashboardPage: "dashibodi",
                // Narration texts in Swahili
                narration: "Masimulizi ya sauti",
                homeDesc: "Karibu kwenye ukurasa wa nyumbani wa SafeMove. Chagua aina ya usafiri au nenda kwenye sehemu zingine.",
                loginDesc: "Ukurasa wa kuingia. Ingiza kitambulisho chako au tumia uthibitisho wa sauti.",
                registerDesc: "Ukurasa wa usajili. Unda akaunti yako ya SafeMove.",
                bookingDesc: "Ukurasa wa booking. Chagua aina ya usafiri na hifadhi safari yako.",
                trackingDesc: "Ukurasa wa ufuatiliaji wa safari. Fuatilia safari yako wakati halisi.",
                feedbackDesc: "Ukurasa wa maoni. Panga safari yako na utoe maoni.",
                paymentsDesc: "Ukurasa wa malipo. Simamia njia zako za malipo na salio la kadi.",
                dashboardDesc: "Dashibodi. Angalia historia ya safari yako na maelezo ya akaunti.",
                genericDesc: "Ukurasa wa programu ya SafeMove."
            },
            sw: {
                listening: "Ninasikiliza. Tafadhali sema amri yako.",
                recognitionError: "Samahani, sikusikia vizuri. Tafadhali jaribu tena.",
                notSupported: "Utambuzi wa sauti haupatikani katika browser yako.",
                notUnderstood: "Sijaelewa. Jaribu kusema 'saidia' kupata msaada.",
                navigating: "Nakuelekeza kwenda",
                languageChanged: "Lugha imebadilishwa kuwa",
                sayLanguage: "Tafadhali sema English, Luganda, au Swahili kubadilisha lugha.",
                voiceEnabled: "Msaidizi wa sauti amewashwa.",
                voiceDisabled: "Msaidizi wa sauti amezimwa.",
                youAreOn: "Uko kwenye",
                emergencyTriggered: "SOS imewashwa!",
                loggingOut: "Unaondoka...",
                helpText: "Ninaweza kukusaidia kusogeza, kubadilisha lugha, au kufikia vipengele. Jaribu kusema: nenda nyumbani, book, badili lugha, au saidia.",
                homePage: "ukurasa wa nyumbani",
                loginPage: "ukurasa wa kuingia",
                registerPage: "ukurasa wa kujisajili",
                bookingPage: "ukurasa wa booking",
                trackingPage: "ukurasa wa ufuatiliaji",
                feedbackPage: "ukurasa wa maoni",
                dashboardPage: "dashibodi",
                narration: "Voice narration",
                enabled: "enabled",
                disabled: "disabled",
                homeDesc: "Welcome to SafeMove homepage.",
                loginDesc: "Login page.",
                registerDesc: "Registration page.",
                bookingDesc: "Booking page.",
                dashboardDesc: "Dashboard."
            },
            lg: {
                listening: "Nkwuliriza. Gamba ekiragiro kyo.",
                recognitionError: "Nange ssaabitegeera bulungi. Ddamu ogezese.",
                notSupported: "Okutegeera eddoboozi tekuli mu browser yo.",
                notUnderstood: "Ssaabitegeera. Gamba 'yamba' okufuna obuyambi.",
                navigating: "Nkukyusa ku",
                languageChanged: "Olulimi lwakyuuseddwa ku",
                sayLanguage: "Gamba English, Luganda, oba Swahili okukyuusa olulimi.",
                voiceEnabled: "Obuyambi bw'eddoboozi buweddwa.",
                voiceDisabled: "Obuyambi bw'eddoboozi busaziddwa.",
                youAreOn: "Oli ku",
                emergencyTriggered: "SOS yako etandise!",
                loggingOut: "Okuva mu sisitemu...",
                helpText: "Nsobola okukuyamba okutambulira, okukyuusa olulimi, oba okufuna ebintu. Gezese: genda ku kkubo, bookinga, kyuusa olulimi, oba yamba.",
                homePage: "kkubo",
                loginPage: "login",
                registerPage: "register",
                bookingPage: "booking",
                trackingPage: "trip tracking",
                feedbackPage: "feedback",
                dashboardPage: "dashboard"
            },
            sw: {
                listening: "Ninasikiliza. Tafadhali sema amri yako.",
                recognitionError: "Samahani, sikusikia vizuri. Tafadhali jaribu tena.",
                notSupported: "Utambuzi wa sauti haupatikani katika browser yako.",
                notUnderstood: "Sijaelewa. Jaribu kusema 'saidia' kupata msaada.",
                navigating: "Nakuelekeza kwenda",
                languageChanged: "Lugha imebadilishwa kuwa",
                sayLanguage: "Tafadhali sema English, Luganda, au Swahili kubadilisha lugha.",
                voiceEnabled: "Msaidizi wa sauti amewashwa.",
                voiceDisabled: "Msaidizi wa sauti amezimwa.",
                youAreOn: "Uko kwenye",
                emergencyTriggered: "SOS imewashwa!",
                loggingOut: "Unaondoka...",
                helpText: "Ninaweza kukusaidia kusogeza, kubadilisha lugha, au kufikia vipengele. Jaribu kusema: nenda nyumbani, book, badili lugha, au saidia.",
                homePage: "ukurasa wa nyumbani",
                loginPage: "ukurasa wa kuingia",
                registerPage: "ukurasa wa kujisajili",
                bookingPage: "ukurasa wa booking",
                trackingPage: "ukurasa wa ufuatiliaji",
                feedbackPage: "ukurasa wa maoni",
                dashboardPage: "dashibodi"
            }
        };

        return texts[this.currentLanguage]?.[key] || texts.en[key] || key;
    }
}

// Initialize voice assistant when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.voiceAssistant = new VoiceAssistant();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VoiceAssistant;
}