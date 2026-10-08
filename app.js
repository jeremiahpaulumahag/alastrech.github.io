// Main application for 4-Minute Office Stretch
import { CharacterRenderer } from './character-renderer.js';
import { AudioManager } from './audio-manager.js';
import { VoiceController } from './voice-controller.js';
import { exercises } from './exercises.js';

class StretchApp {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.currentRound = 0;
        this.timeRemaining = 30;
        this.totalTime = 240; // 4 minutes
        this.elapsedTime = 0;
        this.isPlaying = false;
        this.isPaused = false;
        this.lastFrameTime = 0;
        this.animationFrame = null;
        
        this.characterRenderer = new CharacterRenderer(this.ctx, this.canvas.width, this.canvas.height);
        this.audioManager = new AudioManager();
        this.voiceController = new VoiceController(this);
        
        this.setupUI();
        this.render();
    }
    
    setupUI() {
        document.getElementById('play-btn').addEventListener('click', () => this.start());
        document.getElementById('pause-btn').addEventListener('click', () => this.togglePause());
        document.getElementById('restart-btn').addEventListener('click', () => this.restart());
        document.getElementById('voice-btn').addEventListener('click', () => this.voiceController.toggle());
        document.getElementById('restart-complete-btn').addEventListener('click', () => this.restart());
    }
    
    start() {
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        this.isPaused = false;
        this.lastFrameTime = performance.now();
        
        document.getElementById('play-btn').style.display = 'none';
        document.getElementById('pause-btn').style.display = 'inline-block';
        document.getElementById('complete-message').style.display = 'none';
        
        this.audioManager.startBackgroundMusic();
        this.announceExercise();
        this.animate(this.lastFrameTime);
    }
    
    togglePause() {
        this.isPaused = !this.isPaused;
        const btn = document.getElementById('pause-btn');
        
        if (this.isPaused) {
            btn.textContent = '▶ Resume';
            this.audioManager.pause();
        } else {
            btn.textContent = '⏸ Pause';
            this.audioManager.resume();
            this.lastFrameTime = performance.now();
        }
    }
    
    restart() {
        this.isPlaying = false;
        this.isPaused = false;
        this.currentRound = 0;
        this.timeRemaining = 30;
        this.elapsedTime = 0;
        
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        
        document.getElementById('play-btn').style.display = 'inline-block';
        document.getElementById('pause-btn').style.display = 'none';
        document.getElementById('complete-message').style.display = 'none';
        
        this.audioManager.stop();
        this.updateUI();
        this.render();
    }
    
    animate(timestamp) {
        if (!this.isPlaying) return;
        
        if (!this.isPaused) {
            const deltaTime = (timestamp - this.lastFrameTime) / 1000;
            this.lastFrameTime = timestamp;
            
            this.timeRemaining -= deltaTime;
            this.elapsedTime += deltaTime;
            
            const timeInt = Math.ceil(this.timeRemaining);
            if (timeInt <= 3 && timeInt > 0 && Math.abs(this.timeRemaining - timeInt) < deltaTime) {
                this.audioManager.playCountdown();
            }
            
            if (this.timeRemaining <= 0) {
                this.currentRound++;
                
                if (this.currentRound >= 8) {
                    this.complete();
                    return;
                }
                
                this.timeRemaining = 30;
                this.audioManager.playTransition();
                this.announceExercise();
            }
            
            this.updateUI();
            this.render();
        }
        
        this.animationFrame = requestAnimationFrame((t) => this.animate(t));
    }
    
    announceExercise() {
        const exercise = exercises[this.currentRound];
        this.audioManager.speak(exercise.name);
    }
    
    updateUI() {
        const exercise = exercises[this.currentRound];
        document.getElementById('exercise-title').textContent = exercise.name;
        document.getElementById('round-info').textContent = `Round ${this.currentRound + 1} of 8`;
        document.getElementById('timer').textContent = Math.ceil(this.timeRemaining);
        
        const progress = (this.elapsedTime / this.totalTime) * 100;
        document.getElementById('progress-fill').style.width = `${Math.min(progress, 100)}%`;
    }
    
    render() {
        this.ctx.fillStyle = '#87ceeb';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        const skyGradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height * 0.6);
        skyGradient.addColorStop(0, '#87ceeb');
        skyGradient.addColorStop(1, '#e0f6ff');
        this.ctx.fillStyle = skyGradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height * 0.6);
        
        const floorGradient = this.ctx.createLinearGradient(0, this.canvas.height * 0.6, 0, this.canvas.height);
        floorGradient.addColorStop(0, '#f0f0f0');
        floorGradient.addColorStop(1, '#d0d0d0');
        this.ctx.fillStyle = floorGradient;
        this.ctx.fillRect(0, this.canvas.height * 0.6, this.canvas.width, this.canvas.height * 0.4);
        
        const exercise = exercises[this.currentRound];
        const animTime = 30 - this.timeRemaining;
        this.characterRenderer.render(exercise, animTime);
    }
    
    complete() {
        this.isPlaying = false;
        document.getElementById('complete-message').style.display = 'block';
        document.getElementById('pause-btn').style.display = 'none';
        this.audioManager.playComplete();
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new StretchApp();
});
