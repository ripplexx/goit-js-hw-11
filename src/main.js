import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox/dist/simple-lightbox.esm.js";
import "simplelightbox/dist/simple-lightbox.min.css";

const form = document.querySelector(".search-form");
const gallery = document.querySelector(".gallery");
const loader = document.querySelector(".loader");

// Lightbox bir kez oluştur, başta null
let lightbox = null;

function createGalleryCard(image) {
  return `
    <li class="gallery-item">
      <a class="gallery-link" href="${image.largeImageURL}">
        <img class="gallery-image" src="${image.webformatURL}" alt="${image.tags}" />
        <div class="info">
          <p>❤️ ${image.likes}</p>
          <p>👁️ ${image.views}</p>
          <p>💬 ${image.comments}</p>
          <p>⬇️ ${image.downloads}</p>
        </div>
      </a>
    </li>
  `;
}

function fetchImages(searchTerm) {
  const params = new URLSearchParams({
    key: "55936108-136129e505e09c12d0f22cc5e",
    q: searchTerm,
    image_type: "photo",
    orientation: "horizontal",
    safesearch: true,
  });

  return fetch(`https://pixabay.com/api/?${params}`)
    .then(response => {
      if (!response.ok) throw new Error(response.status);
      return response.json();
    });
}

form.addEventListener("submit", event => {
  event.preventDefault();

  const searchTerm = form.elements.searchQuery.value.trim();
  if (!searchTerm) return;

  // Galeri temizle, lightbox sıfırla
  gallery.innerHTML = "";
  lightbox = null;

  // Loader göster
  loader.classList.remove("hidden");

  fetchImages(searchTerm)
    .then(data => {
      loader.classList.add("hidden");

      if (data.hits.length === 0) {
        iziToast.error({
          message: "Sorry, there are no images matching your search query. Please try again!",
          position: "topRight",
        });
        return;
      }

      const markup = data.hits
        .map(image => createGalleryCard(image))
        .join("");

      gallery.insertAdjacentHTML("beforeend", markup);

      // Lightbox ilk kez oluştur, sonraki aramalarda refresh et
      if (!lightbox) {
        lightbox = new SimpleLightbox(".gallery-link", {
          captionsData: "alt",
          captionDelay: 250,
        });
      } else {
        lightbox.refresh();
      }
    })
    .catch(error => {
      loader.classList.add("hidden");
      iziToast.error({
        message: `Error: ${error.message}`,
        position: "topRight",
      });
    });
});