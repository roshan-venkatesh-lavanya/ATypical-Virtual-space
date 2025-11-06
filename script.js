// User Personalization
class UserProfile {
    constructor() {
        this.loadProfile();
        this.initPersonalization();
    }
    
    loadProfile() {
        const saved = localStorage.getItem('atypical-profile');
        if (saved) {
            this.profile = JSON.parse(saved);
            this.updateUI();
            // Show modal every time to allow updates
            setTimeout(() => {
                this.showPersonalizationModal();
            }, 500);
        } else {
            this.showPersonalizationModal();
        }
    }
    
    showPersonalizationModal() {
        document.getElementById('personalization-modal').style.display = 'flex';
    }
    
    initPersonalization() {
        const form = document.getElementById('personalization-form');
        const pronounsSelect = document.getElementById('user-pronouns');
        const customPronounsGroup = document.getElementById('custom-pronouns-group');
        const modal = document.getElementById('personalization-modal');
        
        pronounsSelect.addEventListener('change', (e) => {
            if (e.target.value === 'custom') {
                customPronounsGroup.style.display = 'block';
                document.getElementById('custom-pronouns').required = true;
            } else {
                customPronounsGroup.style.display = 'none';
                document.getElementById('custom-pronouns').required = false;
            }
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                // Don't close if no profile exists yet
                if (this.profile) {
                    modal.style.display = 'none';
                }
            }
        });
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('user-name').value.trim();
            let pronouns = document.getElementById('user-pronouns').value;
            
            if (pronouns === 'custom') {
                pronouns = document.getElementById('custom-pronouns').value.trim();
            }
            
            this.profile = { name, pronouns };
            localStorage.setItem('atypical-profile', JSON.stringify(this.profile));
            document.getElementById('personalization-modal').style.display = 'none';
            this.updateUI();
            if (window.affirmationSystem) {
                window.affirmationSystem.showAffirmation();
            }
        });
        
        document.getElementById('update-profile').addEventListener('click', () => {
            document.getElementById('settings-modal').style.display = 'none';
            this.showPersonalizationModal();
        });
        
        // Skip button handler
        const skipBtn = document.getElementById('skip-personalization');
        if (skipBtn) {
            skipBtn.addEventListener('click', () => {
                document.getElementById('personalization-modal').style.display = 'none';
            });
        }
    }
    
    updateUI() {
        if (!this.profile) return;
        
        const { name, pronouns } = this.profile;
        const pronounMap = {
            'they/them': { subject: 'they', object: 'them', possessive: 'their' },
            'she/her': { subject: 'she', object: 'her', possessive: 'her' },
            'he/him': { subject: 'he', object: 'him', possessive: 'his' },
            'she/they': { subject: 'she/they', object: 'her/them', possessive: 'her/their' },
            'he/they': { subject: 'he/they', object: 'him/them', possessive: 'his/their' },
            'any': { subject: 'they', object: 'them', possessive: 'their' }
        };
        
        this.pronouns = pronounMap[pronouns] || { 
            subject: pronouns.split('/')[0] || 'they', 
            object: pronouns.split('/')[1] || 'them',
            possessive: pronouns.split('/')[0] || 'their'
        };
        
        document.getElementById('welcome-message').textContent = `Welcome, ${name}!`;
        document.getElementById('welcome-description').textContent = 
            `A calming virtual space designed specifically for ADHD and Autism support. We're glad ${this.pronouns.subject} are here!`;
    }
    
    getPronouns() {
        return this.pronouns || { subject: 'they', object: 'them', possessive: 'their' };
    }
    
    getName() {
        return this.profile?.name || 'friend';
    }
}

// Affirmation System
class AffirmationSystem {
    constructor() {
        this.affirmations = [
            "You are doing your best, and that's enough.",
            "Your neurodivergent mind is a gift, not a burden.",
            "It's okay to need breaks and take things at your own pace.",
            "You are worthy of understanding and support.",
            "Your feelings are valid, and you matter.",
            "It's okay to struggle sometimes. You're still making progress.",
            "You have unique strengths that make you special.",
            "Taking care of yourself is not selfish—it's necessary.",
            "You are more than your challenges. You are whole and complete.",
            "Your way of thinking brings valuable perspectives to the world.",
            "It's okay to ask for help when you need it.",
            "You deserve kindness, especially from yourself.",
            "Your sensitivity is a superpower, not a weakness.",
            "Every small step forward counts, no matter how small.",
            "You are capable of amazing things, just as you are.",
            "Rest is productive. Taking breaks helps you recharge.",
            "Your differences make you beautifully unique.",
            "You are learning and growing every single day.",
            "It's okay to feel overwhelmed. You can handle this.",
            "You are strong, resilient, and doing better than you think."
        ];
        this.lastShownIndex = -1;
        this.init();
    }
    
