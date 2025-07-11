
// Header scroll effect
window.addEventListener('scroll', function () {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Star rating functionality
const stars = document.querySelectorAll('.star');
const ratingInput = document.getElementById('rating-value');

stars.forEach(star => {
    star.addEventListener('click', function () {
        const rating = this.getAttribute('data-rating');
        ratingInput.value = rating;

        stars.forEach((s, index) => {
            if (index < rating) {
                s.classList.add('active');
            } else {
                s.classList.remove('active');
            }
        });
    });

    star.addEventListener('mouseover', function () {
        const rating = this.getAttribute('data-rating');

        stars.forEach((s, index) => {
            if (index < rating) {
                s.style.color = '#ffd700';
            }
        });
    });

    star.addEventListener('mouseout', function () {
        const currentRating = ratingInput.value;

        stars.forEach((s, index) => {
            if (index >= currentRating) {
                s.style.color = 'var(--gray)';
            }
        });
    });
});

// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Demo palette generation (simplified)
document.querySelector('.btn-primary').addEventListener('click', function () {
    const swatches = document.querySelectorAll('.color-swatch');
    const colors = [
        '#4361ee', '#f72585', '#4cc9f0', '#14213d', '#8d99ae',
        '#3a0ca3', '#7209b7', '#480ca8', '#560bad', '#b5179e',
        '#4895ef', '#4cc9f0', '#4361ee', '#3f37c9', '#4895ef'
    ];

    swatches.forEach(swatch => {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        swatch.style.backgroundColor = randomColor;
        swatch.setAttribute('data-color', randomColor);
    });

    // Simple animation
    this.innerHTML = '<i class="fas fa-check"></i> Generated!';
    setTimeout(() => {
        this.innerHTML = '<i class="fas fa-palette"></i> Generate Again';
    }, 1500);
});

// Copy CSS functionality
document.querySelectorAll('.demo-btn')[0].addEventListener('click', function () {
    const swatches = document.querySelectorAll('.color-swatch');
    let cssCode = ':root {\n';

    swatches.forEach((swatch, index) => {
        const color = swatch.getAttribute('data-color') ||
            getComputedStyle(swatch).backgroundColor;
        cssCode += `    --color-${index + 1}: ${color};\n`;
    });

    cssCode += '}';

    navigator.clipboard.writeText(cssCode).then(() => {
        this.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
            this.innerHTML = '<i class="fas fa-copy"></i> Copy CSS';
        }, 1500);
    });
});