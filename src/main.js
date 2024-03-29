const api = axios.create({
	baseURL: "https://api.themoviedb.org/3/",
	headers: {
		"Content-Type": "application/json;charset=utf-8",
	},
	params: {
		api_key: API_KEY,
		language: localStorage.getItem("lang")
			? localStorage.getItem("lang")
			: navigator.language[0] + navigator.language[1],
	},
});

async function getWords() {
	const langWords = localStorage.getItem("lang");
	const languagueTexts = await fetch("../src/lang.json");
	const data = await languagueTexts.json();
	return data[langWords];
}

async function setDefaultLang() {
	if (!localStorage.getItem("lang")) {
		if (navigator.language.includes("-")) {
			const navLang = navigator.language.split("-");
			localStorage.setItem("lang", navLang[0]);
		} else {
			localStorage.setItem("lang", navigator.language);
		}
	}
	lang.value = localStorage.getItem("lang");
	const langWords = await getWords();
	wordFind.innerText = langWords["Find your movies"];
	headerInput.placeholder = langWords["Search Here ..."];
	wordTrending.innerText = langWords["Trending"];
	trendsBtn.innerHTML = `${langWords["See More"]}
  <ion-icon class="main__trendsIcon" name="chevron-forward"></ion-icon>`;
	wordCategories.innerText = langWords["Categories"];
	backBtn.innerHTML = `<ion-icon class="main__backBtnIcon" 
  name="chevron-back"></ion-icon> ${langWords["Back"]}`;
}

function likedMoviesList() {
	const item = JSON.parse(localStorage.getItem("likedMovies"));
	return item ? item : {};
}

function likeMovie(movie) {
	const moviesList = likedMoviesList();
	let liked = false;
	if (moviesList[movie.id]) {
		moviesList[movie.id] = undefined;
	} else {
		moviesList[movie.id] = movie;
		liked = true;
	}
	localStorage.setItem("likedMovies", JSON.stringify(moviesList));
	return liked;
}

let lazyLoading = new IntersectionObserver((movies) => {
	movies.forEach((movie) => {
		if (movie.isIntersecting) {
			const url = movie.target.getAttribute("data-img");
			movie.target.setAttribute("src", url);
		}
	});
});

function createImgList(movies, container, { lazyLoad = false }) {
	const moviesList = likedMoviesList();
	movies.forEach((movie, index) => {
		const trendsPreviewContainer = document.createElement("div");
		trendsPreviewContainer.classList.add("main__trendsPreviewContainer");

		const likedMoviesBtn = document.createElement("span");
		likedMoviesBtn.classList.add("main__likedMoviesBtn");
		likedMoviesBtn.innerHTML = `<ion-icon class="main__likedMoviesBtnIcon"
     name="heart-sharp"></ion-icon>`;

		if (moviesList[movie.id]) {
			likedMoviesBtn.classList.add("main__likedMoviesBtnIcon--liked");
		} else {
			likedMoviesBtn.classList.remove("main__likedMoviesBtnIcon--liked");
		}

		likedMoviesBtn.addEventListener("click", () => {
			const liked = likeMovie(movie);
			if (liked) {
				likedMoviesBtn.classList.add("main__likedMoviesBtnIcon--liked");
			} else {
				likedMoviesBtn.classList.remove("main__likedMoviesBtnIcon--liked");
			}
			if (location.hash === "") {
				homePage();
			}
		});

		const img = document.createElement("img");
		img.classList.add("main__trendsPreviewImg");
		img.setAttribute("alt", movie.title);

		img.setAttribute(
			lazyLoad ? "data-img" : "src",
			`https://image.tmdb.org/t/p/w300${movie.poster_path}`
		);
		img.addEventListener("error", () => {
			img.setAttribute(
				"src",
				"https://cdn4.iconfinder.com/data/icons/ui-beast-4/32/Ui-12-512.png"
			);
		});

		if (lazyLoad) {
			lazyLoading.observe(img);
		}

		img.addEventListener("click", () => {
			location.hash = "#movie=" + movie.id;
		});

		trendsPreviewContainer.appendChild(likedMoviesBtn);
		trendsPreviewContainer.appendChild(img);
		container.appendChild(trendsPreviewContainer);
	});
	return container;
}

