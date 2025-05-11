document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("pokemonInput");
  const searchBtn = document.getElementById("searchBtn");
  const randomBtn = document.getElementById("randomBtn");
  const pokemonContainers = {
    pokemon1: document.getElementById("pokemon1").querySelector(".pokemon-card"),
    pokemon2: document.getElementById("pokemon2").querySelector(".pokemon-card"),
    pokemon3: document.getElementById("pokemon3").querySelector(".pokemon-card")
  };

  // Type color definitions
  const typeColors = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC'
  };

  // Helper function to display Pokémon data
  const displayPokemon = (data, container) => {
    const pokemonName = data.name;
    const sprite = data.sprites.versions['generation-v']['black-white'].animated.front_default || 
                  data.sprites.other.showdown.front_default ||
                  data.sprites.other["official-artwork"].front_default || 
                  data.sprites.front_default;
    const types = data.types.map(t => t.type.name);
    const id = data.id.toString().padStart(3, '0');

    // Set background based on type
    const primaryType = types[0];
    container.style.backgroundColor = typeColors[primaryType] || '#777';
    
    // Gradient if dual-type
    if (types.length > 1) {
      const secondaryType = types[1];
      container.style.background = `linear-gradient(135deg, ${typeColors[primaryType] || '#777'} 50%, ${typeColors[secondaryType] || '#777'} 50%)`;
    }

    container.innerHTML = `
      <img src="${sprite}" alt="${pokemonName}" />
      <h2>#${id} ${pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)}</h2>
      <p><strong>Type:</strong> ${types.join(", ")}</p>
      <p><strong>Height:</strong> ${data.height / 10}m</p>
      <p><strong>Weight:</strong> ${data.weight / 10}kg</p>
    `;
  };

  // Rest of your existing code remains the same...
  const clearContainers = () => {
    Object.values(pokemonContainers).forEach(container => {
      container.innerHTML = "";
      container.style.background = ""; // Reset background
    });
  };

  const handleError = (container) => {
    container.innerHTML = "<p>Pokémon not found</p>";
    container.style.background = ""; // Reset background
  };

  // Search for single Pokémon (middle container)
  searchBtn.addEventListener("click", async () => {
    const name = input.value.toLowerCase().trim();
    if (!name) {
      alert("Please enter a Pokémon name or ID");
      return;
    }

    try {
      clearContainers();
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      if (!response.ok) throw new Error("Not Found");
      const data = await response.json();
      displayPokemon(data, pokemonContainers.pokemon2);
    } catch (error) {
      handleError(pokemonContainers.pokemon2);
    }
  });

  // Generate random team (all containers)
  randomBtn.addEventListener("click", async () => {
    clearContainers();
    const randomIds = Array.from({length: 3}, () => Math.floor(Math.random() * 898) + 1);

    try {
      const promises = randomIds.map(id => 
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
          .then(response => response.json())
      );
      
      const pokemonData = await Promise.all(promises);
      
      // Display each Pokémon in its respective container
      pokemonData.forEach((data, index) => {
        const containerKey = `pokemon${index + 1}`;
        displayPokemon(data, pokemonContainers[containerKey]);
      });
    } catch (error) {
      Object.values(pokemonContainers).forEach(container => {
        handleError(container);
      });
    }
  });

  // Optional: Allow Enter key to trigger search
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchBtn.click();
    }
  });
});
