document.addEventListener('DOMContentLoaded', () => {
    const domainForm = document.getElementById('domain-form');
    const domainDropdown = document.getElementById('domain-dropdown__menu');
    const checklistContainer = document.querySelector('.checklist');
    const resetButton = document.getElementById('resetButton');

    // Initially hide the checklist
    checklistContainer.style.display = 'none';

    // Fetch stored domains and populate the dropdown
    fetchDomains();

    // Handle domain form submission
    domainForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const domainInput = document.getElementById('domain').value.trim();

        if (domainInput) {
            // Send the domain to domain.php
            await fetch('domain.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ domain: domainInput }),
            });

            // Update the dropdown and select the new domain
            await fetchDomains();
            domainDropdown.value = domainInput;
            displayChecklist(domainInput);
        }
    });

    // Handle dropdown change
    domainDropdown.addEventListener('change', () => {
        const selectedDomain = domainDropdown.value;
        if (selectedDomain) {
            displayChecklist(selectedDomain);
        } else {
            checklistContainer.style.display = 'none';
        }
    });

    // Reset checklist
    resetButton.addEventListener('click', () => {
        const selectedDomain = domainDropdown.value;
        if (selectedDomain) {
            resetChecklist(selectedDomain);
        }
    });

    // Fetch stored domains from server
    async function fetchDomains() {
        const response = await fetch('domain.php');
        const domains = await response.json();

        // Populate dropdown
        domainDropdown.innerHTML = '<option value="">-- Select Domain --</option>';
        domains.forEach((domain) => {
            const option = document.createElement('option');
            option.value = domain;
            option.textContent = domain;
            domainDropdown.appendChild(option);
        });
    }

    // Display checklist for a specific domain
    function displayChecklist(domain) {
        checklistContainer.style.display = 'block';

        const checkboxes = document.querySelectorAll('.checklist-single__item input[type="checkbox"]');
        checkboxes.forEach((checkbox) => {
            const savedState = getCookie(`${domain}_${checkbox.id}`);
            checkbox.checked = savedState === 'true';

            checkbox.onchange = () => {
                setCookie(`${domain}_${checkbox.id}`, checkbox.checked, 7);
            };
        });
    }

    // Reset checklist for a specific domain
    function resetChecklist(domain) {
        const checkboxes = document.querySelectorAll('.checklist-single__item input[type="checkbox"]');
        checkboxes.forEach((checkbox) => {
            checkbox.checked = false;
            deleteCookie(`${domain}_${checkbox.id}`);
        });
    }

    // Cookie utility functions
    function setCookie(name, value, days) {
        const d = new Date();
        d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
        const expires = 'expires=' + d.toUTCString();
        document.cookie = `${name}=${value};${expires};path=/`;
    }

    function getCookie(name) {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith(name + '=')) {
                return cookie.substring(name.length + 1);
            }
        }
        return null;
    }

    function deleteCookie(name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
    }
});
