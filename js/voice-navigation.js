// Voice Navigation Implementation
// This script enables voice commands for portfolio navigation

// Global variables
let recognition;
let isListening = false;
let voiceIndicator;
let voiceStatusText;

// Initialize voice navigation
function initVoiceNavigation() {
    // Check if browser supports speech recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.log('Voice navigation is not supported in this browser');
        return;
    }
    
    // Get DOM elements
    const voiceNavBtn = document.getElementById('voice-nav-toggle');
    const voiceNavModal = document.getElementById('voice-nav-modal');
    const closeVoiceNavBtn = document.getElementById('close-voice-nav');
    voiceIndicator = document.querySelector('.voice-indicator');
    voiceStatusText = document.getElementById('voice-status-text');
    
    if (!voiceNavBtn || !voiceNavModal || !closeVoiceNavBtn || !voiceIndicator || !voiceStatusText) {
        console.log('Voice navigation elements not found');
        return;
    }
    
    // Initialize speech recognition
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    // Set up event listeners
    voiceNavBtn.addEventListener('click', toggleListening);
    closeVoiceNavBtn.addEventListener('click', () => {
        stopListening();
        voiceNavModal.style.display = 'none';
    });
    
    // Set up recognition events
    recognition.onstart = () => {
        isListening = true;
        voiceIndicator.classList.add('listening');
        voiceStatusText.textContent = 'Listening...';
        voiceNavBtn.innerHTML = '<i class="fas fa-microphone-slash"></i>';
    };
    
    recognition.onend = () => {
        isListening = false;
        voiceIndicator.classList.remove('listening');
        voiceStatusText.textContent = 'Click the microphone to start';
        voiceNavBtn.innerHTML = '<i class="fas fa-microphone"></i>';
    };
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        voiceStatusText.textContent = `Command: "${transcript}"`;
        
        // Process voice command
        processVoiceCommand(transcript);
    };
    
    recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        voiceStatusText.textContent = `Error: ${event.error}`;
        stopListening();
    };
}

// Toggle listening state
function toggleListening() {
    if (isListening) {
        stopListening();
    } else {
        startListening();
    }
}

// Start listening for voice commands
function startListening() {
    try {
        recognition.start();
    } catch (error) {
        console.error('Speech recognition error', error);
    }
}

// Stop listening for voice commands
function stopListening() {
    try {
        recognition.stop();
    } catch (error) {
        console.error('Speech recognition error', error);
    }
}

// Process voice command
function processVoiceCommand(command) {
    // Navigation commands
    if (command.includes('go to home') || command.includes('home')) {
        scrollToSection('hero');
    } else if (command.includes('about')) {
        scrollToSection('about');
    } else if (command.includes('skills')) {
        scrollToSection('skills');
    } else if (command.includes('projects')) {
        scrollToSection('projects');
    } else if (command.includes('experience')) {
        scrollToSection('experience');
    } else if (command.includes('contact')) {
        scrollToSection('contact');
    } else if (command.includes('playground')) {
        scrollToSection('playground');
    } 
    // Theme commands
    else if (command.includes('dark mode') || command.includes('night mode')) {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
        localStorage.setItem('theme', 'dark');
    } else if (command.includes('light mode') || command.includes('day mode')) {
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
    }
    // Unrecognized command
    else {
        voiceStatusText.textContent = `Command not recognized: "${command}"`;
    }
}

// Scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    
    if (section) {
        window.scrollTo({
            top: section.offsetTop - 70,
            behavior: 'smooth'
        });
        
        voiceStatusText.textContent = `Navigating to ${sectionId} section`;
    } else {
        voiceStatusText.textContent = `Section ${sectionId} not found`;
    }
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', initVoiceNavigation);
