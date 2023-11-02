class SearchView {
  #parrentEl = document.querySelector('.search');

  getQuary() {
    const query = this.#parrentEl.querySelector('.search__field').value;
    this.#clearInput();
    return query;
  }

  #clearInput() {
    this.#parrentEl.querySelector('.search__field').value = '';
  }

  addHandlerSearch(handler) {
    this.#parrentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
