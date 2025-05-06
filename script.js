class BinarySearchVisualizer {
    constructor() {
        this.array = [];
        this.left = null;
        this.right = null;
        this.mid = null;
        this.found = false;
        this.searching = false;
        this.searchComplete = false;
        this.stepCount = 0;
        this.comparisonCount = 0;

        this.initializeElements();
        this.initializeEventListeners();
        this.generateArray();
    }

    initializeElements() {
        this.arrayContainer = document.getElementById('arrayContainer');
        this.stepCountElement = document.getElementById('stepCount');
        this.comparisonCountElement = document.getElementById('comparisonCount');
        this.resultElement = document.getElementById('result');
        this.arraySizeInput = document.getElementById('arraySize');
        this.arraySizeValue = document.getElementById('arraySizeValue');
        this.explanationContainer = document.getElementById('explanationContainer');
    }

    initializeEventListeners() {
        document.getElementById('newArrayBtn').addEventListener('click', () => this.generateArray());
        document.getElementById('stepBtn').addEventListener('click', () => this.searchStep());
        document.getElementById('completeBtn').addEventListener('click', () => this.completeSearch());
        
        this.arraySizeInput.addEventListener('input', (e) => {
            this.arraySizeValue.textContent = e.target.value;
            if (!this.searching) this.generateArray();
        });
    }

    addExplanation(explanation) {
        const explanationElement = document.createElement('div');
        explanationElement.className = 'p-4 bg-gray-700 rounded-lg text-sm text-gray-200';
        explanationElement.innerHTML = explanation;
        this.explanationContainer.insertBefore(explanationElement, this.explanationContainer.firstChild);
    }

    generateArray() {
        const size = parseInt(this.arraySizeInput.value);
        this.array = Array.from({ length: size }, () => 
            Math.floor(Math.random() * 100)
        ).sort((a, b) => a - b);
        this.resetSearch();
        this.render();
    }

    resetSearch() {
        this.left = null;
        this.right = null;
        this.mid = null;
        this.found = false;
        this.searching = false;
        this.searchComplete = false;
        this.stepCount = 0;
        this.comparisonCount = 0;
        this.explanationContainer.innerHTML = '';
        this.resultElement.textContent = ''; // Fixed: Clear result text
        this.updateStatus();
    }

    searchStep() {
        const targetValue = parseInt(document.getElementById('targetValue').value);

        if (!this.searching) {
            this.searching = true;
            this.left = 0;
            this.right = this.array.length - 1;
            this.stepCount++; // Fixed: Increment step count here
            this.addExplanation(`
                <strong>Step ${this.stepCount}:</strong> Starting binary search<br>
                • Search range initialized from index 0 to ${this.array.length - 1}<br>
                • Looking for value: ${targetValue}
            `);
            this.render();
            return;
        }

        if (this.left <= this.right && !this.searchComplete) {
            this.stepCount++; // Fixed: Increment before using in explanation
            this.mid = Math.floor((this.left + this.right) / 2);
            this.comparisonCount++;

            let explanation = `<strong>Step ${this.stepCount}:</strong><br>`;
            explanation += `• Middle element at index ${this.mid} is ${this.array[this.mid]}<br>`;
            explanation += `• Target value is ${targetValue}<br>`;

            if (this.array[this.mid] === targetValue) {
                this.found = true;
                this.searchComplete = true;
                explanation += `• Found the target value!`;
                this.resultElement.textContent = `Found ${targetValue} at index ${this.mid}!`;
            } else if (this.array[this.mid] < targetValue) {
                this.left = this.mid + 1;
                explanation += `• ${this.array[this.mid]} is less than ${targetValue}<br>`;
                explanation += `• Eliminating all elements from index 0 to ${this.mid} (too small)`;
            } else {
                this.right = this.mid - 1;
                explanation += `• ${this.array[this.mid]} is greater than ${targetValue}<br>`;
                explanation += `• Eliminating all elements from index ${this.mid} to ${this.array.length - 1} (too large)`;
            }

            if (this.left > this.right && !this.found) {
                this.searchComplete = true;
                explanation += `<br>• Search complete: Value ${targetValue} not found in the array!`;
                this.resultElement.textContent = `${targetValue} not found in the array !`;
            }

            this.addExplanation(explanation);
            this.updateStatus();
            this.render();
        }
    }

    completeSearch() {
        while (!this.searchComplete && (this.left === null || this.left <= this.right)) {
            this.searchStep();
        }
    }

    updateStatus() {
        this.stepCountElement.textContent = this.stepCount;
        this.comparisonCountElement.textContent = this.comparisonCount;
    }

    getElementClasses(index, value) {
        let classes = "px-4 py-3 rounded-lg font-medium transition-all duration-300 transform ";

        if (index === this.mid && this.found) {
            return classes + "bg-green-500 text-white scale-110 animate-pulse-fast";
        }
        if (index === this.mid) {
            return classes + "bg-yellow-500 text-white scale-110 animate-pulse-fast";
        }
        if (this.left !== null && this.right !== null) {
            if (index < this.left || index > this.right) {
                return classes + "bg-red-500 text-white scale-90";
            }
            return classes + "bg-blue-500 text-white";
        }
        return classes + "bg-blue-500 text-white";
    }

    render() {
        this.arrayContainer.innerHTML = '';
        this.array.forEach((num, idx) => {
            const element = document.createElement('div');
            element.className = this.getElementClasses(idx, num);
            element.textContent = num;
            this.arrayContainer.appendChild(element);
        });
    }
}

// Full-screen functionality and toggle button
const fullscreenBtn = document.getElementById('fullscreenBtn');
const fullscreenIcon = document.getElementById('fullscreenIcon');
const exitFullscreenIcon = document.getElementById('exitFullscreenIcon');
const container = fullscreenBtn.closest('.bg-gray-800');

fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        // Request full screen
        if (container.requestFullscreen) {
            container.requestFullscreen();
        } else if (container.mozRequestFullScreen) { // Firefox
            container.mozRequestFullScreen();
        } else if (container.webkitRequestFullscreen) { // Chrome, Safari and Opera
            container.webkitRequestFullscreen();
        } else if (container.msRequestFullscreen) { // IE/Edge
            container.msRequestFullscreen();
        }
        // Change icon to cross (exit full screen)
        fullscreenIcon.classList.add('hidden');
        exitFullscreenIcon.classList.remove('hidden');
    } else {
        // Exit full screen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { // Firefox
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // IE/Edge
            document.msExitFullscreen();
        }
        // Change icon back to full screen
        fullscreenIcon.classList.remove('hidden');
        exitFullscreenIcon.classList.add('hidden');
    }
});


// Initialize when the page loads
window.addEventListener('DOMContentLoaded', () => {
    new BinarySearchVisualizer();
});