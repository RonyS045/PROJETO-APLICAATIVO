// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => console.log('ServiceWorker registered'))
            .catch(err => console.log('ServiceWorker registration failed'));
    });
}

// App State
const appState = {
    currentUser: null,
    formData: {},
    isOffline: false
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    loadSavedData();
});

// App Initialization
function initializeApp() {
    // Hide loading screen after 2 seconds
    setTimeout(() => {
        document.getElementById('loading-screen').style.display = 'none';
        checkAuthStatus();
    }, 2000);

    // Setup offline detection
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
}

// Authentication Check
function checkAuthStatus() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        appState.currentUser = JSON.parse(savedUser);
        showMainApp();
    } else {
        showAuthSection();
    }
}

// Event Listeners Setup
function setupEventListeners() {
    // Form submission
    document.getElementById('pmoc-form')?.addEventListener('submit', handleFormSubmit);

    // Logo upload
    document.getElementById('logo-upload')?.addEventListener('change', handleLogoUpload);

    // PDF Generation
    document.getElementById('generate-pdf')?.addEventListener('click', generatePDF);

    // Data Export
    document.getElementById('export-data')?.addEventListener('click', exportData);
}

// Form Handling
function handleFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Validate data
    if (validateFormData(data)) {
        saveFormData(data);
        showSuccessMessage('Dados salvos com sucesso!');
    }
}

// Data Validation
function validateFormData(data) {
    // Implement validation logic here
    return true;
}

// Data Storage
function saveFormData(data) {
    appState.formData = { ...appState.formData, ...data };
    localStorage.setItem('formData', JSON.stringify(appState.formData));
    
    // If online, sync with server
    if (navigator.onLine) {
        syncWithServer(data);
    }
}

// Server Sync
async function syncWithServer(data) {
    try {
        const response = await fetch('/api/save-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) throw new Error('Sync failed');
        
    } catch (error) {
        console.error('Sync error:', error);
        queueForSync(data);
    }
}

// PDF Generation
function generatePDF() {
    const data = appState.formData;
    // Implement PDF generation logic here
    // You might want to use a library like jsPDF
}

// Data Export
function exportData() {
    const data = JSON.stringify(appState.formData, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pmoc-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Utility Functions
function showSuccessMessage(message) {
    // Implement toast or notification system
    alert(message);
}

function updateOnlineStatus() {
    appState.isOffline = !navigator.onLine;
    // Update UI to show online/offline status
}

function queueForSync(data) {
    const syncQueue = JSON.parse(localStorage.getItem('syncQueue') || '[]');
    syncQueue.push(data);
    localStorage.setItem('syncQueue', JSON.stringify(syncQueue));
}

// Initialize form fields and checklist
function initializeFormFields() {
    const checklistItems = [
        "Inspeção geral no equipamento",
        "Inspeção de vazamentos",
        "Verificação de anomalias visuais",
        // Add all checklist items here
    ];

    const checklistContainer = document.querySelector('.checklist');
    checklistItems.forEach(