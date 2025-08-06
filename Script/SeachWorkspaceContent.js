$(() => {
  const $section = $(`
    <section id="workspaceSearchSection">
        
        <div id="searchContainer" >
            <h2>Find Your Workspace</h2>
            <p>Browse and book available workspaces near you. Use the filters below to find exactly what you need—by price, capacity, smoking policy, and more.</p>
            <div id="searchLocationContainer">
                <div id="searchLocationInput">
                    <span id="searchIcon">🔎︎</span>
                    <input type="text" id="searchLocation" placeholder="Search by city or address..." >
                </div>
                <button id="filterBtn">Filter</button>
            </div>
        </div>
        <div id="filtersContainer">
            <input type="text" id="searchName" placeholder="Search by by name" >

            <label>Price Max</label>
                <div class="priceRange">
                    <input type="number" id="minPrice" placeholder="Min">
                    <span>–</span>
                    <input type="number" id="maxPrice" placeholder="Max">
                </div>

            <label>Seats</label>
            <div id="seatsContainer">
                <button class="minBtn">-</button>
                <input type="number" id="filterSeats" value="0">
                <button class="plusBtn">+</button>
            </div>

            <label>Smoking Allowed</label>
            <select id="filterSmoking">
                <option value="">Any</option>
                <option value="Yes">Smoking</option>
                <option value="No">Non-Smoking</option>
            </select>

            <label>Parking</label>
            <select id="filterParking">
                <option value="">Any</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
            </select>

            <label>Transit</label>
            <select id="filterTransit">
                <option value="">Any</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
            </select>

            <label>Sqft</label>
            <div class="SqftRange">
                <input type="number" id="minSqft" placeholder="Min">
                <span>–</span>
                <input type="number" id="maxSqft" placeholder="Max">
            </div>

            <label>Lease Term</label>
            <select id="filterLease">
                <option value="">Any</option>
                <option value="Per Day">Per Day</option>
                <option value="Per Week">Per Week</option>
                <option value="Per Month">Per Month</option>
            </select>

            <button id="applyFilters">Apply Filters</button>
        </div>

        <div id="workspaceList"></div>
        </section>
  `);

  $('body').append($section);
});