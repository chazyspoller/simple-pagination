async function getData() {
  const data = await fetch('https://jsonplaceholder.typicode.com/photos?albumId=1')
    .then(response => response.json());

  return data;
}

async function setPhotos() {
  const dPhotos = await getData();
  let currentPage = 1;
  const rows = 4;

  function generatePhotos(photos, rowCount, pageNum) {
    pageNum--;
    const start = pageNum * rowCount;
    const end = start + rowCount;
    const pagePhotos = photos.slice(start, end);
    const photosList = document.querySelector('.posts__list');
    photosList.innerHTML = '';
    pagePhotos.forEach(photo => {photosList.appendChild(generatePhotoEl(photo))});
  }

  function generatePhotoEl(photo) {
    const photoEl = document.createElement('li');

    photoEl.classList.add('posts__item');
    photoEl.innerHTML = `<img src="${photo.thumbnailUrl}">`;
    photoEl.innerHTML += `<h3>${photo.title.slice(0, -Math.floor(photo.title.length / 1.5))} ${photo.id}</h3>`;
    photoEl.innerHTML += `<p>${photo.title}</p>`;

    return photoEl;
  }

  function generatePagination(data, rowCount) {
    const pagination = document.querySelector('.pagination');
    const pagList = document.querySelector('.pagination__list');
    const prevBtn = pagination.querySelector('[data-btn-prev]');
    const nextBtn = pagination.querySelector('[data-btn-next]');
    const pagesCount = Math.ceil(data.length / rowCount);

    if (pagesCount === 1) {
      pagination.querySelectorAll('button').forEach(btn => btn.display = 'none');
    } else {
      pagination.querySelectorAll('button').forEach(btn => btn.display = 'flex');
    }

    for (let i = 0; i < pagesCount; i++) {
      const pagEl = document.createElement('li');
      const pagLink = document.createElement('a');
      pagEl.classList.add('pagination__item');
      pagLink.innerText = i + 1;
      pagLink.setAttribute('href', '#');
      pagEl.appendChild(pagLink);

      if (currentPage === i + 1) pagEl.classList.add('active');

      pagEl.addEventListener('click', (evt) => {
        evt.preventDefault();
        currentPage = i + 1;
        generatePhotos(data, rowCount, currentPage);

        const currentPageEl = document.querySelector('.pagination__item.active');
        currentPageEl.classList.remove('active');
        pagEl.classList.add('active');
      });
      pagList.appendChild(pagEl);
    }

    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        generatePhotos(data, rowCount, --currentPage);
        const currentPageEl = document.querySelector('.pagination__item.active');
        currentPageEl.classList.remove('active');
        pagList.children[currentPage - 1].classList.add('active');
      }
    });

    nextBtn.addEventListener('click', () => {
      if (currentPage < pagesCount) {
        generatePhotos(data, rowCount, ++currentPage);
        const currentPageEl = document.querySelector('.pagination__item.active');
        currentPageEl.classList.remove('active');
        pagList.children[currentPage - 1].classList.add('active');
      }
    });
  }

  generatePhotos(dPhotos, rows, currentPage);
  generatePagination(dPhotos, rows);
}

setPhotos();