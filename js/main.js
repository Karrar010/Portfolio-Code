// Main JavaScript file for portfolio website

// DOM Elements
const preloader = document.querySelector('.preloader');
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const body = document.body;
const navLinks = document.querySelectorAll('.nav-links a');
const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
const mainNav = document.querySelector('.main-nav');
const typewriterText = document.getElementById('typewriter-text');
const projectCards = document.querySelectorAll('.project-card');
const filterBtns = document.querySelectorAll('.filter-btn');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const timelineControls = document.querySelectorAll('.timeline-control');
const timelineItems = document.querySelectorAll('.timeline-item');
const contactForm = document.getElementById('contact-form');
const voiceNavBtn = document.getElementById('voice-nav-toggle');
const voiceNavModal = document.getElementById('voice-nav-modal');
const closeVoiceNavBtn = document.getElementById('close-voice-nav');
const voiceStatusText = document.getElementById('voice-status-text');
const loadMoreProjectsBtn = document.getElementById('load-more-projects');
const glitchText = document.querySelector('.glitch-text');

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    // Set data-text attribute for glitch effect
    if (glitchText) {
        glitchText.setAttribute('data-text', glitchText.textContent);
    }
    
    // Initialize typewriter effect
    initTypewriter();
    
    // Hide preloader after content loads
    setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
    }, 1500);
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize form validation
    initFormValidation();
    
    // Initialize AI chat
    initAIChat();
});

// Theme Toggle
themeToggleBtn.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    
    // Save theme preference to localStorage
    const isDarkMode = body.classList.contains('dark-mode');
    const isLightMode = body.classList.contains('light-mode');
    
    if (isLightMode) {
        localStorage.setItem('theme', 'light');
    } else {
        localStorage.setItem('theme', 'dark');
    }
});

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    body.classList.add('light-mode');
    body.classList.remove('dark-mode');
} else {
    body.classList.add('dark-mode');
    body.classList.remove('light-mode');
}

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            window.scrollTo({
                top: targetSection.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});

// Mobile Navigation Toggle
if (mobileNavToggle) {
    mobileNavToggle.addEventListener('click', () => {
        mobileNavToggle.classList.toggle('active');
        document.querySelector('.nav-links').classList.toggle('active');
    });
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        mainNav.classList.add('scrolled');
    } else {
        mainNav.classList.remove('scrolled');
    }
});

// Typewriter effect
function initTypewriter() {
    if (!typewriterText) return;
    
    const phrases = [
        'Frontend Developer',
        'UI/UX Enthusiast',
        'Creative Coder',
        'Problem Solver'
    ];
    
    let currentPhraseIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function type() {
        const currentPhrase = phrases[currentPhraseIndex];
        
        if (isDeleting) {
            typewriterText.textContent = currentPhrase.substring(0, currentCharIndex - 1);
            currentCharIndex--;
            typingSpeed = 50;
        } else {
            typewriterText.textContent = currentPhrase.substring(0, currentCharIndex + 1);
            currentCharIndex++;
            typingSpeed = 100;
        }
        
        if (!isDeleting && currentCharIndex === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 1000; // Pause at the end
        } else if (isDeleting && currentCharIndex === 0) {
            isDeleting = false;
            currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
            typingSpeed = 500; // Pause before typing next phrase
        }
        
        setTimeout(type, typingSpeed);
    }
    
    setTimeout(type, 1000);
}

// Project filtering
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        btn.classList.add('active');
        
        const filterValue = btn.getAttribute('data-filter');
        
        projectCards.forEach(card => {
            if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Tab switching in playground
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons and contents
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked button
        btn.classList.add('active');
        
        // Show corresponding content
        const tabId = btn.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
    });
});

// Timeline navigation
let currentTimelineIndex = 0;

function updateTimeline() {
    timelineItems.forEach((item, index) => {
        item.classList.remove('active');
        if (index === currentTimelineIndex) {
            item.classList.add('active');
        }
    });
}

timelineControls.forEach(control => {
    control.addEventListener('click', () => {
        const direction = control.getAttribute('data-direction');
        
        if (direction === 'next' && currentTimelineIndex < timelineItems.length - 1) {
            currentTimelineIndex++;
        } else if (direction === 'prev' && currentTimelineIndex > 0) {
            currentTimelineIndex--;
        }
        
        updateTimeline();
    });
});

// Form validation
function initFormValidation() {
    if (!contactForm) return;
    
    const formInputs = contactForm.querySelectorAll('input, textarea');
    
    formInputs.forEach(input => {
        input.addEventListener('blur', validateInput);
        input.addEventListener('input', validateInput);
    });
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        formInputs.forEach(input => {
            if (!validateInput({ target: input })) {
                isValid = false;
            }
        });
        
        if (isValid) {
            // Simulate form submission
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            
            setTimeout(() => {
                submitBtn.textContent = 'Message Sent!';
                contactForm.reset();
                
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }, 2000);
            }, 1500);
        }
    });
}

