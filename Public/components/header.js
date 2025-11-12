document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            this.setAttribute('aria-expanded', 
                this.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
            );
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (mobileMenuToggle && mainNav && 
            !mobileMenuToggle.contains(e.target) && 
            !mainNav.contains(e.target)) {
            mainNav.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Check auth state and update UI
    function updateAuthUI() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const body = document.body;
        
        if (isLoggedIn) {
            body.classList.add('logged-in');
            body.classList.remove('logged-out');
            
            // Update user name if available
            const userName = localStorage.getItem('userName') || 'Usuario';
            const userNameElements = document.querySelectorAll('.user-name');
            userNameElements.forEach(el => {
                el.textContent = userName;
            });
        } else {
            body.classList.add('logged-out');
            body.classList.remove('logged-in');
        }
    }
    
    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userName');
            window.location.href = 'index.html';
        });
    }
    
    // Initialize auth state
    updateAuthUI();
    
    // Make updateAuthUI globally available for other scripts
    window.updateAuthUI = updateAuthUI;
});
