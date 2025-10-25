// Get references to all the necessary DOM elements
const gradientPreview = document.getElementById('gradient-preview');
const cssOutput = document.getElementById('css-output');
const angleInput = document.getElementById('angle');
const angleValue = document.getElementById('angle-value');
const colorInputs = document.querySelectorAll('.color-input');
const copyBtn = document.getElementById('copy-btn');

// This function is the heart of the application
function generateGradient() {
    // Get the current angle value
    const angle = angleInput.value;
    
    // Get the current color values
    const color1 = colorInputs[0].value;
    const color2 = colorInputs[1].value;

    // Construct the CSS linear-gradient string
    const gradientString = `linear-gradient(${angle}deg, ${color1}, ${color2})`;
    
    // 1. Update the background of the preview div
    gradientPreview.style.background = gradientString;
    
    // 2. Update the text of the CSS output code block
    cssOutput.textContent = `background: ${gradientString};`;

    // 3. Update the angle value display
    angleValue.textContent = `${angle}°`;
}

// Function to handle the "Copy to Clipboard" button click
function copyToClipboard() {
    // Get the text from the output code block
    const textToCopy = cssOutput.textContent;

    // Use the navigator.clipboard API to write the text to the clipboard
    navigator.clipboard.writeText(textToCopy)
        .then(() => {
            // Provide feedback to the user
            copyBtn.textContent = 'Copied!';
            // Reset the button text after 2 seconds
            setTimeout(() => {
                copyBtn.textContent = 'Copy to Clipboard';
            }, 2000);
        })
        .catch(err => {
            console.error('Failed to copy text: ', err);
            // You could display an error message to the user here
        });
}


// --- Event Listeners ---

// Add an event listener to the angle slider. 'input' fires continuously as it's dragged.
angleInput.addEventListener('input', generateGradient);

// Add event listeners to both color inputs
colorInputs.forEach(input => {
    input.addEventListener('input', generateGradient);
});

// Add a click event listener to the copy button
copyBtn.addEventListener('click', copyToClipboard);

// --- Initial Call ---

// Call the function once on page load to set the initial gradient
generateGradient();
