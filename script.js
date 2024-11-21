document.addEventListener('DOMContentLoaded', () => {
    const domainInput = document.getElementById('domain');
    const domainForm = document.querySelector('.domain-input form');
    const domainDropdown = document.getElementById('domain-dropdown__menu');
    const checklistContainer = document.querySelector('.checklist');
    const resetButton = document.getElementById('resetButton');

    // Load saved domains and initialize dropdown
    const savedDomains = JSON.parse(getCookie('domains') || '[]');
    savedDomains.forEach(domain => addDomainToDropdown(domain));
    if (savedDomains.length > 0) {
        loadChecklist(savedDomains[0]); // Load the first domain's checklist by default
    }

    // Handle adding a new domain
    domainForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const domain = domainInput.value.trim();
        if (domain && !savedDomains.includes(domain)) {
            savedDomains.push(domain);
            setCookie('domains', JSON.stringify(savedDomains), 7);
            addDomainToDropdown(domain);
            loadChecklist(domain, true); // Load a new, empty checklist for the new domain
        }
        domainInput.value = ''; // Clear input
    });

    // Handle domain selection from the dropdown
    domainDropdown.addEventListener('change', (e) => {
        const selectedDomain = e.target.value;
        if (selectedDomain) {
            loadChecklist(selectedDomain);
        }
    });

    // Reset the checklist for the current domain
    resetButton.addEventListener('click', () => {
        const currentDomain = domainDropdown.value;
        if (currentDomain) {
            const checkboxes = checklistContainer.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
                deleteCookie(`${currentDomain}_${checkbox.id}`); // Clear cookies for this domain's checklist
            });
        }
    });

    // Add a domain to the dropdown menu
    function addDomainToDropdown(domain) {
        const option = document.createElement('option');
        option.value = domain;
        option.textContent = domain;
        domainDropdown.appendChild(option);
    }

    // Load the checklist for a specific domain
    function loadChecklist(domain, isNew = false) {
        const checkboxes = checklistContainer.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            const savedState = isNew ? null : getCookie(`${domain}_${checkbox.id}`);
            checkbox.checked = savedState === 'true';

            // Update event listeners for the new domain
            checkbox.addEventListener('change', () => saveCheckboxState(domain, checkbox));
        });
    }

    // Save the state of a checkbox for a specific domain
    function saveCheckboxState(domain, checkbox) {
        setCookie(`${domain}_${checkbox.id}`, checkbox.checked, 7);
    }

    // Set a cookie
    function setCookie(name, value, days) {
        const d = new Date();
        d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + d.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }

    // Get a cookie by name
    function getCookie(name) {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.indexOf(name + "=") === 0) {
                return cookie.substring((name + "=").length, cookie.length);
            }
        }
        return null;
    }

    // Delete a cookie
    function deleteCookie(name) {
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
    }
});
