document.addEventListener('DOMContentLoaded', () => {
    const domainDropdown = document.getElementById('domain-dropdown__menu');
    const domainInput = document.getElementById('domain');
    const checklistContainer = document.querySelector('.checklist');
    const headerSpan = document.getElementById('dynamic-domain');
    const resetButton = document.getElementById('resetButton');

    let domainChecklists = JSON.parse(localStorage.getItem('domainChecklists')) || {};

    // Function to render the checklist for the selected domain
    function renderChecklist(domain) {
        if (!domain) return;

        headerSpan.textContent = domain; // Update header with the domain

        const savedChecklist = domainChecklists[domain] || {};
        const checkboxes = checklistContainer.querySelectorAll('input[type="checkbox"]');

        // Set checkboxes based on saved data
        checkboxes.forEach((checkbox) => {
            checkbox.checked = savedChecklist[checkbox.id] || false;

            // Add event listener to update the checklist when a checkbox changes
            checkbox.addEventListener('change', () => {
                savedChecklist[checkbox.id] = checkbox.checked;
                domainChecklists[domain] = savedChecklist;
                saveToLocalStorage();
            });
        });
    }

    // Function to save data to localStorage
    function saveToLocalStorage() {
        localStorage.setItem('domainChecklists', JSON.stringify(domainChecklists));
    }

    // Function to add a domain to the dropdown
    function addDomainToDropdown(domain) {
        if (!Array.from(domainDropdown.options).some(option => option.value === domain)) {
            const option = document.createElement('option');
            option.value = domain;
            option.textContent = domain;
            domainDropdown.appendChild(option);
        }
    }

    // Handle form submission to add a new domain
    document.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault();
        const newDomain = domainInput.value.trim();
        if (!newDomain) return;

        domainChecklists[newDomain] = domainChecklists[newDomain] || {};
        addDomainToDropdown(newDomain);
        renderChecklist(newDomain);
        domainInput.value = ''; // Clear input
        saveToLocalStorage();
    });

    // Handle domain selection from the dropdown
    domainDropdown.addEventListener('change', () => {
        const selectedDomain = domainDropdown.value;
        renderChecklist(selectedDomain);
    });

    // Reset checklist and handle domain deletion if necessary
    resetButton.addEventListener('click', () => {
        const currentDomain = domainDropdown.value;
        if (!currentDomain) return;

        const checkboxes = checklistContainer.querySelectorAll('input[type="checkbox"]');
        let hasCheckedBoxes = false;

        // Reset all checkboxes
        checkboxes.forEach((checkbox) => {
            checkbox.checked = false;
            if (domainChecklists[currentDomain][checkbox.id]) {
                hasCheckedBoxes = true;
            }
        });

        // If no boxes are checked, delete the domain
        if (!hasCheckedBoxes) {
            delete domainChecklists[currentDomain];
            const optionToRemove = Array.from(domainDropdown.options).find(option => option.value === currentDomain);
            if (optionToRemove) optionToRemove.remove();
            headerSpan.textContent = 'WordPress Site'; // Reset header
        } else {
            domainChecklists[currentDomain] = {};
        }

        saveToLocalStorage();
    });

    // Load domains into the dropdown on page load
    Object.keys(domainChecklists).forEach(addDomainToDropdown);

    // Automatically render checklist for the first domain in the dropdown (if any)
    if (domainDropdown.value) {
        renderChecklist(domainDropdown.value);
    }
});
