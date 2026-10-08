// Audio Manager - High-Energy Workout Music & Sound Effects
export class AudioManager {
    constructor() {
        this.audioContext = null;
        this.musicGainNode = null;
        this.sfxGainNode = null;
        this.masterGainNode = null;
        
        // Music sources
        this.kickSource = null;
        this.snareSource = null;
        this.hihatSource = null;
        this.bassSource = null;
        this.leadSource = null;
        this.padSource = null;
        
        this.isInitialized = false;
        this.isPaused = false;
        this.isSpeaking = false;
        this.musicStartTime = 0;
        this.pausedAt = 0;
        
        // Musical parameters
        this.bpm = 130; // Energetic workout tempo
        this.beatDuration = 60 / this.bpm;
        this.measureDuration = this.beatDuration * 4;
        
        // Chord progression: C - G - Am - F (I-V-vi-IV)
        this.chordProgression = [
            { root: 261.63, third: 329.63, fifth: 392.00, name: 'C' },  // C Major
            { root: 392.00, third: 493.88, fifth: 587.33, name: 'G' },  // G Major
            { root: 220.00, third: 261.63, fifth: 329.63, name: 'Am' }, // A Minor
            { root: 349.23, third: 440.00, fifth: 523.25, name: 'F' }   // F Major
        ];
        
        // Lead melody notes (energetic, motivating pattern)
        this.melodyPattern = [
            523.25, 587.33, 659.25, 783.99, // C5, D5, E5, G5
            783.99, 659.25, 587.33, 523.25, // G5, E5, D5, C5
            659.25, 783.99, 880.00, 783.99, // E5, G5, A5, G5
            659.25, 587.33, 523.25, 392.00  // E5, D5, C5, G4
        ];
        
        // Web Speech API
        this.synth = window.speechSynthesis;
        this.voices = [];
        
        if (this.synth) {
            this.synth.onvoiceschanged = () => {
                this.voices = this.synth.getVoices();
            };
        }
    }
    
    initAudioContext() {
        if (this.isInitialized) return;
        
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create gain nodes for mixing
        this.masterGainNode = this.audioContext.createGain();
        this.musicGainNode = this.audioContext.createGain();
        this.sfxGainNode = this.audioContext.createGain();
        
        // Connect gain nodes
        this.musicGainNode.connect(this.masterGainNode);
        this.sfxGainNode.connect(this.masterGainNode);
        this.masterGainNode.connect(this.audioContext.destination);
        
        // Set volume levels
        this.masterGainNode.gain.value = 0.8;
        this.musicGainNode.gain.value = 0.4;
        this.sfxGainNode.gain.value = 0.6;
        
        this.isInitialized = true;
    }
    
    startBackgroundMusic() {
        this.initAudioContext();
        this.stopAllMusic();
        this.musicStartTime = this.audioContext.currentTime;
        this.createDrumTrack();
        this.createBassLine();
        this.createLeadMelody();
        this.createPadSynth();
    }
    
    stopAllMusic() {
        const sources = [this.kickSource, this.snareSource, this.hihatSource, 
                        this.bassSource, this.leadSource, this.padSource];
        sources.forEach(source => {
            if (source) {
                try { source.stop(); } catch(e) {}
            }
        });
    }
    
    // Create energetic drum track with kick, snare, and hi-hat
    createDrumTrack() {
        const startTime = this.audioContext.currentTime;
        const loopDuration = this.measureDuration * 4; // 4 measures
        
        // KICK DRUM - 4-on-the-floor pattern (every beat)
        const kickPattern = [0, 1, 2, 3]; // Beats in a measure
        this.scheduleKickDrum(startTime, loopDuration, kickPattern);
        
        // SNARE - on beats 2 and 4
        const snarePattern = [1, 3];
        this.scheduleSnare(startTime, loopDuration, snarePattern);
        
        // HI-HAT - 16th note pattern for energy
        this.scheduleHiHat(startTime, loopDuration);
    }
    
    scheduleKickDrum(startTime, loopDuration, pattern) {
        const scheduleLoop = () => {
            const now = this.audioContext.currentTime;
            const loopTime = now - startTime;
            const nextLoopStart = startTime + Math.ceil(loopTime / loopDuration) * loopDuration;
            
            for (let measure = 0; measure < 4; measure++) {
                pattern.forEach(beat => {
                    const time = nextLoopStart + (measure * this.measureDuration) + (beat * this.beatDuration);
                    if (time > now) {
                        this.playKick(time);
                    }
                });
            }
            
            setTimeout(scheduleLoop, (loopDuration - 0.1) * 1000);
        };
        scheduleLoop();
    }
    
    playKick(time) {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, time);
        osc.frequency.exponentialRampToValueAtTime(40, time + 0.05);
        
        gain.gain.setValueAtTime(0.8, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.3);
        