async function createCardsMovies(
	movies,
	{ lazyLoad = false, clean = true } = {}
) {
	if (clean) {
		cardsCard.innerHTML = "";
	}
	const moviesList = likedMoviesList();
	const langWords = await getWords();
	const cardsContainer = document.createElement("div");
	cardsContainer.classList.add("main__cardsContainer");
	movies.forEach((movie) => {
		const cardContainer = document.createElement("div");
		cardContainer.classList.add("main__cardContainer");
		const movieImg = document.createElement("img");
		movieImg.classList.add("main__cardImg");
		movieImg.setAttribute("alt", movie.title);

		movieImg.setAttribute(
			lazyLoad ? "data-img" : "src",
			`https://image.tmdb.org/t/p/w300${movie.poster_path}`
		);
		movieImg.addEventListener("error", () => {
			movieImg.setAttribute(
				"src",
				"https://cdn4.iconfinder.com/data/icons/ui-beast-4/32/Ui-12-512.png"
			);
		});

		if (lazyLoad) {
			lazyLoading.observe(movieImg);
		}

		movieImg.addEventListener("click", () => {
			location.hash = "#movie=" + movie.id;
		});

		const cardContainerInfo = document.createElement("div");
		cardContainerInfo.classList.add("main__cardContainerInfo");
		const cardInfoPrimary = document.createElement("div");
		cardInfoPrimary.classList.add("main__cardInfoPrimary");
		const cardReleaseDate = document.createElement("p");
		cardReleaseDate.innerText = langWords["Release date"] + ":";
		cardReleaseDate.classList.add("main__cardReleaseDate");
		const cardTitleText = document.createElement("p");
		cardTitleText.innerText = movie.title;
		cardTitleText.classList.add("main__cardTitleText");
		const cardReleaseDateText = document.createElement("p");
		cardReleaseDateText.innerText = movie.release_date;
		cardReleaseDateText.classList.add("main__cardReleaseDateText");
		const cardStar = document.createElement("ion-icon");
		cardStar.setAttribute("name", "star-sharp");
		cardStar.classList.add("main__cardStar");
		const cardHeart = document.createElement("ion-icon");
		cardHeart.setAttribute("name", "heart-outline");
		cardHeart.classList.add("main__cardHeart");
		if (moviesList[movie.id]) {
			cardHeart.setAttribute("name", "heart-sharp");
		} else {
			cardHeart.setAttribute("name", "heart-outline");
		}
		cardHeart.addEventListener("click", () => {
			const liked = likeMovie(movie);
			if (liked) {
				cardHeart.setAttribute("name", "heart-sharp");
			} else {
				cardHeart.setAttribute("name", "heart-outline");
			}
		});

		const cardStarText = document.createElement("p");
		cardStarText.innerText = movie.vote_average;
		cardStarText.classList.add("main__cardStarText");
		const cardInfoSecundary = document.createElement("div");
		cardInfoSecundary.classList.add("main__cardInfoSecundary");
		const cardInfoSecundaryStar = document.createElement("div");
		cardInfoSecundaryStar.classList.add("main__cardInfoSecundaryStar");
		cardInfoSecundaryStar.appendChild(cardStarText);
		cardInfoSecundaryStar.appendChild(cardStar);
		cardInfoPrimary.appendChild(cardTitleText);
		cardInfoPrimary.appendChild(cardReleaseDate);
		cardInfoPrimary.appendChild(cardReleaseDateText);
		cardInfoSecundary.appendChild(cardInfoSecundaryStar);
		cardInfoSecundary.appendChild(cardHeart);
		cardContainerInfo.appendChild(cardInfoPrimary);
		cardContainerInfo.appendChild(cardInfoSecundary);
		cardContainer.appendChild(movieImg);
		cardContainer.appendChild(cardContainerInfo);
		cardsContainer.appendChild(cardContainer);
	});
	cardsCard.appendChild(cardsContainer);
}

async function createTrendsPreview() {
	const { data } = await api("trending/movie/day");
	const movies = data.results;
	trendsPreview.innerHTML = "";
	createImgList(movies, trendsPreview, { lazyLoad: true });
}
async function getTrendingMovies() {
	const { data } = await api("trending/movie/day");
	const movies = data.results;
	totalPages = data.total_pages;

	createCardsMovies(movies, { lazyLoad: true });
}
async function getPaginatedTrendingMovies() {
	const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
	const scrollIsBottom = scrollTop + clientHeight >= scrollHeight - 5;
	const finalPage = page <= totalPages;
	if (scrollIsBottom && finalPage) {
		page++;
		const { data } = await api("trending/movie/day", {
			params: {
				page,
			},
		});
		const movies = data.results;
		createCardsMovies(movies, { lazyLoad: true, clean: false });
	}
}

