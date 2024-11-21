document.addEventListener('DOMContentLoaded', function () {
    const domainForm = document.getElementById('domain-form');
    const domainInput = document.getElementById('domain');
    const domainDropdown = document.getElementById('domain-dropdown__menu');
    const dynamicDomain = document.getElementById('dynamic-domain');

    // Listen for form submission
    domainForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission

        const domainValue = domainInput.value.trim(); // Get the domain value entered

        if (domainValue && !domainExists(domainValue)) {
            // Add new option to the dropdown menu
            const newOption = document.createElement('option');
            newOption.value = domainValue;
            newOption.textContent = domainValue;

            domainDropdown.appendChild(newOption);

            // Automatically select the newly added domain
            domainDropdown.value = domainValue;

            // Update the dynamic domain display
            dynamicDomain.textContent = domainValue;

            // Clear the input field after submission
            domainInput.value = '';
        }
    });

    // Helper function to check if domain already exists in the dropdown
    function domainExists(domain) {
        const options = domainDropdown.getElementsByTagName('option');
        for (let i = 0; i < options.length; i++) {
            if (options[i].value === domain) {
                return true;
            }
        }
        return false;
    }
});
