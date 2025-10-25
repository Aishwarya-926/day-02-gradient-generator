// --- DOM Element Selection ---
const gradientPreview = document.getElementById('gradient-preview');
const cssOutput = document.getElementById('css-output');
const angleInput = document.getElementById('angle');
const angleValue = document.getElementById('angle-value');
const angleControl = document.getElementById('angle-control');
const copyBtn = document.getElementById('copy-btn');
const randomBtn = document.getElementById('random-btn');
const addColorBtn = document.getElementById('add-color-btn');
const colorStopsContainer = document.getElementById('color-stops');
const gradientTypeRadios = document.querySelectorAll('input[name="gradient-type"]');

// --- State Management ---
let colors = ['#ff8c00', '#ff0080']; // Initial colors

// --- Functions ---

/**
 * Generates the CSS gradient string and updates the UI.
 * This is our main "render" function.
 */
function generateGradient() {
    const activeType = document.querySelector('input[name="gradient-type"]:checked').value;
    const angle = angleInput.value;
    const colorString = colors.join(', ');

    let gradientString;
    if (activeType === 'linear') {
        gradientString = `linear-gradient(${angle}deg, ${colorString})`;
        angleControl.style.display = 'block';
    } else {
        gradientString = `radial-gradient(circle, ${colorString})`;
        angleControl.style.display = 'none';
    }
    
    gradientPreview.style.background = gradientString;
    cssOutput.textContent = `background: ${gradientString};`;
    angleValue.textContent = `${angle}°`;
}

/**
 * Renders all color stop input elements based on the current 'colors' array.
 */
function renderColorStops() {
    // Clear existing color stops before re-rendering
    colorStopsContainer.innerHTML = ''; 
    
    colors.forEach((color, index) => {
        const colorStopDiv = document.createElement('div');
        colorStopDiv.className = 'color-stop';

        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.className = 'color-input';
        colorInput.value = color;
        // Store the index on the element for easy access later
        colorInput.dataset.index = index; 

        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-color-btn';
        removeBtn.textContent = 'x';
        removeBtn.dataset.index = index;

        // Only show the remove button if there are more than 2 colors
        if (colors.length > 2) {
            colorStopDiv.appendChild(removeBtn);
        }
        
        colorStopDiv.appendChild(colorInput);
        colorStopsContainer.appendChild(colorStopDiv);
    });
}

/**
 * Generates a random hex color.
 */
function getRandomColor() {
    return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
}

// --- Event Handlers ---

function handleAddColor() {
    if (colors.length < 10) { // Let's set a reasonable limit
        colors.push(getRandomColor());
        renderColorStops();
        generateGradient();
    }
}

function handleRandomize() {
    const numColors = Math.max(2, colors.length); // Keep the same number of colors
    colors = [];
    for (let i = 0; i < numColors; i++) {
        colors.push(getRandomColor());
    }
    angleInput.value = Math.floor(Math.random() * 361);
    renderColorStops();
    generateGradient();
}

function copyToClipboard() {
    navigator.clipboard.writeText(cssOutput.textContent).then(() => {
        copyBtn.textContent = 'Copied!';
        setTimeout(() => { copyBtn.textContent = 'Copy to Clipboard'; }, 2000);
    }).catch(err => console.error('Failed to copy: ', err));
}

// --- Event Listeners using Delegation ---

// Handles clicks on dynamically added "remove" buttons
colorStopsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-color-btn')) {
        const index = parseInt(e.target.dataset.index, 10);
        colors.splice(index, 1);
        renderColorStops();
        generateGradient();
    }
});

// Handles color changes in dynamically added color inputs
colorStopsContainer.addEventListener('input', (e) => {
    if (e.target.classList.contains('color-input')) {
        const index = parseInt(e.target.dataset.index, 10);
        colors[index] = e.target.value;
        generateGradient();
    }
});

// Static element listeners
angleInput.addEventListener('input', generateGradient);
gradientTypeRadios.forEach(radio => radio.addEventListener('change', generateGradient));
addColorBtn.addEventListener('click', handleAddColor);
randomBtn.addEventListener('click', handleRandomize);
copyBtn.addEventListener('click', copyToClipboard);

// --- Initial Call ---
// Use DOMContentLoaded to make sure the script runs after the page is ready
document.addEventListener('DOMContentLoaded', () => {
    renderColorStops();
    generateGradient();
});
