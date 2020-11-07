// offline persistence
db.enablePersistence().catch(err => {
  if (err.code == "failed-precondition") {
    // Multiple tabs open, persistence can only be enabled
    // in one tab at a a time.
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
    console.log(change, change.doc.data(), change.doc.id);
    switch (change.type) {
      case "added":
        // add doc data to UI
        renderRecipe(change.doc.data(), change.doc.id);
        break;
      case "removed":
        // remove doc data from UI
        break;
      default:
        break;
    }
  });
});
