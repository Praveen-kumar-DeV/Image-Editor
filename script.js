// Write your javascript here
const fileInput = document.getElementById("file-input");
const sliderName = document.querySelector(".name");
const sliderValue = document.querySelector(".value");
const sliderInputValue = document.querySelector(".seek-bar");

const filterButtonColor = document.querySelectorAll(".btn-filter");
const image = document.getElementById("img-preview");
const editorPanel = document.querySelector(".editor-panel");
const resetFilterButton = document.querySelector(".reset-filter");
const saveImageButton = document.querySelector(".save-img");
const container = document.querySelector(".container");

const filterValues = {
  Saturation: 100,
  Brightness: 100,
  Grayscale: 0,
  Inversion: 0,
};

let filterType = "Saturation";

let transformValues = {
  rotate: 0,
  flipX: 1,
  flipY: 1,
};

let transformType = "rotation";

function chooseImage() {
  fileInput.click();
}

fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      image.src = e.target.result;

      // Enable the editor by removing the disable class
      editorPanel.classList.remove("disable");
      resetFilterButton.classList.remove("disable");
      saveImageButton.classList.remove("disable");
      container.classList.remove("disable");
    };

    reader.readAsDataURL(file);
  }
  console.log(event.target.files);
});

function filterButton(event) {
  filterType = event.target.name;
  filterButtonColor.forEach((button) => {
    button.style.backgroundColor = "white";
  }); // Reset all button colors
  event.target.style.backgroundColor = "#5773ca";
  sliderName.textContent = filterType;

  if (filterType === "Grayscale" || filterType === "Inversion") {
    sliderInputValue.max = 100;
  } else {
    sliderInputValue.max = 200;
  }

  sliderInputValue.value = filterValues[filterType];
  sliderValue.textContent = `${filterValues[filterType]}%`;
}

sliderInputValue.addEventListener("input", () => {
  sliderValue.textContent = `${sliderInputValue.value}%`;
  filterValues[filterType] = parseInt(sliderInputValue.value);
  updateFilters();
});

// Update the filters on the image
function updateFilters() {
  image.style.filter = `
      saturate(${filterValues.Saturation}%)
      brightness(${filterValues.Brightness}%)
      grayscale(${filterValues.Grayscale}%)
      invert(${filterValues.Inversion}%)
  `;
}

function rotateButton(event) {
  transformType = event.target.name;
  switch (transformType) {
    case "left":
      transformValues.rotate -= 90;
      break;

    case "right":
      transformValues.rotate += 90;
      break;
    case "horizontal":
      transformValues.flipX = transformValues.flipX === 1 ? -1 : 1;
      break;
    case "vertical":
      transformValues.flipY = transformValues.flipY === 1 ? -1 : 1;
      break;
  }

  updateTransfrom();
}
function updateTransfrom() {
  image.style.transform = `
  rotate(${transformValues.rotate}deg)
  scaleX(${transformValues.flipX}) 
  scaleY(${transformValues.flipY})
`;
}

// Reset Function
function resetChanges() {
  filterValues.Saturation = 100;
  filterValues.Brightness = 100;
  filterValues.Grayscale = 0;
  filterValues.Inversion = 0;
  sliderInputValue.value = filterValues[filterType];
  sliderValue.textContent = `${filterValues[filterType]} %`;
  updateFilters();
  transformValues.rotate = 0;
  transformValues.flipX = 1;
  transformValues.flipY = 1;
  updateTransfrom();
}

// to download image
function downloadImage() {
  // Create a canvas element
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // Set canvas dimensions to match the image
  canvas.width = image.width;
  canvas.height = image.height;

  // Apply filters
  ctx.filter = `
      saturate(${filterValues.Saturation}%)
      brightness(${filterValues.Brightness}%)
      grayscale(${filterValues.Grayscale}%)
      invert(${filterValues.Inversion}%)
  `;

  // Apply transformations
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((transformValues.rotate * Math.PI) / 180);
  ctx.scale(transformValues.flipX, transformValues.flipY);
  ctx.translate(-canvas.width / 2, -canvas.height / 2);

  // Draw the image onto the canvas
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  // Convert canvas to data URL
  const dataURL = canvas.toDataURL("image/png");

  // Create a downloadable link
  const link = document.createElement("a");
  link.download = "edited-image.png"; // Set file name
  link.href = dataURL;
  link.click(); // Trigger download
}
