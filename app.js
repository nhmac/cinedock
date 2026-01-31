// app.js
import { all_db as rawCollection } from './database.js';

// Verifica se a coleção existe para evitar erros
const myCollection = rawCollection ? Array.from(new Map(rawCollection.map(item => [item.id, item])).values()) : [];

const grid = document.getElementById("main-grid");
const searchInput = document.getElementById("internalSearch");
const sortSelect = document.getElementById("sortOrder");
const filterBtns = document.querySelectorAll(".dock-item");
const statsCounter = document.getElementById("stats-counter"); // Referência ao contador

const IMG_BASE = "https://image.tmdb.org/t/p/w400";
let currentFilter = "movie";
let currentSearch = "";
let currentSort = "alpha";

function render() {
  // 1. Filtrar
  let items = myCollection.filter(item => {
    const matchesFilter = item.type === currentFilter;
    const matchesSearch = item.title.toLowerCase().includes(currentSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // 2. Ordenar
  if (currentSort === "alpha") items.sort((a, b) => a.title.localeCompare(b.title));
  else if (currentSort === "yearDesc") items.sort((a, b) => b.year - a.year);
  else if (currentSort === "yearAsc") items.sort((a, b) => a.year - b.year);

  // 3. ATUALIZAR O CONTADOR (Esta é a parte que estava a falhar)
  const label = currentFilter === "movie" ? "movies" : "tv shows";
  if (statsCounter) {
    statsCounter.innerText = `${items.length} ${label} in the collection`;
  }

  // 4. Renderizar Grid
  if (items.length === 0) {
    grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: gray; padding: 40px;">No results found.</p>`;
    return;
  }

  grid.innerHTML = items.map(item => `
    <div class="poster-card">
      <img src="${item.poster ? IMG_BASE + item.poster : 'https://via.placeholder.com/400x600'}" alt="${item.title}" loading="lazy">
      <div class="overlay">
        <span>${item.year}</span>
        <h4>${item.title}</h4>
      </div>
    </div>
  `).join('');
}

// Eventos
filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    render();
  });
});

if (searchInput) {
  searchInput.addEventListener("input", e => { currentSearch = e.target.value; render(); });
}

if (sortSelect) {
  sortSelect.addEventListener("change", e => { currentSort = e.target.value; render(); });
}

// Iniciar
render();