    init() {
        // Show affirmation on page load if enabled
        const enabled = localStorage.getItem('affirmations-enabled') !== 'false';
        if (enabled) {
            setTimeout(() => this.showAffirmation(), 1000);
        }
    }
    
    showAffirmation() {
        const enabled = localStorage.getItem('affirmations-enabled') !== 'false';
        if (!enabled) {
            document.getElementById('affirmation-banner').classList.remove('show');
            document.body.style.paddingTop = '0';
            return;
        }
        
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * this.affirmations.length);
        } while (randomIndex === this.lastShownIndex && this.affirmations.length > 1);
        
        this.lastShownIndex = randomIndex;
        const affirmation = this.affirmations[randomIndex];
        
        document.getElementById('affirmation-text').textContent = affirmation;
        const banner = document.getElementById('affirmation-banner');
        banner.classList.add('show');
        
        // Add padding to body to account for banner
        document.body.style.paddingTop = '50px';
    }
}

// Chatbot
class Chatbot {
    constructor() {
        this.responses = {
            greeting: [
                "Hello! How are you feeling today?",
                "Hi there! What's on your mind?",
                "Hey! I'm here to listen. How can I help?"
            ],
            feeling: {
                anxious: [
                    "I understand that anxiety can be really overwhelming. Have you tried taking some deep breaths?",
                    "Anxiety is tough. Remember, this feeling will pass. Would you like to try some grounding techniques?",
                    "It's okay to feel anxious. You're safe here. What usually helps you feel calmer?"
                ],
                sad: [
                    "I'm sorry you're feeling sad. Your feelings are completely valid.",
                    "It's okay to feel sad sometimes. Would you like to talk about what's bothering you?",
                    "Sadness is a normal emotion. Remember, you don't have to go through this alone."
                ],
                overwhelmed: [
                    "Feeling overwhelmed is really common, especially with ADHD and Autism. Let's break things down.",
                    "When you're overwhelmed, it helps to focus on just one thing at a time. What's the most important thing right now?",
                    "Overwhelm can be intense. Have you tried the breathing exercises or calming music here?"
                ],
                happy: [
                    "That's wonderful! I'm so glad you're feeling good today!",
                    "It's great to hear you're doing well! What's making you happy?",
                    "I love hearing that! Enjoy this moment."
                ]
            },
            help: [
                "I'm here to support you. You can try the memory game to focus, the music player to relax, or organize your tasks in the to-do list.",
                "Remember, you have tools here to help: calming music, color therapy, and task organization. What would help you most right now?",
                "Let's find what works for you. Would you like to try some breathing exercises or listen to calming frequencies?"
            ],
            default: [
                "I'm listening. Can you tell me more about how you're feeling?",
                "That sounds important. How does that make you feel?",
                "I understand. What do you think might help you right now?",
                "Thank you for sharing that with me. You're doing great by reaching out."
            ]
        };
        this.init();
    }
    
    init() {
        const chatToggle = document.getElementById('chat-toggle');
        const closeChat = document.getElementById('close-chat');
        const sendBtn = document.getElementById('send-chat');
        const chatInput = document.getElementById('chat-input');
        const voiceToggle = document.getElementById('voice-toggle');
        
        chatToggle.addEventListener('click', () => {
            const container = document.getElementById('chatbot-container');
            container.classList.toggle('open');
            if (container.classList.contains('open')) {
                this.addMessage("Hello! I'm here to support you. How are you feeling today?", 'bot');
            }
        });
        
        closeChat.addEventListener('click', () => {
            document.getElementById('chatbot-container').classList.remove('open');
        });
        
        sendBtn.addEventListener('click', () => this.sendMessage());
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        
        voiceToggle.addEventListener('click', () => this.toggleVoiceInput());
    }
    
    sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        if (!message) return;
        
        this.addMessage(message, 'user');
        input.value = '';
        
