document.addEventListener('DOMContentLoaded', () => {
    const domainForm = document.getElementById('domain-form');
    const domainInput = document.getElementById('domain-input');
    const dropdownMenu = document.getElementById('domain-dropdown__menu');
    const dynamicDomainSpan = document.getElementById('dynamic-domain');
    const checklistContainer = document.querySelector('.checklist');
    const backButton = document.querySelector('.back');
    const resetButton = document.getElementById('resetButton');

    // Store checklists per domain in cookies
    const domainKey = "domains"; // Key for storing domains
    const checklistPrefix = "checklist_";

    // Initialize checklist
    loadDomains();

    // Event listener for domain submission
    domainForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const domain = domainInput.value.trim();
        if (!domain) return;

        addDomainToDropdown(domain);
        saveDomain(domain);
        loadChecklist(domain);
        dropdownMenu.value = domain;
        domainInput.value = '';
    });

    // Event listener for domain dropdown change
    dropdownMenu.addEventListener('change', () => {
        const selectedDomain = dropdownMenu.value;
        if (selectedDomain) {
            loadChecklist(selectedDomain);
        } else {
            checklistContainer.style.display = 'none';
            dynamicDomainSpan.textContent = 'WordPress Site';
        }
    });

    // Event listener for back button
    backButton.addEventListener('click', () => {
        checklistContainer.style.display = 'none';
    });

    // Event listener for reset button
    resetButton.addEventListener('click', () => {
        const currentDomain = dropdownMenu.value;
        if (currentDomain) {
            resetChecklist(currentDomain);
        }
    });

    // Load checklist for a given domain
    function loadChecklist(domain) {
        dynamicDomainSpan.textContent = domain;

        // Clear existing checkboxes and their states
        checklistContainer.innerHTML = '';
        const existingDomains = JSON.parse(getCookie(domainKey) || "[]");
        if (existingDomains.includes(domain)) {
            // Create a new list of checkboxes with the correct ID
            let checkboxCount = 1;
            existingDomains.forEach((existingDomain) => {
                if (existingDomain !== domain) {
                    const option = document.createElement('option');
                    option.value = existingDomain;
                    option.textContent = existingDomain;
                    dropdownMenu.appendChild(option);
                }
            });
        }

        // Generate new checkboxes
        let checkboxesCount = 0;
        for (let i = 1; i <= checkboxCount; i++) {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `checklist_${domain}_${i}`;
            checkbox.name = `${domain}_${i}`;

            const label = document.createElement('label');
            label.textContent = i;
            label.htmlFor = `checklist_${domain}_${i}`;

            const wrapper = document.createElement('div');
            wrapper.appendChild(checkbox);
            wrapper.appendChild(label);

            checklistContainer.appendChild(wrapper);

            checkboxesCount++;
        }

        // Initialize checkbox states from cookies
        const savedStates = getSavedCheckboxesState();
        Object.keys(savedStates).forEach((key) => {
            if (savedStates[key] === 'true') {
                const checkbox = document.querySelector(`#${key}`);
                checkbox.checked = true;
            }
        });

        // Add event listener to each checkbox
        checkboxesCount = 0;
        for (let i = 1; i <= checkboxCount; i++) {
            const checkbox =
                document.querySelector(`#${checklistPrefix}${domain}_${i}`);
            checkbox.addEventListener('change', () => {
                saveCheckboxesState();
            });
        }
    }

    // Event listener for domain dropdown change
    dropdownMenu.addEventListener('change', () => {
        const selectedDomain = dropdownMenu.value;
        if (selectedDomain) {
            loadChecklist(selectedDomain);
            deleteCookie(domainKey + '_' + selectedDomain); // Remove existing cookie
        } else {
            checklistContainer.style.display = 'none';
            dynamicDomainSpan.textContent = 'WordPress Site';
        }
    });

    // Save checkboxes state to cookies
    function saveCheckboxesState() {
        let savedStates = getSavedCheckboxesState();
        Object.keys(savedStates).forEach((key) => {
            const domainAndIndex = key.split('_');
            if (domainAndIndex[0] === `${checklistPrefix}${dropdownMenu.value}_`) {
                const index = parseInt(domainAndIndex[1]);
                savedStates[key] = document.querySelector(`#${key}`).checked ?
                    'true' : 'false';
            }
        });

        setCookie(domainKey, JSON.stringify(savedStates), 30 * 24 * 60 * 60);
    }

    // Get saved checkboxes state from cookies
    function getSavedCheckboxesState() {
        const domains = JSON.parse(getCookie(domainKey));
        return {};
    }

    // Add domain to dropdown menu if it doesn't exist
    function addDomainToDropdown(domain) {
        let option = document.createElement('option');
        option.value = domain;
        option.textContent = domain;
        dropdownMenu.appendChild(option);
    }

    // Cookie helpers
    function setCookie(name, value, days) {
        const d = new Date();
        d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
        const expires = "expires=" + d.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }

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

    function deleteCookie(name) {
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
    }
});