import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';
import { CLOSE_MODAL_SEC } from './config.js';
import * as model from './model.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
import bookmarksView from './views/bookmarksView.js';

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    // 0) Update the dom to give the active link to results
    resultsView.update(model.getSearchResultPage());
    bookmarksView.update(model.state.bookmarks);

    // 1) Load the Recipe
    await model.loadRecipe(id);

    // 2) Render the recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    // Pass the error message if nedded
    // If not it displayes default message
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    // Get the query
    const query = searchView.getQuary();
    if (!query) return;

    // Load the query
    await model.loadSearchResults(query);

    // Render the Results for Search
    resultsView.render(model.getSearchResultPage());

    // Render the pagination for the results
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // Render the NEW Results for Search
  resultsView.render(model.getSearchResultPage(goToPage));

  // Render the NEW pagination for the results
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the servings in the state object
  model.updateServings(newServings);
  // Render the recipe with the new Servings
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);

  // Update the page to see the change of bookmark
  recipeView.update(model.state.recipe);

  // Render the bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // render Spinner
    addRecipeView.renderSpinner();

    // wait for the data to upload
    await model.uploadRecipe(newRecipe);

    // render the recipe
    recipeView.render(model.state.recipe);

    // succes message
    addRecipeView.renderMessage();

    // render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // change url with the id of the new recipe
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    setTimeout(function () {
      addRecipeView._toggleWindow();
    }, CLOSE_MODAL_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
