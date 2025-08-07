// owner-sort.js
// Owner-specific sort and delete utilities kept separate from coworker search/filter code.

const ownerData = (typeof window !== "undefined" && Array.isArray(window.ownerProperties))
  ? window.ownerProperties
  : (typeof window !== "undefined" && Array.isArray(window.dummyDatabase))
    ? window.dummyDatabase
    : [];

function ownerRenderProperties(data) {
  const listContainer = document.getElementById("ownerPropertyList") || document.getElementById("propertyList");
  if (!listContainer) return;
  listContainer.innerHTML = "";
  data.forEach((property, index) => {
    const li = document.createElement("li");
    const name = property.name || property.propertyName || property.address || "Property";
    const location = property.location || property.neighborhood || "";
    const price = property.price != null ? property.price : (property.squareFootage || property.squareFeet || "");
    li.innerHTML = `${name} - ${location} ${price !== "" ? "- " + price : ""}
      <button type="button" onclick="ownerDeleteProperty(${index})">Delete</button>`;
    listContainer.appendChild(li);
  });
}

function ownerDeleteProperty(index) {
  if (index >= 0 && index < ownerData.length) {
    ownerData.splice(index, 1);
    ownerRenderProperties(ownerData);
  }
}

function ownerSortProperties(criteria) {
  ownerData.sort((a, b) => {
    const mapKey = (item) => {
      switch (criteria) {
        case "location":
          return (item.location || item.neighborhood || "").toString();
        case "price":
          return Number(item.price || 0);
        case "squareFeet":
        case "squareFootage":
          return Number(item.squareFeet || item.squareFootage || 0);
        default:
          return (typeof item[criteria] === "string")
            ? item[criteria]
            : Number(item[criteria] || 0);
      }
    };
    const av = mapKey(a);
    const bv = mapKey(b);
    if (typeof av === "string" || typeof bv === "string") {
      return String(av).localeCompare(String(bv));
    }
    return av - bv;
  });
  ownerRenderProperties(ownerData);
}

document.addEventListener("DOMContentLoaded", () => {
  const sortSelect = document.getElementById("ownerSortBy") || document.getElementById("sortBy");
  if (sortSelect) {
    sortSelect.addEventListener("change", function () {
      ownerSortProperties(this.value);
    });
  }
  const listContainer = document.getElementById("ownerPropertyList") || document.getElementById("propertyList");
  if (listContainer) {
    ownerRenderProperties(ownerData);
  }
});
