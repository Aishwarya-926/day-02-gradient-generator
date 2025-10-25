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
 * Generates the CSS gradient string based on the current state.
 */
function generateGradient() {
    const activeType = document.querySelector('input[name="gradient-type"]:checked').value;
    const angle = angleInput.value;
    const colorString = colors.join(', ');

    let gradientString;
    if (activeType === 'linear') {
        gradientString = `linear-gradient(${angle}deg, ${colorString})`;
        angleControl.style.display = 'block'; // Show angle control
    } else {
        gradientString = `radial-gradient(circle, ${colorString})`;
        angleControl.style.display = 'none'; // Hide angle control
    }
    
    gradientPreview.style.background = gradientString;
    cssOutput.textContent = `background: ${gradientString};`;
    angleValue.textContent = `${angle}°`;
}

/**
 * Creates and adds a new color stop element to the DOM.
 * @param {string} color - The initial color value for the new stop.
 */
function createColorStop(color) {
    const colorStopDiv = document.createElement('div');
    colorStopDiv.className = 'color-stop';

    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.className = 'color-input';
    colorInput.value = color;

    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-color-btn';
    removeBtn.textContent = 'x';
    
    colorStopDiv.appendChild(colorInput);
    colorStopDiv.appendChild(removeBtn);
    colorStopsContainer.appendChild(colorStopDiv);
}

/**
 * Renders all color stops based on the current 'colors' array.
 */
function renderColorStops() {
    colorStopsContainer.innerHTML = ''; // Clear existing stops
    colors.forEach(color => createColorStop(color));
}

/**
 * Generates a random hex color.
 * @returns {string} - A random color string, e.g., '#8a2be2'.
 */
function getRandomColor() {
    const letters = '0123456789abcdef';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// --- Event Handlers ---

function handleColorStopsChange(e) {
    // Update colors array when a color input changes
    if (e.target.classList.contains('color-input')) {
        const inputs = [...colorStopsContainer.querySelectorAll('.color-input')];
        const index = inputs.indexOf(e.target);
        colors[index] = e.target.value;
    }
    // Remove a color stop
    if (e.target.classList.contains('remove-color-btn')) {
        const inputs = [...colorStopsContainer.querySelectorAll('.color-input')];
        const parent = e.target.parentElement;
        const index = inputs.indexOf(parent.querySelector('.color-input'));
        
        // Don't allow removing the last two colors
        if (colors.length > 2) {
            colors.splice(index, 1);
            renderColorStops();
        }
    }
    generateGradient();
}

function handleAddColor() {
    if (colors.length < 10) { // Limit to 10 colors
        colors.push(getRandomColor());
        renderColorStops();
        generateGradient();
    }
}

function handleRandomize() {
    const numColors = colors.length;
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

// --- Event Listeners ---

angleInput.addEventListener('input', generateGradient);
gradientTypeRadios.forEach(radio => radio.addEventListener('change', generateGradient));
colorStopsContainer.addEventListener('input', handleColorStopsChange);
colorStopsContainer.addEventListener('click', handleColorStopsChange);
addColorBtn.addEventListener('click', handleAddColor);
randomBtn.addEventListener('click', handleRandomize);
copyBtn.addEventListener('click', copyToClipboard);

// --- Initial Call ---
document.addEventListener('DOMContentLoaded', () => {
    renderColorStops();
    generateGradient();
});