        setTimeout(() => {
            const response = this.generateResponse(message);
            this.addMessage(response, 'bot');
            this.speak(response);
        }, 500);
    }
    
    addMessage(text, sender) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;
        messageDiv.textContent = text;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    generateResponse(message) {
        const lowerMessage = message.toLowerCase();
        const name = window.userProfileInstance?.getName() || 'friend';
        const pronouns = window.userProfileInstance?.getPronouns() || { subject: 'they', object: 'them' };
        
        // Greeting detection
        if (lowerMessage.match(/hi|hello|hey|greetings/)) {
            return this.getRandomResponse(this.responses.greeting);
        }
        
        // Feeling detection
        if (lowerMessage.match(/anxious|anxiety|worried|nervous|panic/)) {
            return this.getRandomResponse(this.responses.feeling.anxious);
        }
        if (lowerMessage.match(/sad|depressed|down|upset|unhappy/)) {
            return this.getRandomResponse(this.responses.feeling.sad);
        }
        if (lowerMessage.match(/overwhelmed|too much|stressed|can't handle/)) {
            return this.getRandomResponse(this.responses.feeling.overwhelmed);
        }
        if (lowerMessage.match(/good|great|happy|excited|wonderful|amazing/)) {
            return this.getRandomResponse(this.responses.feeling.happy);
        }
        
        // Help detection
        if (lowerMessage.match(/help|what can|what should|don't know|confused/)) {
            return this.getRandomResponse(this.responses.help);
        }
        
        // Default response
        return this.getRandomResponse(this.responses.default);
    }
    
    getRandomResponse(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    
    toggleVoiceInput() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            this.addMessage("Sorry, voice input isn't supported in your browser.", 'bot');
            return;
        }
        
        const voiceEnabled = localStorage.getItem('voice-assistance-enabled') === 'true';
        if (!voiceEnabled) {
            this.addMessage("Please enable voice assistance in settings first.", 'bot');
            return;
        }
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        
        const voiceToggle = document.getElementById('voice-toggle');
        voiceToggle.classList.add('listening');
        voiceToggle.textContent = '🎙️';
        
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            document.getElementById('chat-input').value = transcript;
            this.sendMessage();
        };
        
        recognition.onerror = () => {
            voiceToggle.classList.remove('listening');
            voiceToggle.textContent = '🎤';
        };
        
        recognition.onend = () => {
            voiceToggle.classList.remove('listening');
            voiceToggle.textContent = '🎤';
        };
        
        recognition.start();
    }
    
    speak(text) {
        const voiceEnabled = localStorage.getItem('voice-assistance-enabled') === 'true';
        if (!voiceEnabled || !('speechSynthesis' in window)) return;
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.volume = 0.8;
        window.speechSynthesis.speak(utterance);
    }
}

// Voice Assistance
class VoiceAssistance {
    constructor() {
        this.enabled = localStorage.getItem('voice-assistance-enabled') === 'true';
        this.init();
    }
    
    init() {
        const checkbox = document.getElementById('voice-assistance-enabled');
        checkbox.checked = this.enabled;
        
        checkbox.addEventListener('change', (e) => {
            this.enabled = e.target.checked;
            localStorage.setItem('voice-assistance-enabled', e.target.checked.toString());
        });
    }
    
    speak(text) {
        if (!this.enabled || !('speechSynthesis' in window)) return;
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.volume = 0.8;
        window.speechSynthesis.speak(utterance);
    }
}

// Settings Modal
function initSettings() {
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeModal = document.querySelector('.close-modal');
    const affirmationsCheckbox = document.getElementById('affirmations-enabled');
    
    settingsBtn.addEventListener('click', () => {
        settingsModal.style.display = 'flex';
        // Initialize water reminder when settings modal opens
        if (window.waterReminderInstance && !window.waterReminderInstance.initialized) {
            window.waterReminderInstance.intervalInput = document.getElementById('water-interval');
            window.waterReminderInstance.startBtn = document.getElementById('start-water-reminder');
            window.waterReminderInstance.stopBtn = document.getElementById('stop-water-reminder');
            window.waterReminderInstance.statusText = document.getElementById('water-status-text');
            window.waterReminderInstance.nextReminderText = document.getElementById('water-next-reminder');
            if (window.waterReminderInstance.intervalInput && window.waterReminderInstance.startBtn) {
                window.waterReminderInstance.init();
                window.waterReminderInstance.initialized = true;
            }
        } else if (window.waterReminderInstance && window.waterReminderInstance.initialized) {
            // Update status display when opening settings
            window.waterReminderInstance.updateStatusDisplay();
        }
    });
    
    closeModal.addEventListener('click', () => {
        settingsModal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.style.display = 'none';
        }
    });
    
    affirmationsCheckbox.addEventListener('change', (e) => {
        localStorage.setItem('affirmations-enabled', e.target.checked.toString());
    });
    
    // Load saved settings
    const affirmationsEnabled = localStorage.getItem('affirmations-enabled') !== 'false';
    affirmationsCheckbox.checked = affirmationsEnabled;
}

// Navigation
const navButtons = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.section');

navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetSection = btn.getAttribute('data-section');
        
        // Update active nav button
        navButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update active section
        sections.forEach(s => s.classList.remove('active'));
        document.getElementById(targetSection).classList.add('active');
    });
});