        osc.connect(gain);
        gain.connect(this.musicGainNode);
        
        osc.start(time);
        osc.stop(time + 0.3);
    }
    
    scheduleSnare(startTime, loopDuration, pattern) {
        const scheduleLoop = () => {
            const now = this.audioContext.currentTime;
            const loopTime = now - startTime;
            const nextLoopStart = startTime + Math.ceil(loopTime / loopDuration) * loopDuration;
            
            for (let measure = 0; measure < 4; measure++) {
                pattern.forEach(beat => {
                    const time = nextLoopStart + (measure * this.measureDuration) + (beat * this.beatDuration);
                    if (time > now) {
                        this.playSnare(time);
                    }
                });
            }
            
            setTimeout(scheduleLoop, (loopDuration - 0.1) * 1000);
        };
        scheduleLoop();
    }
    
    playSnare(time) {
        const noiseBuffer = this.createNoiseBuffer(0.1);
        const noise = this.audioContext.createBufferSource();
        noise.buffer = noiseBuffer;
        
        const noiseFilter = this.audioContext.createBiquadFilter();
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.value = 2000;
        
        const noiseGain = this.audioContext.createGain();
        noiseGain.gain.setValueAtTime(0.5, time);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
        
        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.musicGainNode);
        
        noise.start(time);
        noise.stop(time + 0.1);
        
        const osc = this.audioContext.createOscillator();
        const oscGain = this.audioContext.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(200, time);
        osc.frequency.exponentialRampToValueAtTime(100, time + 0.05);
        
        oscGain.gain.setValueAtTime(0.3, time);
        oscGain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
        
        osc.connect(oscGain);
        oscGain.connect(this.musicGainNode);
        
        osc.start(time);
        osc.stop(time + 0.1);
    }
    
    scheduleHiHat(startTime, loopDuration) {
        const scheduleLoop = () => {
            const now = this.audioContext.currentTime;
            const loopTime = now - startTime;
            const nextLoopStart = startTime + Math.ceil(loopTime / loopDuration) * loopDuration;
            
            const sixteenthDuration = this.beatDuration / 4;
            const notesPerMeasure = 16;
            
            for (let measure = 0; measure < 4; measure++) {
                for (let note = 0; note < notesPerMeasure; note++) {
                    const time = nextLoopStart + (measure * this.measureDuration) + (note * sixteenthDuration);
                    if (time > now) {
                        const accent = note % 2 === 0 ? 0.3 : 0.15;
                        this.playHiHat(time, accent);
                    }
                }
            }
            
            setTimeout(scheduleLoop, (loopDuration - 0.1) * 1000);
        };
        scheduleLoop();
    }
    
    playHiHat(time, volume) {
        const noiseBuffer = this.createNoiseBuffer(0.05);
        const noise = this.audioContext.createBufferSource();
        noise.buffer = noiseBuffer;
        
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 7000;
        
        const gain = this.audioContext.createGain();
        gain.gain.setValueAtTime(volume, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.05);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicGainNode);
        
        noise.start(time);
        noise.stop(time + 0.05);
    }
    
    createNoiseBuffer(duration) {
        const sampleRate = this.audioContext.sampleRate;
        const bufferSize = sampleRate * duration;
        const buffer = this.audioContext.createBuffer(1, bufferSize, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        return buffer;
    }
    
    // Create driving bass line following chord progression
    createBassLine() {
        const startTime = this.audioContext.currentTime;
        const loopDuration = this.measureDuration * 4;
        
        const scheduleBass = () => {
            const now = this.audioContext.currentTime;
            const loopTime = now - startTime;
            const nextLoopStart = startTime + Math.ceil(loopTime / loopDuration) * loopDuration;
            
            this.chordProgression.forEach((chord, chordIndex) => {
                const measureStart = nextLoopStart + (chordIndex * this.measureDuration);
                
                // Play bass on beats 1 and 3
                [0, 2].forEach(beat => {
                    const time = measureStart + (beat * this.beatDuration);
                    if (time > now) {
                        this.playBassNote(time, chord.root / 2, 0.25);
                    }
                });
                
                // Add eighth note on beat 2.5 for groove
                const eighthTime = measureStart + (1.5 * this.beatDuration);
                if (eighthTime > now) {
                    this.playBassNote(eighthTime, chord.root / 2, 0.15);
                }
            });
            
            setTimeout(scheduleBass, (loopDuration - 0.1) * 1000);
        };
        scheduleBass();
    }
    
    playBassNote(time, freq, volume) {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, time);
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, time);
        filter.Q.value = 5;
        
        gain.gain.setValueAtTime(volume, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.25);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicGainNode);
        
        osc.start(time);
        osc.stop(time + 0.25);
    }
    
    // Create energetic lead melody
    createLeadMelody() {
        const startTime = this.audioContext.currentTime;
        const loopDuration = this.measureDuration * 4;
        
        const scheduleLead = () => {
            const now = this.audioContext.currentTime;
            const loopTime = now - startTime;
            const nextLoopStart = startTime + Math.ceil(loopTime / loopDuration) * loopDuration;
            
            const noteDuration = this.beatDuration / 2; // Eighth notes
            
            this.melodyPattern.forEach((freq, noteIndex) => {
                const time = nextLoopStart + (noteIndex * noteDuration);
                if (time > now) {
                    this.playLeadNote(time, freq, noteDuration * 0.9);
                }
            });
            
            setTimeout(scheduleLead, (loopDuration - 0.1) * 1000);
        };
        scheduleLead();
    }
    
    playLeadNote(time, freq, duration) {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, time);
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2000, time);
        filter.Q.value = 1;
        
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.12, time + 0.02);
        gain.gain.setValueAtTime(0.12, time + duration * 0.7);
        gain.gain.linearRampToValueAtTime(0.01, time + duration);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicGainNode);
        
        osc.start(time);
        osc.stop(time + duration);
    }
    
    // Create warm pad synth for harmony
    createPadSynth() {
        const startTime = this.audioContext.currentTime;
        const loopDuration = this.measureDuration * 4;
        
        const schedulePad = () => {
            const now = this.audioContext.currentTime;
            const loopTime = now - startTime;
            const nextLoopStart = startTime + Math.ceil(loopTime / loopDuration) * loopDuration;
            
            this.chordProgression.forEach((chord, chordIndex) => {
                const time = nextLoopStart + (chordIndex * this.measureDuration);
                if (time > now) {
                    this.playPadChord(time, chord, this.measureDuration);
                }
            });
            
            setTimeout(schedulePad, (loopDuration - 0.1) * 1000);
        };
        schedulePad();
    }
    
    playPadChord(time, chord, duration) {
        const freqs = [chord.root, chord.third, chord.fifth];
        
        freqs.forEach(freq => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq * 2, time);
            
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(1000, time);
            filter.Q.value = 0.5;
            
            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(0.06, time + 0.1);
            gain.gain.setValueAtTime(0.06, time + duration - 0.1);
            gain.gain.linearRampToValueAtTime(0.01, time + duration);
            
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.musicGainNode);
            
            osc.start(time);
            osc.stop(time + duration);
        });
    }
    
    speak(text) {
        if (!this.synth) return;
        
        this.isSpeaking = true;
        
        // Duck music when speaking
        if (this.musicGainNode) {
            this.musicGainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            this.musicGainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.2);
        }
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        
        // Find a good voice
        const femaleVoice = this.voices.find(v => v.lang.startsWith('en') && v.name.includes('Female'));
        if (femaleVoice) utterance.voice = femaleVoice;
        
        utterance.onend = () => {
            this.isSpeaking = false;
            // Restore music volume
            if (this.musicGainNode && this.audioContext) {
                this.musicGainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
                this.musicGainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.5);
            }
        };
        
        this.synth.speak(utterance);
    }
    
    playCountdown() {
        if (!this.audioContext) return;
        
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, this.audioContext.currentTime);
        
        gain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        
        osc.connect(gain);
        gain.connect(this.sfxGainNode);
        
        osc.start();
        osc.stop(this.audioContext.currentTime + 0.1);
    }
    
    playTransition() {
        if (!this.audioContext) return;
        
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, this.audioContext.currentTime);
        osc.frequency.linearRampToValueAtTime(400, this.audioContext.currentTime + 0.2);
        
        gain.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
        
        osc.connect(gain);
        gain.connect(this.sfxGainNode);
        
        osc.start();
        osc.stop(this.audioContext.currentTime + 0.2);
    }
    
    playComplete() {
        this.speak("Amazing work! You've completed your stretch!");
        
        if (!this.audioContext) return;
        
        // Play celebration sound
        const times = [0, 0.1, 0.2];
        times.forEach(time => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800 + time * 200, this.audioContext.currentTime + time);
            
            gain.gain.setValueAtTime(0.2, this.audioContext.currentTime + time);
            gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + time + 0.3);
            
            osc.connect(gain);
            gain.connect(this.sfxGainNode);
            
            osc.start(this.audioContext.currentTime + time);
            osc.stop(this.audioContext.currentTime + time + 0.3);
        });
    }
    
    pause() {
        if (this.audioContext && this.audioContext.state === 'running') {
            this.audioContext.suspend();
        }
        if (this.synth) {
            this.synth.pause();
        }
        this.isPaused = true;
    }
    
    resume() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        if (this.synth) {
            this.synth.resume();
        }
        this.isPaused = false;
    }
    
    stop() {
        this.stopAllMusic();
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
        if (this.synth) {
            this.synth.cancel();
        }
        this.isInitialized = false;
        this.isPaused = false;
    }
}

