const apiURL = 'https://rickandmortyapi.com/api/character';
        const cardContainer = document.getElementById('cardContainer');
        const select = document.getElementById('characterSelect');
        let allCharacters = []; 
        let currentDiplayedCharacters =[];

        async function fetchAllCharacters() {
            try {
                let allResults = [];
                let nextPageURL = apiURL;

                while (nextPageURL) {
                    const res = await fetch(nextPageURL);
                    const data = await res.json();
                    allResults = allResults.concat(data.results);
                    nextPageURL = data.info.next;
                }
                allCharacters = allResults;
                displayRandomCharacters(16);
            } catch (err) {
                console.error('Error al obtener todos los datos:', err);
            }
        }

        function getRandomCharacters(arr, n) {
            const result = new Array(n);
            let len = arr.length;
            const taken = new Array(len);
            if (n > len)
                throw new RangeError("getRandom: more elements taken than available");
            while (n--) {
                const x = Math.floor(Math.random() * len);
                result[n] = arr[x in taken ? taken[x] : x];
                taken[x] = --len in taken ? taken[len] : len;
            }
            return result;
        }

        function displayRandomCharacters(count) {
            currentDiplayedCharacters = getRandomCharacters(allCharacters, count);
            renderCards(currentDiplayedCharacters);
            fillSelect(currentDiplayedCharacters);
        }

        function renderCards(data) {
            cardContainer.innerHTML = '';
            data.forEach(character => {
                let statusClass = '';
                if (character.status === 'Alive') {
                    statusClass = 'status-alive';
                } else if (character.status === 'Dead') {
                    statusClass = 'status-dead';
                } else {
                    statusClass = 'status-unknown';
                }

                const col = document.createElement('div');
                col.className = 'col-12 col-sm-6 col-lg-3';
                col.innerHTML = `
                    <div class="card h-100">
                        <img src="${character.image}" class="card-img-top" alt="${character.name}">
                        <div class="card-body">
                            <h5 class="card-title">${character.name}</h5>
                            <p class="card-text card-info-item">
                                <span class="card-info-label">Status:</span>
                                <span class="status-icon ${statusClass}"></span>
                                <span class="${statusClass}">${character.status}</span>
                            </p>
                            <p class="card-text card-info-item"><span class="card-info-label">Species:</span> ${character.species}</p>
                            <p class="card-text card-info-item"><span class="card-info-label">Gender:</span> ${character.gender}</p>
                            <p class="card-text card-info-item"><span class="card-info-label">Origin:</span> ${character.origin.name}</p>
                            <p class="card-text card-info-item"><span class="card-info-label">Last Location:</span> ${character.location.name}</p>
                        </div>
                    </div>
                `;
                cardContainer.appendChild(col);
            });
        }

        function fillSelect(data) {
            select.innerHTML = '<option value="all">Mostrar todos</option>';
            data.forEach(char => {
                const option = document.createElement('option');
                option.value = char.id;
                option.textContent = char.name;
                select.appendChild(option);
            });
        }

        select.addEventListener('change', () => {
            const selected = select.value;
            if (selected === 'all') {
                renderCards(currentDiplayedCharacters); 
            } else {
                const filtered = allCharacters.filter(c => c.id == selected);
                renderCards(filtered);
            }
        });

        
        fetchAllCharacters();

    