// Make feature cards clickable for navigation
function initFeatureCards() {
    const featureCards = document.querySelectorAll('.feature-card[data-section]');
    featureCards.forEach(card => {
        card.addEventListener('click', () => {
            const targetSection = card.getAttribute('data-section');
            // Update nav buttons
            navButtons.forEach(b => {
                if (b.getAttribute('data-section') === targetSection) {
                    b.classList.add('active');
                } else {
                    b.classList.remove('active');
                }
            });
            // Update sections
            sections.forEach(s => {
                if (s.id === targetSection) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
    });
}

// Memory Game with Color Theory
class MemoryGame {
    constructor() {
        // Color theory data - colors specifically chosen for ADHD/Autism support
        this.colorTheory = [
            {
                color: '#6B9BD1',
                name: 'Calm Blue',
                benefits: 'Reduces anxiety, promotes focus and concentration',
                description: 'Soft blue tones help calm the nervous system and improve attention span. Great for reducing overstimulation.',
                category: 'Calming & Focus'
            },
            {
                color: '#A8D5BA',
                name: 'Harmony Green',
                benefits: 'Promotes balance, reduces eye strain, creates harmony',
                description: 'Green is the most restful color for the eyes. It helps create a sense of balance and reduces visual fatigue.',
                category: 'Balance & Rest'
            },
            {
                color: '#B8A9D4',
                name: 'Serene Lavender',
                benefits: 'Calms the mind, reduces stress and tension',
                description: 'Lavender has been shown to reduce stress and promote relaxation. It helps quiet racing thoughts.',
                category: 'Relaxation'
            },
            {
                color: '#F4D1AE',
                name: 'Warm Peach',
                benefits: 'Uplifting, comforting, reduces aggression',
                description: 'Soft peach tones provide warmth and comfort without being overstimulating. Helps create a safe, welcoming feeling.',
                category: 'Comfort & Warmth'
            },
            {
                color: '#9BC4CB',
                name: 'Tranquil Teal',
                benefits: 'Clarity, emotional stability, mental clarity',
                description: 'Teal combines the calming properties of blue with the balance of green. Excellent for emotional regulation.',
                category: 'Clarity & Stability'
            },
            {
                color: '#E8C5A0',
                name: 'Gentle Sand',
                benefits: 'Grounding, stability, reduces overwhelm',
                description: 'Earthy tones help ground and center. They provide a sense of stability and reduce feelings of being overwhelmed.',
                category: 'Grounding'
            },
            {
                color: '#C7B8E8',
                name: 'Peaceful Periwinkle',
                benefits: 'Mental clarity, peace, reduces mental clutter',
                description: 'Periwinkle helps clear mental clutter and promotes peaceful thinking. Great for moments of overwhelm.',
                category: 'Mental Clarity'
            },
            {
                color: '#B5E5CF',
                name: 'Fresh Mint',
                benefits: 'Refreshing, energizing without overstimulation',
                description: 'Mint green provides gentle energy without the intensity of bright colors. Helps maintain alertness calmly.',
                category: 'Gentle Energy'
            },
            {
                color: '#D4A5C7',
                name: 'Soft Rose',
                benefits: 'Compassion, self-care, emotional comfort',
                description: 'Soft pink tones promote feelings of compassion and self-care. They help reduce feelings of frustration.',
                category: 'Compassion'
            },
            {
                color: '#A8C8E8',
                name: 'Sky Blue',
                benefits: 'Openness, freedom, reduces feelings of restriction',
                description: 'Light sky blue creates a sense of openness and freedom. Helps reduce feelings of being trapped or restricted.',
                category: 'Openness'
            }
        ];
        
        this.colors = this.colorTheory.map(c => c.color);
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.level = 1;
        this.score = 0;
        this.gameStarted = false;
        this.gameBoard = document.getElementById('game-board');
        this.levelDisplay = document.getElementById('level');
        this.scoreDisplay = document.getElementById('score');
        this.messageDisplay = document.getElementById('game-message');
        this.colorInfoPanel = document.getElementById('color-info-panel');
        
        this.init();
    }
    
    init() {
        document.getElementById('start-game').addEventListener('click', () => this.startGame());
        document.getElementById('reset-game').addEventListener('click', () => this.resetGame());
    }
    
    startGame() {
        this.gameStarted = true;
        this.matchedPairs = 0;
        this.flippedCards = [];
        this.messageDisplay.textContent = '';
        this.createCards();
        this.shuffleCards();
        this.renderCards();
    }
    
    createCards() {
        const numPairs = 4 + (this.level - 1) * 2;
        const selectedColorData = this.colorTheory.slice(0, Math.min(numPairs, this.colorTheory.length));
        this.cards = [];
        
        selectedColorData.forEach((colorData, index) => {
            this.cards.push({ 
                id: index * 2, 
                color: colorData.color,
                colorData: colorData,
                flipped: false, 
                matched: false 
            });
            this.cards.push({ 
                id: index * 2 + 1, 
                color: colorData.color,
                colorData: colorData,
                flipped: false, 
                matched: false 
            });
        });
    }
    
    shuffleCards() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }
    
    renderCards() {
        this.gameBoard.innerHTML = '';
        this.cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = 'game-card';
            cardElement.dataset.id = card.id;
            cardElement.style.backgroundColor = card.flipped || card.matched ? card.color : '#E1E8ED';
            
            if (card.flipped || card.matched) {
                const colorName = document.createElement('div');
                colorName.className = 'card-color-name';
                colorName.textContent = card.colorData.name;
                cardElement.appendChild(colorName);
            }
            
            if (!card.matched) {
                cardElement.addEventListener('click', () => this.flipCard(card.id));
            }
            
            this.gameBoard.appendChild(cardElement);
        });
    }
    
    flipCard(cardId) {
        if (!this.gameStarted) return;
        
        const card = this.cards.find(c => c.id === cardId);
        if (card.flipped || card.matched || this.flippedCards.length >= 2) return;
        
        card.flipped = true;
        this.flippedCards.push(card);
        this.renderCards();
        
        if (this.flippedCards.length === 2) {
            setTimeout(() => this.checkMatch(), 1000);
        }
    }
    
    checkMatch() {
        const [card1, card2] = this.flippedCards;
        
        if (card1.color === card2.color) {
            card1.matched = true;
            card2.matched = true;
            this.matchedPairs++;
            this.score += 10 * this.level;
            this.scoreDisplay.textContent = this.score;
            
            // Show color theory information
            this.showColorInfo(card1.colorData);
            
            if (this.matchedPairs === this.cards.length / 2) {
                this.level++;
                this.levelDisplay.textContent = this.level;
                this.messageDisplay.textContent = `Level ${this.level - 1} Complete! Starting Level ${this.level}...`;
                setTimeout(() => {
                    this.colorInfoPanel.innerHTML = '';
                    this.startGame();
                }, 3000);
            } else {
                this.messageDisplay.textContent = 'Match found!';
            }
        } else {
            card1.flipped = false;
            card2.flipped = false;
            this.messageDisplay.textContent = 'Try again!';
        }
        
        this.flippedCards = [];
        this.renderCards();
    }
    
    showColorInfo(colorData) {
        this.colorInfoPanel.innerHTML = `
            <div class="color-info-card" style="border-left: 5px solid ${colorData.color}">
                <div class="color-info-header">
                    <div class="color-swatch" style="background-color: ${colorData.color}"></div>
                    <div>
                        <h3>${colorData.name}</h3>
                        <span class="color-category">${colorData.category}</span>
                    </div>
                </div>
                <p class="color-benefits"><strong>Benefits:</strong> ${colorData.benefits}</p>
                <p class="color-description">${colorData.description}</p>
            </div>
        `;
        this.colorInfoPanel.style.display = 'block';
    }
    
    resetGame() {
        this.gameStarted = false;
        this.level = 1;
        this.score = 0;
        this.levelDisplay.textContent = this.level;
        this.scoreDisplay.textContent = this.score;
        this.messageDisplay.textContent = '';
        this.gameBoard.innerHTML = '';
        this.colorInfoPanel.innerHTML = '';
        this.colorInfoPanel.style.display = 'none';
    }
}

// To-Do List
class TodoList {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('atypical-todos')) || [];
        this.filter = 'all';
        this.todoInput = document.getElementById('todo-input');
        this.todoList = document.getElementById('todo-list');
        this.addBtn = document.getElementById('add-todo');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.todoCount = document.getElementById('todo-count');
        
        this.init();
    }
    
    init() {
        this.addBtn.addEventListener('click', () => this.addTodo());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });
        
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.filter = btn.getAttribute('data-filter');
                this.render();
            });
        });
        
        this.render();
    }
    
    addTodo() {
        const text = this.todoInput.value.trim();
        if (!text) return;
        
        const todo = {
            id: Date.now(),
            text,
            completed: false,
            priority: false,
            createdAt: new Date().toISOString()
        };
        
        this.todos.push(todo);
        this.todoInput.value = '';
        this.save();
        this.render();
    }
    
    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.save();
            this.render();
        }
    }
    
    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.save();
        this.render();
    }
    
    togglePriority(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.priority = !todo.priority;
            this.save();
            this.render();
        }
    }
    
    getFilteredTodos() {
        switch (this.filter) {
            case 'active':
                return this.todos.filter(t => !t.completed);
            case 'completed':
                return this.todos.filter(t => t.completed);
            default:
                return this.todos;
        }
    }
    
    render() {
        const filteredTodos = this.getFilteredTodos();
        this.todoList.innerHTML = '';
        
        if (filteredTodos.length === 0) {
            this.todoList.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 40px;">No tasks found. Add one to get started!</p>';
        } else {
            filteredTodos.forEach(todo => {
                const todoItem = document.createElement('div');
                todoItem.className = `todo-item ${todo.completed ? 'completed' : ''} ${todo.priority ? 'priority' : ''}`;
                
                todoItem.innerHTML = `
                    <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
                    <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                    <div class="todo-actions">
                        <button class="todo-btn priority-btn">${todo.priority ? '★' : '☆'}</button>
                        <button class="todo-btn delete-btn">Delete</button>
                    </div>
                `;
                
                todoItem.querySelector('.todo-checkbox').addEventListener('change', () => this.toggleTodo(todo.id));
                todoItem.querySelector('.priority-btn').addEventListener('click', () => this.togglePriority(todo.id));
                todoItem.querySelector('.delete-btn').addEventListener('click', () => this.deleteTodo(todo.id));
                
                this.todoList.appendChild(todoItem);
            });
        }
        
        const activeCount = this.todos.filter(t => !t.completed).length;
        this.todoCount.textContent = `${activeCount} task${activeCount !== 1 ? 's' : ''} remaining`;
    }
    
    save() {
        localStorage.setItem('atypical-todos', JSON.stringify(this.todos));
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Music Player
class MusicPlayer {
    constructor() {
        this.audioContext = null;
        this.oscillator = null;
        this.gainNode = null;
        this.audioElement = null;
        this.isPlaying = false;
        this.currentFrequency = null;
        this.currentSound = null;
        this.volume = 50;
        this.soundType = 'frequency'; // 'frequency' or 'ambient'
        
        this.playBtn = document.getElementById('play-pause');
        this.stopBtn = document.getElementById('stop-music');
        this.volumeSlider = document.getElementById('volume');
        this.volumeValue = document.getElementById('volume-value');
        this.currentFreqDisplay = document.getElementById('current-freq');
        this.presetButtons = document.querySelectorAll('.preset-btn');
        this.ambientButtons = document.querySelectorAll('.ambient-btn');
        
        // Ambient sound URLs - IMPORTANT: Replace these with actual audio file URLs
        // For best results, download free nature sounds from:
        // - freesound.org (requires account, free)
        // - zapsplat.com (requires account, free)
        // - pixabay.com/music (free, no account needed)
        // Then host them in a 'sounds' folder or use a CDN
        // 
        // Example: If you have sounds in a 'sounds' folder:
        // rain: 'sounds/rain.mp3',
        // waterfall: 'sounds/waterfall.mp3',
        this.ambientSounds = {
            // Replace these URLs with your actual sound files
            rain: 'sounds/rain.mp3', // Download from freesound.org - search "rain"
            waterfall: 'sounds/waterfall.mp3', // Download from freesound.org - search "waterfall"
            countryside: 'sounds/countryside.mp3', // Download from freesound.org - search "birds countryside"
            city: 'sounds/city.mp3', // Download from freesound.org - search "city traffic"
            ocean: 'sounds/ocean.mp3', // Download from freesound.org - search "ocean waves"
            forest: 'sounds/forest.mp3' // Download from freesound.org - search "forest ambience"
        };
        
        // Fallback: If URLs don't work, use generated sounds
        this.ambientSoundsFallback = {};
        
        this.persistentPlayer = document.getElementById('persistent-music-player');
        this.persistentTrackName = document.getElementById('persistent-track-name');
        this.persistentPlayPause = document.getElementById('persistent-play-pause');
        this.persistentStop = document.getElementById('persistent-stop');
        
        this.init();
    }
    
    init() {
        // Initialize Web Audio API
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.error('Web Audio API not supported');
        }
        
        this.playBtn.addEventListener('click', () => this.togglePlay());
        this.stopBtn.addEventListener('click', () => this.stop());
        
        this.volumeSlider.addEventListener('input', (e) => {
            this.volume = parseInt(e.target.value);
            this.volumeValue.textContent = `${this.volume}%`;
            if (this.gainNode) {
                this.gainNode.gain.value = this.volume / 100;
            }
            if (this.audioElement) {
                this.audioElement.volume = this.volume / 100;
            }
        });
        
        this.presetButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const freq = parseInt(btn.getAttribute('data-freq'));
                this.playFrequency(freq);
                
                this.presetButtons.forEach(b => b.classList.remove('active'));
                this.ambientButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
        
        this.ambientButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const sound = btn.getAttribute('data-sound');
                this.playAmbientSound(sound);
                
                this.presetButtons.forEach(b => b.classList.remove('active'));
                this.ambientButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
        
        // Persistent player controls
        this.persistentPlayPause.addEventListener('click', () => this.togglePlay());
        this.persistentStop.addEventListener('click', () => this.stop());
    }
    
    playFrequency(frequency) {
        this.stop();
        this.soundType = 'frequency';
        
        if (!this.audioContext) {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                console.error('Web Audio API not supported');
                return;
            }
        }
        
        this.oscillator = this.audioContext.createOscillator();
        this.gainNode = this.audioContext.createGain();
        
        const masterGain = this.audioContext.createGain();
        
        this.oscillator.type = 'sine';
        this.oscillator.frequency.value = frequency;
        
        this.gainNode.gain.value = this.volume / 100;
        
        const lfo = this.audioContext.createOscillator();
        const lfoGain = this.audioContext.createGain();
        lfo.frequency.value = 0.1;
        lfoGain.gain.value = 0.5;
        
        lfo.connect(lfoGain);
        lfoGain.connect(this.oscillator.frequency);
        
        this.oscillator.connect(this.gainNode);
        this.gainNode.connect(masterGain);
        masterGain.connect(this.audioContext.destination);
        
        masterGain.gain.setValueAtTime(0, this.audioContext.currentTime);
        masterGain.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 1);
        
        this.oscillator.start();
        lfo.start();
        
        this.isPlaying = true;
        this.currentFrequency = frequency;
        const displayText = `${frequency} Hz`;
        this.currentFreqDisplay.textContent = displayText;
        this.persistentTrackName.textContent = displayText;
        this.playBtn.textContent = '⏸ Pause';
        this.persistentPlayPause.textContent = '⏸';
        this.updatePersistentPlayer();
    }
    
    updatePersistentPlayer() {
        // Show player if there's a track selected (playing or paused), hide only when stopped
        if (this.currentFrequency || this.currentSound) {
            this.persistentPlayer.classList.add('visible');
        } else {
            this.persistentPlayer.classList.remove('visible');
        }
    }
    
    playAmbientSound(soundName) {
        this.stop();
        this.soundType = 'ambient';
        
        // Create audio element for ambient sounds
        this.audioElement = new Audio();
        // Try primary source first, then fallback
        this.audioElement.src = this.ambientSounds[soundName] || this.ambientSoundsFallback[soundName];
        this.audioElement.loop = true;
        this.audioElement.volume = this.volume / 100;
        
        this.audioElement.play().catch(e => {
            console.error('Error playing ambient sound:', e);
            // Try fallback URL
            if (this.ambientSoundsFallback[soundName]) {
                this.audioElement.src = this.ambientSoundsFallback[soundName];
                this.audioElement.play().catch(e2 => {
                    console.error('Fallback also failed:', e2);
                    // Final fallback: Use Web Audio API to generate similar sounds
                    this.generateAmbientSound(soundName);
                });
            } else {
                this.generateAmbientSound(soundName);
            }
        });
        
        this.isPlaying = true;
        this.currentSound = soundName;
        const soundNames = {
            rain: '🌧️ Rain',
            waterfall: '💧 Waterfall',
            countryside: '🌾 Countryside',
            city: '🏙️ City',
            ocean: '🌊 Ocean Waves',
            forest: '🌲 Forest'
        };
        const displayName = soundNames[soundName] || soundName;
        this.currentFreqDisplay.textContent = displayName;
        this.persistentTrackName.textContent = displayName;
        this.playBtn.textContent = '⏸ Pause';
        this.persistentPlayPause.textContent = '⏸';
        this.updatePersistentPlayer();
    }
    
    generateAmbientSound(soundName) {
        // Fallback sound generation if audio files don't load
        if (!this.audioContext) {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                return;
            }
        }
        
        // Simple noise generation for ambient sounds
        const bufferSize = 4096;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;
        
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 1000;
        
        this.gainNode = this.audioContext.createGain();
        this.gainNode.gain.value = this.volume / 100 * 0.1;
        
        noise.connect(filter);
        filter.connect(this.gainNode);
        this.gainNode.connect(this.audioContext.destination);
        
        noise.start();
        this.oscillator = noise;
    }
    
    togglePlay() {
        if (!this.isPlaying) {
            if (this.soundType === 'frequency' && this.currentFrequency) {
                this.playFrequency(this.currentFrequency);
            } else if (this.soundType === 'ambient' && this.currentSound) {
                this.playAmbientSound(this.currentSound);
            } else {
                // Default to 432 Hz
                this.playFrequency(432);
                this.presetButtons[0].classList.add('active');
            }
        } else {
            this.pause();
        }
    }
    
    pause() {
        if (this.oscillator) {
            this.oscillator.stop();
            this.oscillator = null;
            this.gainNode = null;
        }
        if (this.audioElement) {
            this.audioElement.pause();
        }
        this.isPlaying = false;
        this.playBtn.textContent = '▶ Play';
        this.persistentPlayPause.textContent = '▶';
        // Keep player visible when paused (only hide when stopped)
        // Don't call updatePersistentPlayer() here - it will hide the player
    }
    
    stop() {
        this.pause();
        this.currentFrequency = null;
        this.currentSound = null;
        this.currentFreqDisplay.textContent = 'None';
        this.persistentTrackName.textContent = 'No track playing';
        this.presetButtons.forEach(btn => btn.classList.remove('active'));
        this.ambientButtons.forEach(btn => btn.classList.remove('active'));
        this.updatePersistentPlayer();
    }
}

