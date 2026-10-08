// Voice Controller - handles voice commands
export class VoiceController {
    constructor(app) {
        this.app = app;
        this.isListening = false;
        this.recognition = null;
        
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = true;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';
            
            this.recognition.onresult = (event) => {
                const last = event.results.length - 1;
                const command = event.results[last][0].transcript.toLowerCase().trim();
                this.handleCommand(command);
            };
            
            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.updateStatus('Voice recognition error');
            };
        } else {
            document.getElementById('voice-btn').disabled = true;
            document.getElementById('voice-btn').textContent = '🎤 Not Supported';
        }
    }
    
    toggle() {
        if (!this.recognition) return;
        
        if (this.isListening) {
            this.stop();
        } else {
            this.start();
        }
    }
    
    start() {
        if (!this.recognition) return;
        
        try {
            this.recognition.start();
            this.isListening = true;
            document.getElementById('voice-btn').classList.add('listening');
            document.getElementById('voice-btn').textContent = '🎤 Listening...';
            this.updateStatus('Listening for commands...');
        } catch (e) {
            console.error('Failed to start recognition:', e);
        }
    }
    
    stop() {
        if (!this.recognition) return;
        
        this.recognition.stop();
        this.isListening = false;
        document.getElementById('voice-btn').classList.remove('listening');
        document.getElementById('voice-btn').textContent = '🎤 Voice Control';
        this.updateStatus('');
    }
    
    handleCommand(command) {
        this.updateStatus(`Command: "${command}"`);
        
        if (command.includes('start') || command.includes('play') || command.includes('begin')) {
            this.app.start();
            this.updateStatus('Starting workout!');
        } else if (command.includes('pause') || command.includes('stop')) {
            if (this.app.isPlaying) {
                this.app.togglePause();
                this.updateStatus('Paused');
            }
        } else if (command.includes('resume') || command.includes('continue')) {
            if (this.app.isPaused) {
                this.app.togglePause();
                this.updateStatus('Resumed');
            }
        } else if (command.includes('restart') || command.includes('reset')) {
            this.app.restart();
            this.updateStatus('Restarted');
        }
    }
    
    updateStatus(text) {
        document.getElementById('voice-status').textContent = text;
        if (text) {
            setTimeout(() => {
                if (document.getElementById('voice-status').textContent === text) {
                    document.getElementById('voice-status').textContent = '';
                }
            }, 3000);
        }
    }
}