async function getMoviesByCategory(id) {
	const { data } = await api("discover/movie", {
		params: {
			with_genres: id,
		},
	});
	const movies = data.results;
	totalPages = data.total_pages;
	createCardsMovies(movies, { lazyLoad: true });
}
function getPaginatedMoviesByCategory(id) {
	return async function () {
		const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
		const scrollIsBottom = scrollTop + clientHeight >= scrollHeight - 5;
		const finalPage = page <= totalPages;
		if (scrollIsBottom && finalPage) {
			page++;
			const { data } = await api("discover/movie", {
				params: {
					with_genres: id,
					page,
				},
			});
			const movies = data.results;
			createCardsMovies(movies, { lazyLoad: true, clean: false });
		}
	};
}

function createGenreButtons(genres, container) {
	categories.innerHTML = "";
	genres.forEach((genre, index) => {
		const btn = document.createElement("button");
		btn.type = "button";
		btn.classList.add("main__categoriesBtn");
		btn.innerText = genre.name;
		btn.setAttribute("id", "id" + genre.id);
		btn.addEventListener("click", () => {
			location.hash = `#category=${genre.id}-${genre.name}`;
		});
		container.appendChild(btn);
	});
	return container;
}
async function getGenreButtons() {
	const { data } = await api("genre/movie/list");
	const genres = data.genres;
	createGenreButtons(genres, categories);
}

async function getMoviesBySearch(query) {
	const { data } = await api("search/movie", {
		params: {
			query,
		},
	});
	const movies = data.results;
	totalPages = data.total_pages;
	if (movies.length > 0) {
		createCardsMovies(movies, { lazyLoad: true });
	} else {
		const noDataMessage = document.createElement("h3");
		noDataMessage.innerText =
			"There are no matches. Please go back and search for movies with another name";
		cardsCard.innerHTML = "";
		cardsCard.appendChild(noDataMessage);
	}
}
function getPaginatedMoviesBySearch(query) {
	return async function () {
		const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
		const scrollIsBottom = scrollTop + clientHeight >= scrollHeight - 5;
		const finalPage = page <= totalPages;
		if (scrollIsBottom && finalPage) {
			page++;
			const { data } = await api("search/movie", {
				params: {
					query,
					page,
				},
			});
			const movies = data.results;
			createCardsMovies(movies, { lazyLoad: true, clean: false });
		}
	};
}

async function getRelatedMoviesId(id) {
	const { data } = await api(`movie/${id}/recommendations`);
	const movies = data.results;
	if (movies.length > 0) {
		const infoRelatedMoviesContainer = document.createElement("div");
		infoRelatedMoviesContainer.classList.add("main__infoRelatedMovies");
		let infoRelatedMovies = document.createElement("div");
		infoRelatedMovies.classList.add("main__infoRelatedMoviesContainer");
		infoRelatedMovies = createImgList(movies, infoRelatedMovies, {
			lazyLoad: true,
		});
		infoRelatedMoviesContainer.appendChild(infoRelatedMovies);
		return infoRelatedMoviesContainer;
	} else {
		return 0;
	}
}