function validateInput(e) {
    const input = e.target;
    const value = input.value.trim();
    const validation = input.parentElement.querySelector('.form-validation');
    
    let isValid = true;
    let message = '';
    
    if (input.required && value === '') {
        isValid = false;
        message = 'This field is required';
    } else if (input.type === 'email' && value !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            message = 'Please enter a valid email address';
        }
    }
    
    if (isValid) {
        input.style.borderColor = 'var(--accent-primary)';
    } else {
        input.style.borderColor = 'var(--accent-tertiary)';
    }
    
    if (validation) {
        validation.textContent = message;
    }
    
    return isValid;
}

// AI Chat functionality
function initAIChat() {
    const chatMessages = document.getElementById('chat-messages');
    const userMessageInput = document.getElementById('user-message');
    const sendMessageBtn = document.getElementById('send-message');
    
    if (!chatMessages || !userMessageInput || !sendMessageBtn) return;
    
    // Sample responses for demo
    const responses = {
        'hello': 'Hello! How can I help you navigate this portfolio?',
        'hi': 'Hi there! Feel free to ask me about any section of this portfolio.',
        'skills': 'The Skills section showcases a 3D visualization of interconnected skills. You can interact with it to explore different skill categories.',
        'projects': 'The Projects section displays various projects with filtering options. Click on a project to see more details.',
        'contact': 'You can use the contact form to send a message. All fields are validated in real-time.',
        'experience': 'The Experience section shows a timeline of professional experience. Use the navigation arrows to explore different positions.',
        'about': 'The About section provides information about the portfolio owner, including background and expertise.',
        'help': 'You can ask me about any section of the portfolio, including Skills, Projects, Experience, or how to contact the owner.'
    };
    
    function addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        const messagePara = document.createElement('p');
        messagePara.textContent = content;
        
        messageContent.appendChild(messagePara);
        messageDiv.appendChild(messageContent);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function getResponse(message) {
        message = message.toLowerCase();
        
        // Check for exact matches
        if (responses[message]) {
            return responses[message];
        }
        
        // Check for partial matches
        for (const key in responses) {
            if (message.includes(key)) {
                return responses[key];
            }
        }
        
        // Default response
        return "I'm not sure how to help with that. You can ask me about skills, projects, experience, or contact information.";
    }
    
    sendMessageBtn.addEventListener('click', () => {
        const message = userMessageInput.value.trim();
        
        if (message) {
            addMessage(message, true);
            userMessageInput.value = '';
            
            // Simulate typing delay
            setTimeout(() => {
                const response = getResponse(message);
                addMessage(response);
            }, 500);
        }
    });
    
    userMessageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessageBtn.click();
        }
    });
}

// Voice Navigation
if (voiceNavBtn && voiceNavModal) {
    voiceNavBtn.addEventListener('click', toggleVoiceNavigation);
    closeVoiceNavBtn.addEventListener('click', () => {
        voiceNavModal.style.display = 'none';
    });
}

function toggleVoiceNavigation() {
    voiceNavModal.style.display = 'flex';
    
    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        voiceStatusText.textContent = 'Click the microphone to start listening';
    } else {
        voiceStatusText.textContent = 'Voice recognition is not supported in your browser';
        voiceNavBtn.disabled = true;
    }
}

// Scroll animations
function initScrollAnimations() {
    const sections = document.querySelectorAll('section');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}

// Load more projects functionality
if (loadMoreProjectsBtn) {
    loadMoreProjectsBtn.addEventListener('click', () => {
        // This would typically load more projects from an API
        // For demo purposes, we'll just disable the button
        loadMoreProjectsBtn.disabled = true;
        loadMoreProjectsBtn.textContent = 'No More Projects';
    });
}

// Add scroll-triggered animations with CSS classes
document.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    
    document.querySelectorAll('.fade-in').forEach(element => {
        const elementPosition = element.offsetTop;
        
        if (scrollPosition > elementPosition - window.innerHeight * 0.8) {
            element.classList.add('visible');
        }
    });
});

// Code editor functionality
const codeEditorArea = document.getElementById('code-editor-area');
const runCodeBtn = document.getElementById('run-code');
const codeOutput = document.getElementById('code-output');
const languageSelect = document.getElementById('language-select');

if (codeEditorArea && runCodeBtn && codeOutput) {
    runCodeBtn.addEventListener('click', () => {
        const code = codeEditorArea.textContent;
        const language = languageSelect.value;
        
        // Simple code execution simulation
        codeOutput.innerHTML = '';
        
        try {
            if (language === 'javascript') {
                // For demo purposes, we're using a very simple and limited evaluation
                // In a real application, this would need proper sandboxing
                const result = Function('"use strict";return (' + code + ')')();
                codeOutput.textContent = typeof result === 'object' ? 
                    JSON.stringify(result, null, 2) : String(result);
            } else {
                codeOutput.textContent = `Code execution for ${language} is simulated in this demo.`;
            }
        } catch (error) {
            codeOutput.textContent = `Error: ${error.message}`;
        }
    });
}