// Water Intake Reminder
class WaterReminder {
    constructor() {
        this.intervalId = null;
        this.intervalMinutes = 60;
        this.nextReminderTime = null;
        this.initialized = false;
        
        // Water reminder controls are now in settings modal
        this.intervalInput = document.getElementById('water-interval');
        this.startBtn = document.getElementById('start-water-reminder');
        this.stopBtn = document.getElementById('stop-water-reminder');
        this.statusText = document.getElementById('water-status-text');
        this.nextReminderText = document.getElementById('water-next-reminder');
        
        // Initialize popup immediately (doesn't need DOM elements)
        this.initPopup();
        
        // Check if reminder was active and start it
        const isActive = localStorage.getItem('water-reminder-active') === 'true';
        if (isActive) {
            const savedInterval = localStorage.getItem('water-reminder-interval');
            if (savedInterval) {
                this.intervalMinutes = parseInt(savedInterval);
            }
            this.startReminder();
        }
        
        // Try to initialize controls if they exist
        if (this.intervalInput && this.startBtn) {
            this.init();
            this.initialized = true;
        }
    }
    
    init() {
        // Load saved interval
        const savedInterval = localStorage.getItem('water-reminder-interval');
        if (savedInterval) {
            this.intervalMinutes = parseInt(savedInterval);
            this.intervalInput.value = this.intervalMinutes;
        }
        
        // Check if reminder was active
        const isActive = localStorage.getItem('water-reminder-active') === 'true';
        if (isActive) {
            this.startReminder();
        }
        
        this.startBtn.addEventListener('click', () => this.startReminder());
        this.stopBtn.addEventListener('click', () => this.stopReminder());
        this.intervalInput.addEventListener('change', (e) => {
            this.intervalMinutes = parseInt(e.target.value);
            localStorage.setItem('water-reminder-interval', this.intervalMinutes);
            if (this.intervalId) {
                this.stopReminder();
                this.startReminder();
            }
        });
        
        this.updateStatusDisplay();
    }
    
