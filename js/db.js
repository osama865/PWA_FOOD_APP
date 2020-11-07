// offline persistence
db.enablePersistence().catch(err => {
  if (err.code == "failed-precondition") {
    // Multiple tabs open, persistence can only be enabled
    // in one tab at a time.
    // ...
    console.log("persistence failed");
  } else if (err.code == "unimplemented") {
    // The current browser does not support all of the
    // features required to enable persistence
    // ...
    console.log("persistence is not available");
  }
});

// real time listener
db.collection("recipes").onSnapshot(snapshot => {
  // console.log(snapshot.docChanges());
  snapshot.docChanges().forEach(change => {
    // console.log(change, change.doc.data(), change.doc.id);
    switch (change.type) {
      case "added":
        // add doc data to UI
        renderRecipe(change.doc.data(), change.doc.id);
        break;
      case "removed":
        // remove doc data from UI
        removeRecipe(change.doc.id);
        break;
      default:
        break;
    }
  });
});

//  adding recipes
const form = document.querySelector("form");

form.addEventListener("submit", evt => {
  evt.preventDefault();
  const recipe = {
    title: form.title.value,
    ingredients: form.ingredients.value,
  };

  db.collection("recipes")
    .add(recipe)
    .catch(err => console.log(err));

  form.title.value = "";
  form.ingredients.value = "";
});

// delete recipe

const recipeContainer = document.querySelector(".recipes");

recipeContainer.addEventListener("click", evt => {
  // console.log(evt);
  if (evt.target.tagName === "I") {
    const id = evt.target.getAttribute("data-id");
    console.log(id);
    db.collection("recipes").doc(id).delete();
    // console.log("hello");
  }
});