async function getMovieById(id) {
	fullInfoArticle.innerHTML = "";
	const { data: movie } = await api(`movie/${id}`);
	const langWords = await getWords();
	const backPosterImg = document.createElement("img");
	backPosterImg.classList.add("main__infoBackPoster");
	backPosterImg.setAttribute("alt", movie.title);
	backPosterImg.setAttribute(
		"src",
		`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
	);
	backPosterImg.addEventListener("error", () => {
		backPosterImg.setAttribute(
			"src",
			"https://cdn4.iconfinder.com/data/icons/ui-beast-4/32/Ui-12-512.png"
		);
	});

	const infoPosterContainer = document.createElement("figure");
	infoPosterContainer.classList.add("main__infoPosterContainer");
	const posterImg = document.createElement("img");
	posterImg.classList.add("main__infoPoster");
	posterImg.setAttribute("alt", movie.title);
	posterImg.setAttribute(
		"src",
		`https://image.tmdb.org/t/p/w300${movie.poster_path}`
	);
	posterImg.addEventListener("error", () => {
		posterImg.setAttribute(
			"src",
			"https://cdn4.iconfinder.com/data/icons/ui-beast-4/32/Ui-12-512.png"
		);
	});

	const title = document.createElement("p");
	title.innerText = movie.title;
	title.classList.add("main__infoTitle");

	const cardReleaseDateText = document.createElement("p");
	cardReleaseDateText.innerText = movie.release_date;
	const cardStar = document.createElement("ion-icon");
	cardStar.setAttribute("name", "star-sharp");
	const cardHeart = document.createElement("ion-icon");

	const moviesList = likedMoviesList();

	if (moviesList[movie.id]) {
		cardHeart.setAttribute("name", "heart-sharp");
	} else {
		cardHeart.setAttribute("name", "heart-outline");
	}
	cardHeart.addEventListener("click", () => {
		const liked = likeMovie(movie);
		if (liked) {
			cardHeart.setAttribute("name", "heart-sharp");
		} else {
			cardHeart.setAttribute("name", "heart-outline");
		}
	});

	const cardStarText = document.createElement("p");
	cardStarText.innerText = movie.vote_average;
	const infoIcons = document.createElement("div");
	infoIcons.classList.add("main__infoIcons");
	const infoIconsStarText = document.createElement("div");
	infoIconsStarText.appendChild(cardStar);
	infoIconsStarText.appendChild(cardStarText);
	infoIcons.appendChild(infoIconsStarText);
	infoIcons.appendChild(cardHeart);

	let infoGenres = document.createElement("div");
	infoGenres = createGenreButtons(movie.genres, infoGenres);
	infoGenres.classList.add("main__infoGenres");

	const overview = document.createElement("p");
	overview.innerText = movie.overview;
	overview.classList.add("main__infoOverview");

	const releaseDate = document.createElement("p");
	releaseDate.innerHTML = `<p class="main__infoSubTitle">${langWords["Release date"]}:</p> ${movie.release_date}`;
	releaseDate.classList.add("main__infoReleaseDate");

	const rateCount = document.createElement("p");
	rateCount.innerHTML = `<p class="main__infoSubTitle">${langWords["Rate count"]}:</p> ${movie.vote_count}`;
	rateCount.classList.add("main__infoRateCount");

	const recommendationsText = document.createElement("p");
	recommendationsText.innerText = langWords["Recommendations"];
	recommendationsText.classList.add("main__infoRelatedMoviesText");

	let infoRelatedMoviesContainer = await getRelatedMoviesId(id);

	const btn = document.createElement("button");
	btn.type = "button";
	btn.classList.add("main__infobackBtn");

	btn.addEventListener("click", () => {
		history.back();
		headerInput.value = "";
	});
	btn.innerHTML = `<ion-icon class="main__infobackBtnIcon" name="chevron-back"></ion-icon>
     ${langWords["Back"]}`;

	infoPosterContainer.appendChild(posterImg);
	fullInfoArticle.appendChild(backPosterImg);
	fullInfoArticle.appendChild(infoPosterContainer);
	fullInfoArticle.appendChild(infoIcons);
	fullInfoArticle.appendChild(title);
	fullInfoArticle.appendChild(infoGenres);
	fullInfoArticle.appendChild(overview);
	fullInfoArticle.appendChild(releaseDate);
	fullInfoArticle.appendChild(rateCount);
	if (infoRelatedMoviesContainer !== 0) {
		fullInfoArticle.appendChild(recommendationsText);
		fullInfoArticle.appendChild(infoRelatedMoviesContainer);
	}
	fullInfoArticle.appendChild(btn);
}

async function createFavoritesMovies() {
	likedMovies.innerHTML = "";
	favoriteMoviesTitle.innerText = "";
	const moviesList = likedMoviesList();
	let movies = Object.values(moviesList);
	if (movies.length > 0) {
		const langWords = await getWords();
		favoriteMoviesTitle.innerHTML = langWords["Favorite Movies"];
	}
	createImgList(movies, likedMovies, { lazyLoad: true });
}
