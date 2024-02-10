const subCards = document.querySelectorAll(".sub-card");

const imagePreview = document.querySelector("#image-preview");

subCards.forEach( card => {
    card.addEventListener("mouseover", () => {
        imagePreview.setAttribute("src", card.dataset.image);
    });
});