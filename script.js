document.addEventListener('DOMContentLoaded', () => {
    const domainForm = document.getElementById('domain-form');
    const domainInput = document.getElementById('domain');
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
        checklistContainer.style.display = 'block';

        const checkboxes = checklistContainer.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach((checkbox) => {
            const savedState = getCookie(`${checklistPrefix}${domain}_${checkbox.id}`);
            checkbox.checked = savedState === 'true';

            checkbox.addEventListener('change', () => {
                setCookie(`${checklistPrefix}${domain}_${checkbox.id}`, checkbox.checked, 7);
            });
        });
    }

    // Reset checklist for a given domain
    function resetChecklist(domain) {
        const checkboxes = checklistContainer.querySelectorAll('input[type="checkbox"]');
        let isAnyChecked = false;

        checkboxes.forEach((checkbox) => {
            checkbox.checked = false;
            deleteCookie(`${checklistPrefix}${domain}_${checkbox.id}`);
        });

        checkboxes.forEach((checkbox) => {
            if (checkbox.checked) {
                isAnyChecked = true;
            }
        });

        if (!isAnyChecked) {
            deleteDomain(domain);
        }
    }

    // Save a new domain to the list
    function saveDomain(domain) {
        let domains = JSON.parse(getCookie(domainKey) || "[]");
        if (!domains.includes(domain)) {
            domains.push(domain);
            setCookie(domainKey, JSON.stringify(domains), 7);
        }
    }

    // Load all saved domains into the dropdown
    function loadDomains() {
        let domains = JSON.parse(getCookie(domainKey) || "[]");
        domains.forEach((domain) => {
            addDomainToDropdown(domain);
        });
    }

    // Add a domain to the dropdown
    function addDomainToDropdown(domain) {
        const exists = Array.from(dropdownMenu.options).some(option => option.value === domain);
        if (!exists) {
            const option = document.createElement('option');
            option.value = domain;
            option.textContent = domain;
            dropdownMenu.appendChild(option);
        }
    }

    // Delete a domain from the dropdown and cookies
    function deleteDomain(domain) {
        let domains = JSON.parse(getCookie(domainKey) || "[]");
        domains = domains.filter((d) => d !== domain);
        setCookie(domainKey, JSON.stringify(domains), 7);

        const options = Array.from(dropdownMenu.options);
        options.forEach((option) => {
            if (option.value === domain) {
                dropdownMenu.removeChild(option);
            }
        });

        if (dropdownMenu.value === domain) {
            dropdownMenu.value = '';
            dynamicDomainSpan.textContent = 'WordPress Site';
            checklistContainer.style.display = 'none';
        }
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
