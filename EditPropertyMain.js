//JavaScript for Editing Properties

// Display current year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// Get references to the file input and preview container
const photoInput = document.getElementById('photo-input');
const photoPreview = document.getElementById('photo-preview');

// Add an event listener to detect when files are selected
photoInput.addEventListener('change', () => {
  // Clear any existing preview content
  photoPreview.innerHTML = "";

  // Loop through selected files
  Array.from(photoInput.files).forEach(file => {
    const reader = new FileReader();

    // When file reading is complete, create an image element
    reader.onload = function(e) {
      const img = document.createElement("img");
      img.src = e.target.result; // Set image source 
      photoPreview.appendChild(img); // Add image to preview container
    };

    // Read the file as a Data URL
    reader.readAsDataURL(file);
  });
});