    startReminder() {
        if (this.intervalId) {
            this.stopReminder();
        }
        
        const intervalMs = this.intervalMinutes * 60 * 1000;
        this.intervalId = setInterval(() => {
            this.showReminder();
        }, intervalMs);
        
        this.updateNextReminder();
        localStorage.setItem('water-reminder-active', 'true');
        this.updateStatusDisplay();
        
        // Show first reminder after interval
        setTimeout(() => this.showReminder(), intervalMs);
    }
    
    stopReminder() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        localStorage.setItem('water-reminder-active', 'false');
        this.updateStatusDisplay();
    }
    
    updateNextReminder() {
        if (!this.intervalId) return;
        
        const now = new Date();
        const nextTime = new Date(now.getTime() + (this.intervalMinutes * 60 * 1000));
        this.nextReminderTime = nextTime;
        
        const hours = nextTime.getHours().toString().padStart(2, '0');
        const minutes = nextTime.getMinutes().toString().padStart(2, '0');
        this.nextReminderText.textContent = `Next reminder at ${hours}:${minutes}`;
    }
    
    showReminder() {
        // Create notification
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('💧 Time to Drink Water!', {
                body: `It's been ${this.intervalMinutes} minutes. Stay hydrated!`,
                icon: '💧'
            });
        }
        
        // Show popup modal
        const popup = document.getElementById('water-reminder-popup');
        const intervalSpan = document.getElementById('water-popup-interval');
        intervalSpan.textContent = this.intervalMinutes;
        popup.style.display = 'flex';
        
        // Update next reminder time
        this.updateNextReminder();
        
        // Request notification permission if not granted
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }
    
    initPopup() {
        const popup = document.getElementById('water-reminder-popup');
        const okBtn = document.getElementById('water-popup-ok');
        const snoozeBtn = document.getElementById('water-popup-snooze');
        
        okBtn.addEventListener('click', () => {
            popup.style.display = 'none';
        });
        
        snoozeBtn.addEventListener('click', () => {
            popup.style.display = 'none';
            // Snooze for 5 minutes
            setTimeout(() => {
                this.showReminder();
            }, 5 * 60 * 1000);
        });
        
        // Close when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === popup) {
                popup.style.display = 'none';
            }
        });
    }
}

// Initialize everything when DOM is loaded
let userProfileInstance;
let affirmationSystem;
let chatbot;
let voiceAssistance;

document.addEventListener('DOMContentLoaded', () => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
    
    userProfileInstance = new UserProfile();
    window.userProfileInstance = userProfileInstance;
    affirmationSystem = new AffirmationSystem();
    window.affirmationSystem = affirmationSystem;
    chatbot = new Chatbot();
    voiceAssistance = new VoiceAssistance();
    initSettings();
    initFeatureCards(); // Initialize feature cards navigation
    
    new MemoryGame();
    new TodoList();
    new MusicPlayer();
    window.waterReminderInstance = new WaterReminder();
    
    // Show affirmation when navigating to home
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.getAttribute('data-section') === 'home') {
                setTimeout(() => affirmationSystem.showAffirmation(), 500);
            }
        });
    });
});

