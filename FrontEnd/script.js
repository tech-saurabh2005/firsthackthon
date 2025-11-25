  // Navbar hide/show functionality (guarded)
        let lastScrollTop = 0;
        const header = document.getElementById('main-header');
        const scrollThreshold = 50; // How much to scroll before hiding navbar

        // Only attach scroll listener if `#main-header` exists
        if (header) {
            window.addEventListener('scroll', function() {
                let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

                if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
                    // Scrolling down and past threshold - hide navbar
                    header.classList.add('hidden');
                } else {
                    // Scrolling up - show navbar
                    header.classList.remove('hidden');
                }

                lastScrollTop = scrollTop;
            });
        }

        // Authentication System
        class AuthSystem {
            constructor() {
                this.currentUser = null;
                this.users = this.loadUsers();
                this.init();
            }

            // Load users from localStorage
            loadUsers() {
                const stored = localStorage.getItem('autoflow-users');
                return stored ? JSON.parse(stored) : [];
            }

            // Save users to localStorage
            saveUsers() {
                localStorage.setItem('autoflow-users', JSON.stringify(this.users));
            }

            // Initialize authentication system
            init() {
                // Check if user is already logged in
                const savedUser = localStorage.getItem('autoflow-current-user');
                if (savedUser) {
                    this.currentUser = JSON.parse(savedUser);
                    this.updateUI();
                }
            }

            // Register a new user
            register(name, email, password) {
                // Check if user already exists
                if (this.users.find(user => user.email === email)) {
                    return { success: false, message: 'User with this email already exists' };
                }

                // Create new user
                const newUser = {
                    id: Date.now().toString(),
                    name,
                    email,
                    password, // In a real app, this should be hashed
                    createdAt: new Date().toISOString()
                };

                this.users.push(newUser);
                this.saveUsers();

                // Automatically log in the new user
                this.login(email, password);

                return { success: true, message: 'Account created successfully' };
            }

            // Login user
            login(email, password) {
                const user = this.users.find(u => u.email === email && u.password === password);
                
                if (user) {
                    this.currentUser = { ...user };
                    localStorage.setItem('autoflow-current-user', JSON.stringify(this.currentUser));
                    this.updateUI();
                    return { success: true, message: 'Login successful' };
                } else {
                    return { success: false, message: 'Invalid email or password' };
                }
            }

            // Logout user
            logout() {
                this.currentUser = null;
                localStorage.removeItem('autoflow-current-user');
                this.updateUI();
            }

            // Update UI based on authentication state
            updateUI() {
                const loginBtn = document.getElementById('login-btn');
                const userDropdown = document.getElementById('user-dropdown');
                const userAvatar = document.getElementById('user-avatar');

                if (this.currentUser) {
                    // User is logged in
                    loginBtn.style.display = 'none';
                    userDropdown.style.display = 'block';
                    
                    // Set user avatar with first letter of name
                    const initials = this.currentUser.name
                        .split(' ')
                        .map(n => n[0])
                        .join('')
                        .toUpperCase();
                    userAvatar.textContent = initials;
                } else {
                    // User is not logged in
                    loginBtn.style.display = 'block';
                    userDropdown.style.display = 'none';
                }
            }

            // Get current user
            getCurrentUser() {
                return this.currentUser;
            }

            // Check if user is logged in
            isLoggedIn() {
                return this.currentUser !== null;
            }
        }

        // Form Data Storage Engine
        class FormDataEngine {
            constructor() {
                this.formDataProfiles = this.loadFormData();
                this.formTemplates = this.getFormTemplates();
            }

            // Load form data from localStorage
            loadFormData() {
                const stored = localStorage.getItem('autoflow-form-data');
                return stored ? JSON.parse(stored) : [];
            }

            // Save form data to localStorage
            saveFormData() {
                localStorage.setItem('autoflow-form-data', JSON.stringify(this.formDataProfiles));
            }

            // Get predefined form templates
            getFormTemplates() {
                return {
                    personal: {
                        name: "Personal Information",
                        description: "Standard personal details",
                        fields: [
                            { name: "first_name", value: "", label: "First Name" },
                            { name: "last_name", value: "", label: "Last Name" },
                            { name: "email", value: "", label: "Email Address" },
                            { name: "phone", value: "", label: "Phone Number" },
                            { name: "address", value: "", label: "Street Address" },
                            { name: "city", value: "", label: "City" },
                            { name: "state", value: "", label: "State/Province" },
                            { name: "zip", value: "", label: "ZIP/Postal Code" },
                            { name: "country", value: "", label: "Country" }
                        ]
                    },
                    job: {
                        name: "Job Application",
                        description: "Information for job applications",
                        fields: [
                            { name: "first_name", value: "", label: "First Name" },
                            { name: "last_name", value: "", label: "Last Name" },
                            { name: "email", value: "", label: "Email Address" },
                            { name: "phone", value: "", label: "Phone Number" },
                            { name: "linkedin", value: "", label: "LinkedIn Profile" },
                            { name: "portfolio", value: "", label: "Portfolio Website" },
                            { name: "current_company", value: "", label: "Current Company" },
                            { name: "current_position", value: "", label: "Current Position" },
                            { name: "years_experience", value: "", label: "Years of Experience" }
                        ]
                    },
                    ecommerce: {
                        name: "E-commerce Checkout",
                        description: "Shipping and payment information",
                        fields: [
                            { name: "first_name", value: "",label: "First Name"  },
                            { name: "last_name", value: "",label: "Last Name" },
                            { name: "email", value: "", label: "Email Address" },
                            { name: "phone", value: "", label: "Phone Number" },
                            { name: "address", value: "", label: "Street Address" },
                            { name: "city", value: "", label: "City" },
                            { name: "state", value: "", label: "State/Province" },
                            { name: "zip", value: "", label: "ZIP/Postal Code" },
                            { name: "country", value: "", label: "Country" },
                            { name: "card_number", value: "", label: "Credit Card Number" },
                            { name: "card_expiry", value: "", label: "Expiry Date" },
                            { name: "card_cvv", value: "", label: "CVV" }
                        ]
                    }
                };
            }

            // Add a new form data profile
            addFormData(name, description, fields) {
                const profile = {
                    id: Date.now().toString(),
                    name,
                    description,
                    fields,
                    created: new Date().toISOString(),
                    updated: new Date().toISOString()
                };
                this.formDataProfiles.push(profile);
                this.saveFormData();
                return profile;
            }

            // Get a form data profile by ID
            getFormData(id) {
                return this.formDataProfiles.find(profile => profile.id === id);
            }

            // Update a form data profile
            updateFormData(id, name, description, fields) {
                const index = this.formDataProfiles.findIndex(profile => profile.id === id);
                if (index !== -1) {
                    this.formDataProfiles[index] = {
                        ...this.formDataProfiles[index],
                        name,
                        description,
                        fields,
                        updated: new Date().toISOString()
                    };
                    this.saveFormData();
                    return this.formDataProfiles[index];
                }
                return null;
            }

            // Delete a form data profile
            deleteFormData(id) {
                this.formDataProfiles = this.formDataProfiles.filter(profile => profile.id !== id);
                this.saveFormData();
            }

            // Use a template to create a new form data profile
            useTemplate(templateName) {
                const template = this.formTemplates[templateName];
                if (template) {
                    // Create a deep copy of the template fields
                    const fields = JSON.parse(JSON.stringify(template.fields));
                    return this.addFormData(template.name, template.description, fields);
                }
                return null;
            }

            // Fill a form using a form data profile
            fillForm(profileId, formUrl = null) {
                const profile = this.getFormData(profileId);
                if (!profile) {
                    console.error('Form data profile not found');
                    return false;
                }

                // In a real implementation, this would interact with the actual form on the page
                // For this demo, we'll simulate the form filling and show a message
                
                if (formUrl) {
                    console.log(`Navigating to ${formUrl} and filling form with profile: ${profile.name}`);
                    // In a real implementation, we would navigate to the URL and then fill the form
                } else {
                    console.log(`Filling current page form with profile: ${profile.name}`);
                }

                // Simulate filling each field
                profile.fields.forEach(field => {
                    console.log(`Filling field ${field.name} (${field.label}) with value: ${field.value}`);
                    // In a real implementation, this would find the form field and set its value
                });

                return true;
            }
        }

        // Workflow Engine
        class WorkflowEngine {
            constructor() {
                        this.workflows = this.loadWorkflows();
                        this.formDataEngine = new FormDataEngine();
                        this.serverAvailable = false;
                        // Default backend (change if your backend runs on a different host/port)
                        const defaultBackend = 'http://localhost:3000';
                        // Allow override from HTML: set window._BACKEND_URL = 'http://host:port'
                        this.apiBase = (window._BACKEND_URL || defaultBackend) + '/api/workflows';
            }

                    // Try to sync workflows from backend; sets serverAvailable
                    async syncWithServer() {
                        try {
                            const res = await fetch(this.apiBase);
                            if (!res.ok) throw new Error('no server');
                            const data = await res.json();
                            // map server workflows to client format
                            this.workflows = (data || []).map(w => ({
                                id: w._id,
                                name: w.name,
                                description: w.description,
                                steps: w.steps || [],
                                created: w.created,
                                executions: w.executions || 0,
                                lastExecuted: w.lastExecuted || null,
                                active: w.active ?? true,
                                updated: w.updated
                            }));
                            this.saveWorkflows();
                            this.serverAvailable = true;
                        } catch (err) {
                            // server not available — keep localStorage copy
                            this.serverAvailable = false;
                        }
                    }

                    // Load workflows from localStorage (fallback)
                    loadWorkflows() {
                        const stored = localStorage.getItem('autoflow-workflows');
                        return stored ? JSON.parse(stored) : [];
                    }

            // Save workflows to localStorage (and optionally sync to server)
            saveWorkflows() {
                localStorage.setItem('autoflow-workflows', JSON.stringify(this.workflows));
            }

            // Add a workflow (syncs with backend when available)
            async addWorkflow(name, description, steps) {
                if (this.serverAvailable) {
                    try {
                        const res = await fetch(this.apiBase, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ name, description, steps })
                        });
                        if (res.ok) {
                            const w = await res.json();
                            const workflow = {
                                id: w._id,
                                name: w.name,
                                description: w.description,
                                steps: w.steps || [],
                                created: w.created,
                                executions: w.executions || 0,
                                lastExecuted: w.lastExecuted || null,
                                active: w.active ?? true
                            };
                            this.workflows.push(workflow);
                            this.saveWorkflows();
                            return workflow;
                        }
                    } catch (err) {
                        console.warn('Failed to add workflow to server, falling back to local');
                    }
                }

                // Fallback to local
                const workflow = {
                    id: Date.now().toString(),
                    name,
                    description,
                    steps,
                    created: new Date().toISOString(),
                    executions: 0,
                    lastExecuted: null,
                    active: true
                };
                this.workflows.push(workflow);
                this.saveWorkflows();
                return workflow;
            }

            // Get a workflow by ID
            getWorkflow(id) {
                return this.workflows.find(w => w.id === id);
            }

            // Update a workflow (sync with backend when possible)
            async updateWorkflow(id, name, description, steps) {
                const index = this.workflows.findIndex(w => w.id === id);
                if (index === -1) return null;

                if (this.serverAvailable && String(id).length === 24) {
                    // likely a server _id
                    try {
                        const res = await fetch(`${this.apiBase}/${id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ name, description, steps })
                        });
                        if (res.ok) {
                            const updated = await res.json();
                            this.workflows[index] = {
                                id: updated._id,
                                name: updated.name,
                                description: updated.description,
                                steps: updated.steps || [],
                                created: updated.created,
                                updated: updated.updated
                            };
                            this.saveWorkflows();
                            return this.workflows[index];
                        }
                    } catch (err) {
                        console.warn('Failed to update on server, falling back to local update');
                    }
                }

                this.workflows[index] = {
                    ...this.workflows[index],
                    name,
                    description,
                    steps,
                    updated: new Date().toISOString()
                };
                this.saveWorkflows();
                return this.workflows[index];
            }

            // Delete a workflow (sync with backend when available)
            async deleteWorkflow(id) {
                if (this.serverAvailable && String(id).length === 24) {
                    try {
                        const res = await fetch(`${this.apiBase}/${id}`, { method: 'DELETE' });
                        if (res.ok) {
                            this.workflows = this.workflows.filter(w => w.id !== id);
                            this.saveWorkflows();
                            return;
                        }
                    } catch (err) {
                        console.warn('Failed to delete on server, falling back to local delete');
                    }
                }

                const workflow = this.getWorkflow(id);
                this.workflows = this.workflows.filter(w => w.id !== id);
                this.saveWorkflows();
            }

            // Execute a workflow
            async executeWorkflow(steps) {
                for (let i = 0; i < steps.length; i++) {
                    const step = steps[i];
                    try {
                        // Update UI to show current step
                        this.highlightStep(i);
                        
                        // Simulate execution with a delay
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        
                        // Execute the step based on its type
                        await this.executeStep(step);
                    } catch (error) {
                        console.error(`Error executing step ${i}:`, error);
                        alert(`Error executing step ${i + 1}: ${step.name}. Check the console for details.`);
                        break;
                    }
                }
                
                // Reset UI after execution
                this.resetStepHighlights();
                alert('Workflow execution completed!');
            }

            // Execute a single step
            async executeStep(step) {
                switch (step.type) {
                    case 'fill-form':
                        // Use the form data engine to fill the form
                        if (step.data && step.data.profileId) {
                            const success = this.formDataEngine.fillForm(step.data.profileId, step.data.formUrl);
                            if (success) {
                                console.log('Form filled successfully');
                            } else {
                                console.error('Failed to fill form');
                            }
                        } else {
                            console.error('No form data profile selected for fill-form action');
                        }
                        break;
                    case 'click-button':
                        // In a real implementation, this would find and click buttons
                        console.log('Clicking button:', step.data);
                        break;
                    case 'send-notification':
                        // Show a browser notification if permitted
                        if ('Notification' in window && Notification.permission === 'granted') {
                            new Notification('AutoFlow Notification', {
                                body: step.data.message || 'Your automation has reached this step'
                            });
                        }
                        console.log('Sending notification:', step.data);
                        break;
                    case 'extract-data':
                        // In a real implementation, this would extract data from the page
                        console.log('Extracting data:', step.data);
                        break;
                    case 'schedule-task':
                        // In a real implementation, this would schedule a task
                        console.log('Scheduling task:', step.data);
                        break;
                    default:
                        console.warn('Unknown step type:', step.type);
                }
            }

            // Highlight the current step during execution
            highlightStep(index) {
                const steps = document.querySelectorAll('.workflow-step');
                if (steps[index]) {
                    steps[index].classList.add('executing');
                }
            }

            // Reset step highlights after execution
            resetStepHighlights() {
                const steps = document.querySelectorAll('.workflow-step');
                steps.forEach(step => {
                    step.classList.remove('executing');
                });
            }

            // Export workflow as JSON
            exportWorkflow(workflow) {
                return JSON.stringify(workflow, null, 2);
            }

            // Import workflow from JSON
            importWorkflow(json) {
                try {
                    const workflow = JSON.parse(json);
                    // Validate the workflow structure
                    if (workflow.name && workflow.steps && Array.isArray(workflow.steps)) {
                        workflow.id = Date.now().toString();
                        workflow.created = new Date().toISOString();
                        workflow.executions = 0;
                        workflow.lastExecuted = null;
                        workflow.active = true;
                        this.workflows.push(workflow);
                        this.saveWorkflows();
                        return workflow;
                    } else {
                        throw new Error('Invalid workflow format');
                    }
                } catch (error) {
                    console.error('Error importing workflow:', error);
                    alert('Error importing workflow. Please check the file format.');
                    return null;
                }
            }
        }

        // Initialize the application
        document.addEventListener('DOMContentLoaded', async function() {
            const authSystem = new AuthSystem();
            const workflowEngine = new WorkflowEngine();
            // try to sync with backend before rendering lists
            await workflowEngine.syncWithServer();
            let currentEditingFormDataId = null;

            // Authentication Modal Elements
            const authModal = document.getElementById('auth-modal');
            const loginBtn = document.getElementById('login-btn');
            const authTabs = document.querySelectorAll('.auth-tab');
            const authForms = document.querySelectorAll('.auth-form');
            const loginForm = document.getElementById('login-form');
            const signupForm = document.getElementById('signup-form');
            const showSignup = document.getElementById('show-signup');
            const showLogin = document.getElementById('show-login');
            const logoutBtn = document.getElementById('logout-btn');
            const profileBtn = document.getElementById('profile-btn');
            const userAvatar = document.getElementById('user-avatar');
            const dropdownMenu = document.getElementById('dropdown-menu');

            // Show login modal
            loginBtn.addEventListener('click', function() {
                authModal.classList.add('active');
                switchAuthTab('login');
            });

            // Switch between login and signup tabs
            authTabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    const tabName = this.dataset.tab;
                    switchAuthTab(tabName);
                });
            });

            // Show signup form
            showSignup.addEventListener('click', function() {
                switchAuthTab('signup');
            });

            // Show login form
            showLogin.addEventListener('click', function() {
                switchAuthTab('login');
            });

            // Switch authentication tab
            function switchAuthTab(tabName) {
                // Update tabs
                authTabs.forEach(tab => {
                    if (tab.dataset.tab === tabName) {
                        tab.classList.add('active');
                    } else {
                        tab.classList.remove('active');
                    }
                });

                // Update forms
                authForms.forEach(form => {
                    if (form.id === `${tabName}-form`) {
                        form.classList.add('active');
                    } else {
                        form.classList.remove('active');
                    }
                });
            }

            // Login form submission
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const email = document.getElementById('login-email').value;
                const password = document.getElementById('login-password').value;
                
                const result = authSystem.login(email, password);
                
                if (result.success) {
                    authModal.classList.remove('active');
                    loginForm.reset();
                    alert('Login successful!');
                } else {
                    alert(result.message);
                }
            });

            // Signup form submission
            signupForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const name = document.getElementById('signup-name').value;
                const email = document.getElementById('signup-email').value;
                const password = document.getElementById('signup-password').value;
                const confirmPassword = document.getElementById('signup-confirm-password').value;
                
                // Validate passwords match
                if (password !== confirmPassword) {
                    alert('Passwords do not match');
                    return;
                }
                
                const result = authSystem.register(name, email, password);
                
                if (result.success) {
                    authModal.classList.remove('active');
                    signupForm.reset();
                    alert('Account created successfully!');
                } else {
                    alert(result.message);
                }
            });

            // Logout functionality
            logoutBtn.addEventListener('click', function() {
                authSystem.logout();
                alert('You have been logged out');
            });

            // Profile button functionality
            profileBtn.addEventListener('click', function() {
                alert('Profile page would open here');
                // In a real implementation, this would navigate to a profile page
            });

            // User avatar dropdown
            userAvatar.addEventListener('click', function() {
                dropdownMenu.classList.toggle('show');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', function(e) {
                if (!e.target.closest('.user-dropdown')) {
                    dropdownMenu.classList.remove('show');
                }
            });

            // Close auth modal when clicking outside
            authModal.addEventListener('click', function(e) {
                if (e.target === authModal) {
                    authModal.classList.remove('active');
                }
            });

            // Accessibility Features
            const decreaseFontBtn = document.getElementById('decrease-font');
            const resetFontBtn = document.getElementById('reset-font');
            const increaseFontBtn = document.getElementById('increase-font');
            const contrastToggle = document.getElementById('contrast-toggle');
            const themeToggle = document.getElementById('theme-toggle');
            
            decreaseFontBtn.addEventListener('click', function() {
                changeFontSize(-1);
            });
            
            resetFontBtn.addEventListener('click', function() {
                document.body.style.fontSize = '';
            });
            
            increaseFontBtn.addEventListener('click', function() {
                changeFontSize(1);
            });
            
            function changeFontSize(direction) {
                const currentSize = parseFloat(getComputedStyle(document.body).fontSize);
                const newSize = currentSize + (direction * 2);
                document.body.style.fontSize = newSize + 'px';
            }
            
            // High contrast toggle
            contrastToggle.addEventListener('click', function() {
                document.body.classList.toggle('high-contrast');
                if (document.body.classList.contains('high-contrast')) {
                    contrastToggle.textContent = 'Normal Contrast';
                } else {
                    contrastToggle.textContent = 'High Contrast';
                }
            });
            
            // Dark/Light mode toggle
            themeToggle.addEventListener('click', function() {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', newTheme);
                themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
                localStorage.setItem('autoflow-theme', newTheme);
            });
            
            // Load saved theme
            const savedTheme = localStorage.getItem('autoflow-theme') || 'light';
            document.documentElement.setAttribute('data-theme', savedTheme);
            themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

            // Import workflow functionality
            const importWorkflowBtn = document.getElementById('import-workflow');
            const importFileInput = document.getElementById('import-file');
            
            importWorkflowBtn.addEventListener('click', function() {
                importFileInput.click();
            });
            
            importFileInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        const workflow = workflowEngine.importWorkflow(event.target.result);
                        if (workflow) {
                            loadWorkflowsList();
                            alert('Workflow imported successfully!');
                        }
                    };
                    reader.readAsText(file);
                }
                
                // Reset the file input
                e.target.value = '';
            });
            
            // Load and display workflows
            function loadWorkflowsList() {
                const workflowList = document.getElementById('workflow-list');
                workflowList.innerHTML = '';
                
                if (workflowEngine.workflows.length === 0) {
                    workflowList.innerHTML = '<p>No workflows saved yet.</p>';
                    return;
                }
                
                workflowEngine.workflows.forEach(workflow => {
                    const workflowCard = document.createElement('div');
                    workflowCard.className = 'workflow-card card';
                    workflowCard.innerHTML = `
                        <h3>${workflow.name}</h3>
                        <p>${workflow.description || 'No description'}</p>
                        <p><small>Created: ${new Date(workflow.created).toLocaleDateString()}</small></p>
                        <div class="workflow-actions">
                            <button class="btn btn-primary execute-workflow" data-id="${workflow.id}">Execute</button>
                            <button class="btn btn-secondary export-workflow" data-id="${workflow.id}">Export</button>
                            <button class="btn btn-secondary delete-workflow" data-id="${workflow.id}">Delete</button>
                        </div>
                    `;
                    workflowList.appendChild(workflowCard);
                });
                
                // Add event listeners to workflow actions
                document.querySelectorAll('.execute-workflow').forEach(button => {
                    button.addEventListener('click', function() {
                        const workflowId = this.dataset.id;
                        const workflow = workflowEngine.getWorkflow(workflowId);
                        if (workflow) {
                            workflowEngine.executeWorkflow(workflow.steps);
                        }
                    });
                });
                
                document.querySelectorAll('.delete-workflow').forEach(button => {
                    button.addEventListener('click', function() {
                        const workflowId = this.dataset.id;
                        if (confirm('Are you sure you want to delete this workflow?')) {
                            workflowEngine.deleteWorkflow(workflowId);
                            loadWorkflowsList();
                        }
                    });
                });
            }
            
            // Form Data Storage Functionality
            const formDataTabs = document.querySelectorAll('.form-data-tab');
            const formDataTabContents = document.querySelectorAll('.form-data-tab-content');
            
            // Tab switching
            formDataTabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    const tabId = this.dataset.tab;
                    
                    // Update active tab
                    formDataTabs.forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Show corresponding content
                    formDataTabContents.forEach(content => {
                        content.classList.remove('active');
                        if (content.id === `${tabId}-tab`) {
                            content.classList.add('active');
                        }
                    });
                    
                    // If switching to My Data tab, reload the form data list
                    if (tabId === 'my-data') {
                        loadFormDataList();
                    }
                });
            });
            
            // Load form data list
            function loadFormDataList() {
                const formDataList = document.getElementById('form-data-list');
                formDataList.innerHTML = '';
                
                if (workflowEngine.formDataEngine.formDataProfiles.length === 0) {
                    formDataList.innerHTML = '<p>No form data saved yet. Add your first form data profile using the "Add New Data" tab!</p>';
                    return;
                }
                
                workflowEngine.formDataEngine.formDataProfiles.forEach(profile => {
                    const formDataCard = document.createElement('div');
                    formDataCard.className = 'form-data-card card';
                    formDataCard.innerHTML = `
                        <h4>${profile.name}</h4>
                        <p>${profile.description || 'No description'}</p>
                        <p><small>${profile.fields.length} fields • Updated: ${new Date(profile.updated).toLocaleDateString()}</small></p>
                        <div class="form-data-actions">
                            <button class="btn btn-primary edit-form-data" data-id="${profile.id}">Edit</button>
                            <button class="btn btn-secondary use-form-data" data-id="${profile.id}">Use in Workflow</button>
                            <button class="btn btn-danger delete-form-data" data-id="${profile.id}">Delete</button>
                        </div>
                    `;
                    formDataList.appendChild(formDataCard);
                });
                
                // Add event listeners to form data actions
                document.querySelectorAll('.edit-form-data').forEach(button => {
                    button.addEventListener('click', function() {
                        const formDataId = this.dataset.id;
                        showEditFormDataModal(formDataId);
                    });
                });
                
                document.querySelectorAll('.use-form-data').forEach(button => {
                    button.addEventListener('click', function() {
                        const formDataId = this.dataset.id;
                        alert(`Form data "${workflowEngine.formDataEngine.getFormData(formDataId).name}" can now be used in workflows.`);
                    });
                });
                
                document.querySelectorAll('.delete-form-data').forEach(button => {
                    button.addEventListener('click', function() {
                        const formDataId = this.dataset.id;
                        const profile = workflowEngine.formDataEngine.getFormData(formDataId);
                        if (profile && confirm(`Are you sure you want to delete the form data profile "${profile.name}"?`)) {
                            workflowEngine.formDataEngine.deleteFormData(formDataId);
                            loadFormDataList();
                        }
                    });
                });
            }
            
            // Add form data functionality
            const addFormDataForm = document.getElementById('add-form-data-form');
            const addFieldBtn = document.getElementById('add-field-btn');
            const fieldList = document.getElementById('field-list');
            
            // Add field button
            addFieldBtn.addEventListener('click', function() {
                addFieldToForm(fieldList);
            });
            
            // Function to add a field to the form
            function addFieldToForm(container, field = { name: '', value: '', label: '' }) {
                const fieldItem = document.createElement('div');
                fieldItem.className = 'field-item';
                fieldItem.innerHTML = `
                    <div class="field-name">
                        <input type="text" class="form-control field-name-input" placeholder="Field Name (e.g., first_name)" value="${field.name}" required>
                    </div>
                    <div class="field-value">
                        <input type="text" class="form-control field-value-input" placeholder="Field Value" value="${field.value}">
                    </div>
                    <div class="field-label">
                        <input type="text" class="form-control field-label-input" placeholder="Display Label (e.g., First Name)" value="${field.label}">
                    </div>
                    <div class="field-actions">
                        <button type="button" class="btn btn-danger remove-field">×</button>
                    </div>
                `;
                container.appendChild(fieldItem);
                
                // Add event listener to remove button
                fieldItem.querySelector('.remove-field').addEventListener('click', function() {
                    fieldItem.remove();
                });
            }
            
            // Add form data form submission
            addFormDataForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const name = document.getElementById('form-data-name').value;
                const description = document.getElementById('form-data-description').value;
                
                // Collect field data
                const fields = [];
                const fieldItems = fieldList.querySelectorAll('.field-item');
                fieldItems.forEach(item => {
                    const nameInput = item.querySelector('.field-name-input');
                    const valueInput = item.querySelector('.field-value-input');
                    const labelInput = item.querySelector('.field-label-input');
                    
                    if (nameInput.value.trim()) {
                        fields.push({
                            name: nameInput.value.trim(),
                            value: valueInput.value.trim(),
                            label: labelInput.value.trim() || nameInput.value.trim()
                        });
                    }
                });
                
                if (fields.length === 0) {
                    alert('Please add at least one field to your form data profile.');
                    return;
                }
                
                // Add the form data profile
                workflowEngine.formDataEngine.addFormData(name, description, fields);
                
                // Reset the form
                addFormDataForm.reset();
                fieldList.innerHTML = '';
                
                // Switch to My Data tab
                document.querySelector('.form-data-tab[data-tab="my-data"]').click();
                
                alert('Form data profile saved successfully!');
            });
            
            // Template functionality
            const useTemplateButtons = document.querySelectorAll('.use-template');
            
            useTemplateButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const templateName = this.dataset.template;
                    const profile = workflowEngine.formDataEngine.useTemplate(templateName);
                    
                    if (profile) {
                        // Switch to Add New Data tab and pre-fill the form
                        document.querySelector('.form-data-tab[data-tab="add-data"]').click();
                        
                        document.getElementById('form-data-name').value = profile.name;
                        document.getElementById('form-data-description').value = profile.description || '';
                        
                        // Clear existing fields and add template fields
                        fieldList.innerHTML = '';
                        profile.fields.forEach(field => {
                            addFieldToForm(fieldList, field);
                        });
                        
                        alert('Template loaded! Fill in your specific values and save.');
                    }
                });
            });
            
            // Edit form data modal
            const editFormDataModal = document.getElementById('edit-form-data-modal');
            const closeEditFormDataModal = document.getElementById('close-edit-form-data-modal');
            const editFormDataForm = document.getElementById('edit-form-data-form');
            const addEditFieldBtn = document.getElementById('add-edit-field-btn');
            const editFieldList = document.getElementById('edit-field-list');
            
            // Show edit form data modal
            function showEditFormDataModal(formDataId) {
                const profile = workflowEngine.formDataEngine.getFormData(formDataId);
                if (!profile) return;
                
                currentEditingFormDataId = formDataId;
                
                // Populate the form
                document.getElementById('edit-form-data-id').value = profile.id;
                document.getElementById('edit-form-data-name').value = profile.name;
                document.getElementById('edit-form-data-description').value = profile.description || '';
                
                // Populate fields
                editFieldList.innerHTML = '';
                profile.fields.forEach(field => {
                    addFieldToForm(editFieldList, field);
                });
                
                editFormDataModal.style.display = 'flex';
            }
            
            // Add field button for edit form
            addEditFieldBtn.addEventListener('click', function() {
                addFieldToForm(editFieldList);
            });
            
            // Edit form data form submission
            editFormDataForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const id = document.getElementById('edit-form-data-id').value;
                const name = document.getElementById('edit-form-data-name').value;
                const description = document.getElementById('edit-form-data-description').value;
                
                // Collect field data
                const fields = [];
                const fieldItems = editFieldList.querySelectorAll('.field-item');
                fieldItems.forEach(item => {
                    const nameInput = item.querySelector('.field-name-input');
                    const valueInput = item.querySelector('.field-value-input');
                    const labelInput = item.querySelector('.field-label-input');
                    
                    if (nameInput.value.trim()) {
                        fields.push({
                            name: nameInput.value.trim(),
                            value: valueInput.value.trim(),
                            label: labelInput.value.trim() || nameInput.value.trim()
                        });
                    }
                });
                
                if (fields.length === 0) {
                    alert('Please add at least one field to your form data profile.');
                    return;
                }
                
                // Update the form data profile
                workflowEngine.formDataEngine.updateFormData(id, name, description, fields);
                
                // Close the modal
                editFormDataModal.style.display = 'none';
                
                // Reload the form data list
                loadFormDataList();
                
                alert('Form data profile updated successfully!');
            });
            
            // Close edit form data modal
            closeEditFormDataModal.addEventListener('click', function() {
                editFormDataModal.style.display = 'none';
            });
            
            // Initialize the workflows list (after sync)
            loadWorkflowsList();

            // Initialize form data list
            loadFormDataList();
            
            // Close modals when clicking outside
            window.addEventListener('click', function(e) {
                if (e.target.classList.contains('modal')) {
                    e.target.style.display = 'none';
                }
            });
        });
       
// language support removed