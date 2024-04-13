let pagina = 1;
const displayCount = 6;
let characters = [];

async function getPersonagens() {
  try {
    console.log();
    const response = await axios.get(
      `https://rickandmortyapi.com/api/character/?page=${pagina}`
    );
    characters = response.data.results;
    atualizarLista();
  } catch (error) {
    console.error("Erro ao obter personagens:", error);
  }
}

getPersonagens();

async function atualizarLista() {
  const charactersExibidos = document.getElementById("characters");
  charactersExibidos.innerHTML = "";

  const startIndex = (pagina - 1) * displayCount;
  const endIndex = startIndex + displayCount;
  const charactersToDisplay = characters.slice(startIndex, endIndex);

  for (const personagem of charactersToDisplay) {
    const site = `${personagem.id}.html`;

    const cardPersonagem = `
      <div class="cardPersonagem d-flex flex-column mt-5 me-5 ms-5 align-items-center">
      <a href="${site}"><img class="imagemPersonagem mb-3" src="${personagem.image}"></a>
        <p class="nomeDoPersonagem align-self-start text-light ms-5">${personagem.name}</p>
        <div class="d-flex align-items-center">
          <div class=" ${personagem.status}"></div>
          <span>${personagem.status} - ${personagem.species}</span>
        </div>
        <p class="align-self-start ms-5">Última localização conhecida:</p>
        <p class="align-self-start nomeDoPersonagem text-light ms-5">${personagem.location.name}</p>
        <p class="align-self-start ms-5">Visto a última vez em:</p>
        <p class="align-self-start nomeDoPersonagem text-light ms-5" id="name-episode-${personagem.id}" class="text-light mx-5">${personagem.lastEpisode}</p> 
      </div>
    `;
    charactersExibidos.innerHTML += cardPersonagem;

    const ultimoEpisodioURL = personagem.episode[personagem.episode.length - 1];
    try {
      const episodioInfo = await axios.get(ultimoEpisodioURL);
      const ultimoEpisodioNome = episodioInfo.data.name;
      document.getElementById(`name-episode-${personagem.id}`).innerText =
        ultimoEpisodioNome;
    } catch (error) {
      console.error("Erro ao obter nome do episódio:", error);
    }
  }
}

function pesquisarPersonagens() {
  const searchInput = document
    .getElementById("searchInput")
    .value.toLowerCase();

  const charactersFiltrados = characters.filter((character) =>
    character.name.toLowerCase().includes(searchInput)
  );

  if (charactersFiltrados.length === 0) {
    window.location.href = "error.html";
  }

  const charactersExibidos = document.getElementById("characters");
  charactersExibidos.innerHTML = "";

  charactersFiltrados.forEach((personagem) => {
    const site = `${personagem.id}.html`;
    const cardPersonagem = `
    <div class="cardPersonagem d-flex flex-column mt-5 me-5 ms-5 align-items-center">
      <a href="${site}"><img class="imagemPersonagem mb-3" src="${personagem.image}"></a>
        <p class="nomeDoPersonagem align-self-start text-light ms-5">${personagem.name}</p>
        <div class="d-flex align-items-center">
          <div class=" ${personagem.status}"></div>
          <span>${personagem.status} - ${personagem.species}</span>
        </div>
        <p class="align-self-start ms-5">Última localização conhecida:</p>
        <p class="align-self-start nomeDoPersonagem text-light ms-5">${personagem.location.name}</p>
        <p class="align-self-start ms-5">Visto a última vez em:</p>
        <p class="align-self-start ms-5 nomeDoPersonagem text-light" id="name-episode-${personagem.id}" class="text-light mx-5">${personagem.lastEpisode}</p> 
      </div>
    `;
    charactersExibidos.innerHTML += cardPersonagem;

    document.getElementById("botoes").innerHTML = "";
    document.getElementById("botoes").innerHTML = `
    <div class="d-flex justify-content-center p-3">
    <button
    class="botao p-2"
    id="Voltar a Lista de Personagens"
    onclick="paginaPrincipal()"
  >
    Voltar a Lista de Personagens
  </button>
    </div>
    `;
  });
}

async function getInfo(path) {
  try {
    const response = await axios.get(`https://rickandmortyapi.com/api${path}`);
    return response.data.info.count;
  } catch (error) {
    console.error("Erro ao obter informações:", error);
    return 0;
  }
}

async function getRodaPeInfos() {
  try {
    const [totalPersonagens, totalLocalizacoes, totalEpisodios] =
      await Promise.all([
        getInfo("/character"),
        getInfo("/location"),
        getInfo("/episode"),
      ]);

    const footerContent = document.getElementById("rodaPeInfos");
    footerContent.innerHTML = `<small>Personagens: </small><span>${totalPersonagens}</span>
        <small>Localizações: </small><span>${totalLocalizacoes}</span>
        <small>Episódios: </small><span>${totalEpisodios}</span>`;
  } catch (error) {
    console.error("Erro ao obter informações do rodapé:", error);
  }
}

getRodaPeInfos();

function paginaSeguinte() {
  const totalDePaginas = characters.length / displayCount;

  if (pagina >= totalDePaginas) {
    return;
  }
  console.log(pagina);
  pagina += 1;

  if (pagina >= totalDePaginas) {
    document.getElementById("nextPageBtn1").disabled = true;
  }

  atualizarLista();

  document.getElementById("prevPageBtn1").disabled = false;

  document.getElementById("paginaAtual").innerHTML = `${pagina}`;
}

function paginaAnterior() {
  if (pagina <= 1) {
    return;
  }

  pagina -= 1;

  if (pagina <= 1) {
    document.getElementById("prevPageBtn1").disabled = true;
  }

  atualizarLista();

  document.getElementById("nextPageBtn1").disabled = false;

  document.getElementById("paginaAtual").innerHTML = `${pagina}`;
}

function paginaPrincipal() {
  window.location.href = "index.html";
}
