document.addEventListener('DOMContentLoaded', function () {
    // Const Elements
    const paletteContainer = document.getElementById('palette-container');
    const generateBtn = document.getElementById('generate-btn');
    const savePaletteBtn = document.getElementById('save-palette');
    const savedPalettesContainer = document.getElementById('saved-palettes-container');
    const clearAllBtn = document.getElementById('clear-all-btn');
    const colorCountSlider = document.getElementById('color-count-slider');
    const colorCountValue = document.getElementById('color-count-value');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');

    // State vars
    let currentPalette = [];
    let colorCount = parseInt(colorCountSlider.value);
    let savedPalettes = JSON.parse(localStorage.getItem('savedPalettes')) || [];

    // Function to... initialise
    updateColorCountDisplay();
    generateRandomPalette();
    renderSavedPalettes();

    // Listeners
    colorCountSlider.addEventListener('input', function () {
        colorCount = parseInt(this.value);
        updateColorCountDisplay();
    });

    generateBtn.addEventListener('click', generatePalette);
    savePaletteBtn.addEventListener('click', saveCurrentPalette);
    clearAllBtn.addEventListener('click', clearAllSavedPalettes);

    // Keyboard shortcuts
    document.addEventListener('keydown', function (e) {
        // Space bar for new palette
        if (e.code === 'Space' && e.target === document.body) {
            e.preventDefault();
            generateBtn.click();
        }

        // 'S' key to save palette
        if (e.code === 'KeyS' && e.target === document.body) {
            e.preventDefault();
            savePaletteBtn.click();
        }
    });

    // Functions
    function updateColorCountDisplay() {
        colorCountValue.textContent = colorCount;
    }

    function generatePalette() {
        const schemeType = document.querySelector('input[name="scheme"]:checked').value;

        switch (schemeType) {
            case "random":
                generateRandomPalette();
                break;
            case "monochrome":
                generateMonochromePalette();
                break;
            case "analogous":
                generateAnalogousPalette();
                break;
            case "complementary":
                generateComplementaryPalette();
                break;
            case "triadic":
                generateTriadicPalette();
                break;
            case "tetradic":
                generateTetradicPalette();
                break;
            default:
                generateRandomPalette();
        }
    }

    function generateRandomPalette() {
        currentPalette = [];
        paletteContainer.innerHTML = '';

        for (let i = 0; i < colorCount; i++) {
            const color = getRandomHexColor();
            currentPalette.push(color);
            createColorBox(color, i);
        }
    }

    function generateMonochromePalette() {
        currentPalette = [];
        paletteContainer.innerHTML = '';

        const hue = Math.floor(Math.random() * 360);
        const saturation = 65 + Math.floor(Math.random() * 35);
        const lightnessStep = 70 / (colorCount - 1);

        for (let i = 0; i < colorCount; i++) {
            const lightness = 15 + (i * lightnessStep);
            const color = hslToHex(hue, saturation, lightness);
            currentPalette.push(color);
            createColorBox(color, i);
        }
    }

    function generateAnalogousPalette() {
        currentPalette = [];
        paletteContainer.innerHTML = '';

        const baseHue = Math.floor(Math.random() * 360);
        const saturation = 70 + Math.floor(Math.random() * 30);
        const lightness = 50 + Math.floor(Math.random() * 20);

        for (let i = 0; i < colorCount; i++) {
            const hueShift = (i - Math.floor(colorCount / 2)) * 15;
            const hue = (baseHue + hueShift + 360) % 360;
            const color = hslToHex(hue, saturation, lightness);
            currentPalette.push(color);
            createColorBox(color, i);
        }
    }

    function generateComplementaryPalette() {
        currentPalette = [];
        paletteContainer.innerHTML = '';

        const baseHue = Math.floor(Math.random() * 360);
        const saturation = 70 + Math.floor(Math.random() * 30);
        const lightness = 50 + Math.floor(Math.random() * 20);

        // Base color
        const baseColor = hslToHex(baseHue, saturation, lightness);
        currentPalette.push(baseColor);
        createColorBox(baseColor, 0);

        // Complementary color
        const compHue = (baseHue + 180) % 360;
        const compColor = hslToHex(compHue, saturation, lightness);
        currentPalette.push(compColor);
        createColorBox(compColor, 1);

        // Additional shades if more than 2 colors
        for (let i = 2; i < colorCount; i++) {
            const isBaseColor = i % 2 === 0;
            const currentHue = isBaseColor ? baseHue : compHue;
            const lightnessVar = lightness + (isBaseColor ? i * 5 : -i * 5);
            const color = hslToHex(currentHue, saturation, Math.max(10, Math.min(90, lightnessVar)));
            currentPalette.push(color);
            createColorBox(color, i);
        }
    }

    function generateTriadicPalette() {
        currentPalette = [];
        paletteContainer.innerHTML = '';

        const baseHue = Math.floor(Math.random() * 360);
        const saturation = 70 + Math.floor(Math.random() * 30);
        const lightness = 50 + Math.floor(Math.random() * 20);

        // Base color
        const baseColor = hslToHex(baseHue, saturation, lightness);
        currentPalette.push(baseColor);
        createColorBox(baseColor, 0);

        // Triadic colors
        const triadic1 = hslToHex((baseHue + 120) % 360, saturation, lightness);
        const triadic2 = hslToHex((baseHue + 240) % 360, saturation, lightness);

        if (colorCount >= 2) {
            currentPalette.push(triadic1);
            createColorBox(triadic1, 1);
        }

        if (colorCount >= 3) {
            currentPalette.push(triadic2);
            createColorBox(triadic2, 2);
        }

        // Additional shades if more than 3 colors
        for (let i = 3; i < colorCount; i++) {
            const colorGroup = i % 3;
            let currentHue;

            if (colorGroup === 0) currentHue = baseHue;
            else if (colorGroup === 1) currentHue = (baseHue + 120) % 360;
            else currentHue = (baseHue + 240) % 360;

            const lightnessVar = lightness + (i % 2 === 0 ? 10 : -10);
            const color = hslToHex(currentHue, saturation, Math.max(10, Math.min(90, lightnessVar)));
            currentPalette.push(color);
            createColorBox(color, i);
        }
    }

    function generateTetradicPalette() {
        currentPalette = [];
        paletteContainer.innerHTML = '';

        const baseHue = Math.floor(Math.random() * 360);
        const saturation = 70 + Math.floor(Math.random() * 30);
        const lightness = 50 + Math.floor(Math.random() * 20);

        // Base color
        const baseColor = hslToHex(baseHue, saturation, lightness);
        currentPalette.push(baseColor);
        createColorBox(baseColor, 0);

        // Tetradic colors
        const tetradic1 = hslToHex((baseHue + 90) % 360, saturation, lightness);
        const tetradic2 = hslToHex((baseHue + 180) % 360, saturation, lightness);
        const tetradic3 = hslToHex((baseHue + 270) % 360, saturation, lightness);

        if (colorCount >= 2) {
            currentPalette.push(tetradic1);
            createColorBox(tetradic1, 1);
        }

        if (colorCount >= 3) {
            currentPalette.push(tetradic2);
            createColorBox(tetradic2, 2);
        }

        if (colorCount >= 4) {
            currentPalette.push(tetradic3);
            createColorBox(tetradic3, 3);
        }

        // Additional shades if more than 4 colors
        for (let i = 4; i < colorCount; i++) {
            const colorGroup = i % 4;
            let currentHue;

            if (colorGroup === 0) currentHue = baseHue;
            else if (colorGroup === 1) currentHue = (baseHue + 90) % 360;
            else if (colorGroup === 2) currentHue = (baseHue + 180) % 360;
            else currentHue = (baseHue + 270) % 360;

            const lightnessVar = lightness + (i % 2 === 0 ? 10 : -10);
            const color = hslToHex(currentHue, saturation, Math.max(10, Math.min(90, lightnessVar)));
            currentPalette.push(color);
            createColorBox(color, i);
        }
    }

    function createColorBox(hexColor, index) {
        const box = document.createElement('div');
        box.className = 'color-box';
        box.style.backgroundColor = hexColor;

        const colorName = getColorName(hexColor);
        const textColor = getContrastColor(hexColor);

        const info = document.createElement('div');
        info.className = 'color-info';

        const nameEl = document.createElement('div');
        nameEl.className = 'color-name';
        nameEl.textContent = colorName;
        nameEl.style.color = textColor;

        const codeEl = document.createElement('div');
        codeEl.className = 'color-code';
        codeEl.textContent = hexColor;
        codeEl.style.color = textColor;

        const actions = document.createElement('div');
        actions.className = 'color-actions';

        const copyBtn = document.createElement('button');
        copyBtn.className = 'color-action';
        copyBtn.textContent = 'Copy';
        copyBtn.style.color = textColor;
        copyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            copyToClipboard(hexColor);
            showToast('Color copied to clipboard!');
        });

        const rgbBtn = document.createElement('button');
        rgbBtn.className = 'color-action';
        rgbBtn.textContent = 'RGB';
        rgbBtn.style.color = textColor;
        rgbBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const rgb = hexToRgb(hexColor);
            copyToClipboard(rgb);
            showToast('RGB value copied to clipboard!');
        });

        const copyMsg = document.createElement('div');
        copyMsg.className = 'copy-msg';
        copyMsg.textContent = 'Copied!';
        copyMsg.style.color = 'white';

        actions.appendChild(copyBtn);
        actions.appendChild(rgbBtn);

        info.appendChild(nameEl);
        info.appendChild(codeEl);
        info.appendChild(actions);
        box.appendChild(info);
        box.appendChild(copyMsg);

        box.addEventListener('click', function () {
            copyToClipboard(hexColor);
            copyMsg.classList.add('show');
            setTimeout(() => copyMsg.classList.remove('show'), 1000);
        });

        paletteContainer.appendChild(box);
    }

    function saveCurrentPalette() {
        if (currentPalette.length === 0) return;

        const paletteData = {
            colors: [...currentPalette],
            date: new Date().toISOString(),
            scheme: document.querySelector('input[name="scheme"]:checked').value
        };

        savedPalettes.unshift(paletteData);
        localStorage.setItem('savedPalettes', JSON.stringify(savedPalettes));
        renderSavedPalettes();
        showToast('Palette saved successfully!', 'success');
    }

    function renderSavedPalettes() {
        savedPalettesContainer.innerHTML = '';

        if (savedPalettes.length === 0) {
            savedPalettesContainer.innerHTML = `
                <div class="empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <p>No saved palettes yet. Generate and save your first palette!</p>
                </div>
            `;
            return;
        }

        savedPalettes.forEach((palette, index) => {
            const item = document.createElement('div');
            item.className = 'saved-palette-item';

            const miniPalette = document.createElement('div');
            miniPalette.className = 'mini-palette';

            palette.colors.forEach(color => {
                const miniColor = document.createElement('div');
                miniColor.className = 'mini-color';
                miniColor.style.backgroundColor = color;

                const colorCode = document.createElement('div');
                colorCode.className = 'mini-color-code';
                colorCode.textContent = color;

                miniColor.appendChild(colorCode);
                miniPalette.appendChild(miniColor);
            });

            const meta = document.createElement('div');
            meta.className = 'palette-meta';

            const date = new Date(palette.date);
            const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            const dateEl = document.createElement('div');
            dateEl.className = 'palette-date';
            dateEl.textContent = dateStr;

            const actions = document.createElement('div');
            actions.className = 'palette-actions';

            const loadBtn = document.createElement('button');
            loadBtn.className = 'palette-action';
            loadBtn.textContent = 'Load';
            loadBtn.addEventListener('click', () => {
                currentPalette = [...palette.colors];
                paletteContainer.innerHTML = '';
                palette.colors.forEach((color, i) => createColorBox(color, i));
                showToast('Palette loaded!');
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'palette-action delete';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteSavedPalette(index);
            });

            actions.appendChild(loadBtn);
            actions.appendChild(deleteBtn);

            meta.appendChild(dateEl);
            meta.appendChild(actions);

            item.appendChild(miniPalette);
            item.appendChild(meta);

            savedPalettesContainer.appendChild(item);
        });
    }

    function deleteSavedPalette(index) {
        savedPalettes.splice(index, 1);
        localStorage.setItem('savedPalettes', JSON.stringify(savedPalettes));
        renderSavedPalettes();
        showToast('Palette deleted', 'error');
    }

    function clearAllSavedPalettes() {
        if (savedPalettes.length === 0) return;

        if (confirm('Are you sure you want to delete all saved palettes?')) {
            savedPalettes = [];
            localStorage.removeItem('savedPalettes');
            renderSavedPalettes();
            showToast('All palettes deleted', 'error');
        }
    }

    function showToast(message, type = '') {
        toastMessage.textContent = message;
        toast.className = 'toast';
        toast.classList.add(type, 'show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Utility functions
    function getRandomHexColor() {
        return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    }

    function hslToHex(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;

        let r, g, b;

        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;

            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        const toHex = x => {
            const hex = Math.round(x * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };

        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    function hexToRgb(hex) {
        const r = parseInt(hex.substring(1, 3), 16);
        const g = parseInt(hex.substring(3, 5), 16);
        const b = parseInt(hex.substring(5, 7), 16);
        return `rgb(${r}, ${g}, ${b})`;
    }

    function getContrastColor(hexColor) {
        const r = parseInt(hexColor.substring(1, 3), 16);
        const g = parseInt(hexColor.substring(3, 5), 16);
        const b = parseInt(hexColor.substring(5, 7), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 128 ? '#000000' : '#ffffff';
    }

    function getColorName(hexColor) {
        // Simple color name mapping based on hue
        const hue = getHueFromHex(hexColor);

        if (hue < 15) return 'Red';
        if (hue < 45) return 'Orange';
        if (hue < 70) return 'Yellow';
        if (hue < 150) return 'Green';
        if (hue < 195) return 'Cyan';
        if (hue < 240) return 'Blue';
        if (hue < 270) return 'Purple';
        if (hue < 330) return 'Pink';
        return 'Red';
    }

    function getHueFromHex(hexColor) {
        const r = parseInt(hexColor.substring(1, 3), 16) / 255;
        const g = parseInt(hexColor.substring(3, 5), 16) / 255;
        const b = parseInt(hexColor.substring(5, 7), 16) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h;

        if (max === min) {
            h = 0;
        } else {
            const d = max - min;
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return Math.round(h * 360);
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).catch(err => {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        });
    }
});