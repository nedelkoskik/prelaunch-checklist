document.addEventListener('DOMContentLoaded', () => {
    const domainForm = document.getElementById('domain-form');
    const domainInput = document.getElementById('domain');
    const dropdownMenu = document.getElementById('domain-dropdown__menu');
    const checklistContainer = document.querySelector('.checklist');
    const resetButton = document.getElementById('resetButton');
    const checklists = {}; // Object to store checklists for each domain

    // Fetch existing domains and populate the dropdown
    fetchDomains();

    // Handle domain form submission
    domainForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newDomain = domainInput.value.trim();
        if (newDomain) {
            await saveDomain(newDomain); // Save domain to server
            domainInput.value = ''; // Clear input field
        }
    });

    // Handle dropdown selection
    dropdownMenu.addEventListener('change', (e) => {
        const selectedDomain = e.target.value;
        if (selectedDomain) {
            loadChecklist(selectedDomain);
        } else {
            checklistContainer.style.display = 'none';
        }
    });

    // Load the saved checklist for a domain
    function loadChecklist(domain) {
        checklistContainer.style.display = 'block';

        const checkboxes = checklistContainer.querySelectorAll('input[type="checkbox"]');
        const savedChecklist = checklists[domain] || {};

        checkboxes.forEach((checkbox) => {
            checkbox.checked = savedChecklist[checkbox.id] || false;

            checkbox.addEventListener('change', () => {
                saveChecklistState(domain, checkbox);
            });
        });

        resetButton.addEventListener('click', () => {
            checkboxes.forEach((checkbox) => {
                checkbox.checked = false;
            });
            checklists[domain] = {}; // Reset domain's checklist
        });
    }

    // Save checklist state for a domain
    function saveChecklistState(domain, checkbox) {
        if (!checklists[domain]) {
            checklists[domain] = {};
        }
        checklists[domain][checkbox.id] = checkbox.checked;
    }

    // Fetch domains from the server
    async function fetchDomains() {
        const response = await fetch('domain.php');
        const domains = await response.json();
        populateDropdown(domains);
    }

    // Save a new domain to the server
    async function saveDomain(domain) {
        const response = await fetch('domain.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ domain }),
        });
        const domains = await response.json();
        populateDropdown(domains, domain);
    }

    // Populate the dropdown with domains
    function populateDropdown(domains, autoSelectDomain = null) {
        dropdownMenu.innerHTML = '<option value="">-- Select Domain --</option>';
        domains.forEach((domain) => {
            const option = document.createElement('option');
            option.value = domain;
            option.textContent = domain;
            dropdownMenu.appendChild(option);
        });

        if (autoSelectDomain) {
            dropdownMenu.value = autoSelectDomain;
            loadChecklist(autoSelectDomain);
        }
    }
});
