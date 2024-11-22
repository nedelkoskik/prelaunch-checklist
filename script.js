document.addEventListener('DOMContentLoaded', () => {
    const checkboxes = document.querySelectorAll('.checklist-single__item input[type="checkbox"]');
    // Load the saved state from cookies and set the checkboxes accordingly
    const checkboxObj = {};
    checkboxes.forEach((checkbox) => {
        const savedState = getCookie(checkbox.id);
        if (savedState === 'true') {
            checkbox.checked = true;
            checkboxObj[checkbox.id] = checkbox.checked;
        }

        // Add event listener to each checkbox to save the state when changed
        checkbox.addEventListener('change', () => {
            id = checkbox.id;
            value = checkbox.checked;
            checkboxObj[id] = value;
            setCookie(id, value, 7)
        });
    });

    console.log(checkboxObj);
    // Add event listener to the reset button
    const resetButton = document.getElementById('resetButton');
    resetButton.addEventListener('click', () => {
        checkboxes.forEach((checkbox) => {
            checkbox.checked = false; // Uncheck all checkboxes
            deleteCookie(checkbox.id); // Remove the cookie for that checkbox
        });
    });
});


// Function to get a cookie by name
function getCookie(name) {
    const cookies = document.cookie.split(';'); // Get all cookies and break this string into array
    for (let i = 0; i < cookies.length; i++) { //Loop through all cookies
        const cookie = cookies[i].trim(); // Trim extra spaces from cookie string
        if (cookie.indexOf(name + "=") === 0) { // Check if cookie starts with the given name
            return cookie.substring((name + "=").length, cookie.length); // Extract the value. Exclude the name and = sign and returns everything afret = sign
        }
    }

    return null;
}

// Function to set a cookie
function setCookie(name, value, days) {
    const d = new Date(); //Create a new Date obj to manipulate time
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000)); // Set expiration time - convert milliseconds in days
    const expires = "expires=" + d.toUTCString(); //Get expriration date in UTC format
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// Function to save the state of a checkbox in a cookie
function saveCheckboxState(checkbox) {
    setCookie(checkbox.id, checkbox.checked, 7); // Save for 7 days
}

// Function to delete a cookie
function deleteCookie(name) {
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/"; // Expire the cookie immediately
}
