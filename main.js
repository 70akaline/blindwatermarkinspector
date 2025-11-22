(() => {
    const fileInput = document.getElementById("file-input");
    const selectImageButton = document.getElementById("select-image");
    const viewer = document.getElementById("viewer");
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const modeLabel = document.getElementById("mode-label");
    const modeDropdown = document.getElementById("mode-dropdown");
    const prevButton = document.getElementById("prev-mode");
    const nextButton = document.getElementById("next-mode");
    const aboutButton = document.getElementById("about-button");
    const aboutModal = document.getElementById("about-modal");
    const closeAbout = document.getElementById("close-about");

    const image = new Image();
    image.crossOrigin = "anonymous";

    let hasImage = false;
    let currentModeIndex = 0;
    let dropdownOpen = false;

    const modes = [
        { name: "original", label: "Original" },
        { name: "invert", label: "Invert Colors" },
        { name: "gray-bits", label: "Gray Bits" },
        { name: "random-map-1", label: "Random Color Map 1" },
        { name: "random-map-2", label: "Random Color Map 2" },
        { name: "full-red", label: "Full Red" },
        { name: "full-green", label: "Full Green" },
        { name: "full-blue", label: "Full Blue" },
        { name: "full-alpha", label: "Full Alpha" },
        { name: "red-plane-0", label: "Red Plane 0" },
        { name: "green-plane-0", label: "Green Plane 0" },
        { name: "blue-plane-0", label: "Blue Plane 0" },
        { name: "alpha-plane-0", label: "Alpha Plane 0" },
        { name: "red-plane-1", label: "Red Plane 1" },
        { name: "green-plane-1", label: "Green Plane 1" },
        { name: "blue-plane-1", label: "Blue Plane 1" },
        { name: "alpha-plane-1", label: "Alpha Plane 1" },
        { name: "red-plane-2", label: "Red Plane 2" },
        { name: "green-plane-2", label: "Green Plane 2" },
        { name: "blue-plane-2", label: "Blue Plane 2" },
        { name: "alpha-plane-2", label: "Alpha Plane 2" }
    ];

    const modeOptions = [];

    modes.forEach((mode, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "mode-option";
        button.textContent = `${index + 1}. ${mode.label}`;
        button.dataset.index = String(index);
        button.addEventListener("click", () => {
            currentModeIndex = index;
            applyCurrentMode();
            closeDropdown();
        });
        modeDropdown.appendChild(button);
        modeOptions.push(button);
    });

    function drawOriginal() {
        if (!hasImage) return;
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0);
    }

    function applyCurrentMode() {
        if (!hasImage) return;

        drawOriginal();
        const { name, label } = modes[currentModeIndex];
        modeLabel.textContent = `Mode: ${label}`;
        modeOptions.forEach((button, index) => {
            if (index === currentModeIndex) {
                button.classList.add("mode-option-active");
            } else {
                button.classList.remove("mode-option-active");
            }
        });

        if (name === "original") {
            return;
        }

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        switch (name) {
            case "invert":
                for (let i = 0; i < data.length; i += 4) {
                    data[i] = 255 - data[i];
                    data[i + 1] = 255 - data[i + 1];
                    data[i + 2] = 255 - data[i + 2];
                    data[i + 3] = 255;
                }
                break;
            case "gray-bits":
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];
                    const isGray = r === g && r === b;
                    const v = isGray ? 255 : 0;
                    data[i] = v;
                    data[i + 1] = v;
                    data[i + 2] = v;
                    data[i + 3] = 255;
                }
                break;
            case "random-map-1":
            case "random-map-2":
                applyRandomColorMap(data, name === "random-map-1" ? 1 : 2);
                break;
            case "full-red":
                for (let i = 0; i < data.length; i += 4) {
                    data[i + 1] = 0;
                    data[i + 2] = 0;
                    data[i + 3] = 255;
                }
                break;
            case "full-green":
                for (let i = 0; i < data.length; i += 4) {
                    data[i] = 0;
                    data[i + 2] = 0;
                    data[i + 3] = 255;
                }
                break;
            case "full-blue":
                for (let i = 0; i < data.length; i += 4) {
                    data[i] = 0;
                    data[i + 1] = 0;
                    data[i + 3] = 255;
                }
                break;
            case "full-alpha":
                for (let i = 0; i < data.length; i += 4) {
                    const a = data[i + 3];
                    data[i] = a;
                    data[i + 1] = a;
                    data[i + 2] = a;
                    data[i + 3] = 255;
                }
                break;
            case "red-plane-0":
                applyBitPlane(data, 0, 0);
                break;
            case "green-plane-0":
                applyBitPlane(data, 1, 0);
                break;
            case "blue-plane-0":
                applyBitPlane(data, 2, 0);
                break;
            case "alpha-plane-0":
                applyBitPlane(data, 3, 0);
                break;
            case "red-plane-1":
                applyBitPlane(data, 0, 1);
                break;
            case "green-plane-1":
                applyBitPlane(data, 1, 1);
                break;
            case "blue-plane-1":
                applyBitPlane(data, 2, 1);
                break;
            case "alpha-plane-1":
                applyBitPlane(data, 3, 1);
                break;
            case "red-plane-2":
                applyBitPlane(data, 0, 2);
                break;
            case "green-plane-2":
                applyBitPlane(data, 1, 2);
                break;
            case "blue-plane-2":
                applyBitPlane(data, 2, 2);
                break;
            case "alpha-plane-2":
                applyBitPlane(data, 3, 2);
                break;
        }

        ctx.putImageData(imageData, 0, 0);
    }

    function applyBitPlane(data, channelIndex, bitIndex) {
        const shift = bitIndex;
        for (let i = 0; i < data.length; i += 4) {
            const channel = data[i + channelIndex];
            const bit = (channel >> shift) & 1;
            const value = bit ? 255 : 0;
            data[i] = value;
            data[i + 1] = value;
            data[i + 2] = value;
            data[i + 3] = 255;
        }
    }

    function applyRandomColorMap(data, variant) {
        const seed = variant === 1 ? 12345 : 67891;
        const rand = seededRandom(seed);

        const rMul = 0.5 + rand() * 1.5;
        const gMul = 0.5 + rand() * 1.5;
        const bMul = 0.5 + rand() * 1.5;

        const rXor = (rand() * 255) | 0;
        const gXor = (rand() * 255) | 0;
        const bXor = (rand() * 255) | 0;

        for (let i = 0; i < data.length; i += 4) {
            let r = data[i];
            let g = data[i + 1];
            let b = data[i + 2];

            r = ((r * rMul) ^ rXor) & 0xff;
            g = ((g * gMul) ^ gXor) & 0xff;
            b = ((b * bMul) ^ bXor) & 0xff;

            data[i] = r;
            data[i + 1] = g;
            data[i + 2] = b;
            data[i + 3] = 255;
        }
    }

    function seededRandom(seed) {
        let state = seed >>> 0;
        return () => {
            state = (state * 1664525 + 1013904223) >>> 0;
            return state / 0xffffffff;
        };
    }

    function showViewer() {
        viewer.classList.remove("hidden");
    }

    function openDropdown() {
        if (!hasImage) return;
        modeDropdown.classList.remove("hidden");
        dropdownOpen = true;
    }

    function closeDropdown() {
        modeDropdown.classList.add("hidden");
        dropdownOpen = false;
    }

    function toggleDropdown() {
        if (!hasImage) return;
        if (dropdownOpen) {
            closeDropdown();
        } else {
            openDropdown();
        }
    }

    function nextMode() {
        if (!hasImage) return;
        currentModeIndex = (currentModeIndex + 1) % modes.length;
        applyCurrentMode();
    }

    function prevMode() {
        if (!hasImage) return;
        currentModeIndex = (currentModeIndex - 1 + modes.length) % modes.length;
        applyCurrentMode();
    }

    selectImageButton.addEventListener("click", () => {
        fileInput.value = "";
        fileInput.click();
    });

    modeLabel.addEventListener("click", (event) => {
        event.stopPropagation();
        toggleDropdown();
    });

    fileInput.addEventListener("change", (event) => {
        const file = event.target.files && event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target && e.target.result;
            if (!result || typeof result !== "string") return;
            image.src = result;
        };
        reader.readAsDataURL(file);
    });

    image.onload = () => {
        hasImage = true;
        currentModeIndex = 0;
        showViewer();
        applyCurrentMode();
    };

    nextButton.addEventListener("click", nextMode);
    prevButton.addEventListener("click", prevMode);

    document.addEventListener("keydown", (event) => {
        if (!hasImage) return;
        if (event.key === "ArrowLeft") {
            prevMode();
        } else if (event.key === "ArrowRight") {
            nextMode();
        } else if (event.key === "Escape" && dropdownOpen) {
            closeDropdown();
        }
    });

    document.addEventListener("click", (event) => {
        if (!dropdownOpen) return;
        const target = event.target;
        if (target !== modeLabel && !modeDropdown.contains(target)) {
            closeDropdown();
        }
    });

    aboutButton.addEventListener("click", () => {
        aboutModal.classList.remove("hidden");
    });

    closeAbout.addEventListener("click", () => {
        aboutModal.classList.add("hidden");
    });

    aboutModal.addEventListener("click", (event) => {
        if (event.target === aboutModal) {
            aboutModal.classList.add("hidden");
        }
    });
})();
