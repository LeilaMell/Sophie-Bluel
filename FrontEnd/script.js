//ajouter dynamiquement les travaux

async function fetchData() {
    let response = await fetch("http://localhost:5678/api/works");
    let data= await response.json();

    data.forEach(function (element){
        
        let figcaptionContent = element.title;
        let imageURLContent = element.imageUrl;
        let workCategoryId = element.categoryId;

        let figure = document.createElement("figure")
        let img = document.createElement("img")
        let figcaption = document.createElement("figcaption")

        figure.dataset.categoryId = workCategoryId;
        figure.dataset.projectId=element.id
        figure.classList.add("galleryElement")

        img.setAttribute("src", imageURLContent);
        img.setAttribute("alt", figcaptionContent);
        figcaption.innerText = figcaptionContent;

        figure.appendChild(img);
        figure.appendChild(figcaption);

        let gallery = document.querySelector(".gallery")
        gallery.appendChild(figure);



         
        // ajouter dynamiquement trash avec Id image

        let figureModal = document.createElement("figure")
        let imgModal = document.createElement("img")
        let figcaptionModal = document.createElement("figcaption")
       
        figureModal.dataset.categoryId = workCategoryId;
        figureModal.dataset.projectId = element.id
        figureModal.classList.add("modalElement")
       
        imgModal.setAttribute("src", imageURLContent);
        imgModal.setAttribute("alt", figcaptionContent);

        figureModal.appendChild(imgModal);
        figureModal.appendChild(figcaptionModal);

        let galleryModal = document.querySelector(".gallery-modal")
        galleryModal.appendChild(figureModal);

        let trashButton = document.createElement("button")
        trashButton.classList.add("trashButton")
        figureModal.appendChild(trashButton)

        let trash = document.createElement("i")
        trash.classList.add("fa-solid")
        trash.classList.add("fa-trash-can")

        trashButton.appendChild(trash)
        trashButton.dataset.projectId = element.id

    })


    // supprimer un travail

    let listTrashButtons = document.querySelectorAll(".trashButton")
    listTrashButtons.forEach(function(trashButton){
        trashButton.addEventListener("click",async function(event){
            event.preventDefault()
            let projectIdToDelete = this.dataset.projectId
            let response = await fetch(`http://localhost:5678/api/works/${projectIdToDelete}`,{
                method:"DELETE",
                headers:{
                    "Authorization":`Bearer ${localStorage.getItem("token")}`
                }
            })
            if (response.ok){
                document.querySelectorAll(".galleryElement").forEach(function(e){
                    if(e.dataset.projectId == projectIdToDelete){
                        e.remove()
                    }
                })
                document.querySelectorAll(".modalElement").forEach(function(e){
                    if(e.dataset.projectId == projectIdToDelete){
                        e.remove()
                    }
                })
            }
        })
    })
}




//fonction pour ajouter dynamiquement les filtres

async function fetchCategory() {
    let response = await fetch("http://localhost:5678/api/categories");
    let data = await response.json();

    data.forEach(function (element){

        let categoryId = element.id;
        let categoryName = element.name;

        let button = document.createElement("button")
        button.innerText = categoryName;
        button.dataset.categoryId = categoryId;

        let filters = document.querySelector(".filter")
        filters.appendChild(button);

        let dropdownCategory = document.createElement("button")
        dropdownCategory.innerText = categoryName;
        dropdownCategory.dataset.categoryId = categoryId;

        let dropdown = document.getElementById("dropdown")
        dropdown.appendChild(dropdownCategory)


    })
    
    let listButtons = document.querySelectorAll("button")
    listButtons.forEach(function(currentButton){
        
        currentButton.addEventListener("click",function(event){
            event.preventDefault()
            let buttonCurrentCategory = this.dataset.categoryId

            let works = document.querySelectorAll(".galleryElement")
            works.forEach(function (work){
                if (work.dataset.categoryId === buttonCurrentCategory){
                    work.classList.remove("d-none")
                }
                else if(buttonCurrentCategory === "all"){
                    work.classList.remove("d-none")
                }
                else{
                    work.classList.add('d-none')
                }
            })
        })
    })
}


// login / logout

function displayAdmin(){
    let edition = document.querySelectorAll(".edition")
    document.querySelector(".button-all").classList.add("d-none")

    let logout = document.querySelector(".logout")
    logout.classList.remove("d-none")
    document.querySelector(".login").classList.add("d-none")

    edition.forEach(function(element){
        element.classList.remove("d-none")
        element.classList.add("d-flex")

    })

}

function logoutFunction(){
    document.querySelector(".logout").addEventListener("click", function(e){
        e.preventDefault()
        localStorage.removeItem("token")

        let edition = document.querySelectorAll(".edition")
        document.querySelector(".button-all").classList.remove("d-none")

        let logout = document.querySelector(".logout")
        logout.classList.add("d-none")
        document.querySelector(".login").classList.remove("d-none")

        edition.forEach(function(element){
            element.classList.add("d-none")
            element.classList.remove("d-flex")

        })
        fetchCategory();
    })
}
logoutFunction()

if(localStorage.getItem("token") === null){
    fetchCategory();
}else{
    displayAdmin()
}


// show/hide modal

let modalEdit = document.getElementById("modal-edition")
let modalAdd = document.getElementById("modal-add-photo")
const closeModal = function(){
        modalEdit.classList.add("d-none")
        modalEdit.classList.remove("d-flex")
        modalAdd.classList.add("d-none")
        modalAdd.classList.remove("d-flex")
    }

document.querySelector(".div-modifier").addEventListener("click", function(e){
    e.preventDefault()
    modalEdit.classList.remove("d-none")
    modalEdit.classList.add("d-flex")

    document.getElementById("cross").addEventListener("click", function(e){
        closeModal()
    })

    window.addEventListener('keydown',function(b){
        if(b.key === "Escape" || b.key === "Esc"){
            closeModal()
        }
    })

    modalEdit.addEventListener('click', function(e) {
        const isOutside = !e.target.closest('.modal-wrapper');
        if (isOutside) {
          closeModal();
        }
      })

    document.getElementById("add-photo").addEventListener("click", function(a){
        a.preventDefault()
        modalAdd.classList.remove("d-none")
        modalAdd.classList.add("d-flex")

        window.addEventListener('keydown',function(b){
            if(b.key === "Escape" || b.key === "Esc"){
                closeModal()
            }
        })

        document.getElementById("cross-add").addEventListener("click", function(e){
            closeModal()
        })

        modalAdd.addEventListener('click', function(e) {
            const isOutside = !e.target.closest('.modal-wrapper');
            if (isOutside) {
              closeModal();
            }
          })

        document.getElementById("return").addEventListener("click", function(e){
            e.preventDefault()
            modalAdd.classList.add("d-none")
            modalAdd.classList.remove("d-flex")
        })
    })

})


//dropdown

async function Dropdown() {
    let response = await fetch("http://localhost:5678/api/categories");
    let data = await response.json();

    data.forEach(function (element){

        let categoryId = element.id;
        let categoryName = element.name;
        let option = document.createElement("option");
        option.value = categoryId;
        option.innerText = categoryName;
        document.getElementById("categorie").appendChild(option);
    })
}

Dropdown()


//image preview

let addPhoto = document.getElementById("add")
addPhoto.addEventListener("change", function(e){
    e.preventDefault();

    let divAddPhoto = document.querySelector(".ajouter-photo")
    let divImage = document.querySelector(".afficher-photo")
    divAddPhoto.classList.remove("d-flex")
    divAddPhoto.classList.add("d-none")
    divImage.classList.remove("d-none")
    divImage.classList.add("d-flex")
    
    let preview = document.querySelector('.preview');
    let file = document.querySelector('input[type=file]').files[0];
    let reader = new FileReader();

    let maxSize = 4 * 1024 * 1024;
    if (file.size > maxSize){
        alert("Image trop volumineuse, la limite de la taille de l'image est de 4mo");
        divAddPhoto.classList.add("d-flex")
        divAddPhoto.classList.remove("d-none")
        divImage.classList.add("d-none")
        divImage.classList.remove("d-flex")
    }else{
        reader.onloadend = function () {
            preview.src = reader.result;
        }
        
        if (file) {
            reader.readAsDataURL(file);
        } else {
            preview.src = "";
        }
      }
})


//enable/disable validate button

function disableBtn() {
    let validerBtn = document.getElementById("valider")
    validerBtn.setAttribute("disabled","");
    validerBtn.classList.add("greyBtn")
    validerBtn.classList.remove("greenBtn")
}

function enableBtn() {
    let validerBtn = document.getElementById("valider")
    validerBtn.removeAttribute("disabled");
    validerBtn.classList.add("greenBtn")
    validerBtn.classList.remove("greyBtn")
}

let title = document.getElementById("titre")
let image = document.getElementById("add")
let category = document.getElementById("categorie")
let formElements = document.querySelectorAll(".form-element")

formElements.forEach(function(e){
    e.addEventListener("change", function(){
        if (title.value == null || title.value == "" || image.files[0] == null || image.files[0] == "" || category.value == null || category.value == ""){
            disableBtn()
        } else{
            enableBtn()
        }
    })
})



// envoie du formulaire vers API add work

document.getElementById("valider").addEventListener("click", async function(e){

    let title = document.getElementById("titre")
    let image = document.getElementById("add")
    let category = document.getElementById("categorie")
    let formElements = document.querySelectorAll(".form-element")

    let form = new FormData();
    form.append("title", title.value) 
    form.append("image", image.files[0]) 
    form.append("category", category.value) 

    let response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        body: form,
        headers: {
            "Authorization":`Bearer ${localStorage.getItem("token")}`
        }
        
    })
    let data = await response.json();

    //vider le form
    document.getElementById("titre").value = "";
    document.getElementById("add").value = "";

    let divAddPhoto = document.querySelector(".ajouter-photo")
    let divImage = document.querySelector(".afficher-photo")
    divAddPhoto.classList.add("d-flex")
    divAddPhoto.classList.remove("d-none")
    divImage.classList.add("d-none")
    divImage.classList.remove("d-flex")

    if (title.value == null || title.value == "" || image.files[0] == null || image.files[0] == "" || category.value == null || category.value == ""){
        disableBtn()
    } else{
        enableBtn()
    }
    
    // création du nouveau travail dans la gallerie
    //dans la modale
    // + les trashbuttons

    let newWorkGallery = document.createElement("figure");
    let newWorkImageGallery = document.createElement("img");
    let newWorkTitleGallery = document.createElement("figcaption");

    let newWorkModal = document.createElement("figure");
    let newWorkImageModal = document.createElement("img");
    let newWorkTitleModal = document.createElement("figcaption");
   
    newWorkImageGallery.setAttribute("src", data.imageUrl)
    newWorkImageGallery.setAttribute("alt", data.title)
    newWorkTitleGallery.innerText = data.title

    newWorkGallery.dataset.categoryId = data.categoryId;
    newWorkGallery.dataset.projectId = data.id
    newWorkGallery.classList.add("galleryElement")

    newWorkGallery.appendChild(newWorkImageGallery)
    newWorkGallery.appendChild(newWorkTitleGallery)

    let gallery = document.querySelector(".gallery")
    gallery.appendChild(newWorkGallery);

    newWorkModal.dataset.categoryId = data.categoryId;
    newWorkModal.dataset.projectId = data.id
    newWorkModal.classList.add("modalElement")

    newWorkImageModal.setAttribute("src", data.imageUrl)
    newWorkImageModal.setAttribute("alt", data.title)
    newWorkModal.appendChild(newWorkImageModal)
    newWorkModal.appendChild(newWorkTitleModal)

    let trashButton = document.createElement("button")
    trashButton.classList.add("trashButton")
    newWorkModal.appendChild(trashButton)

    let trash = document.createElement("i")
    trash.classList.add("fa-solid")
    trash.classList.add("fa-trash-can")

    trashButton.appendChild(trash)
    trashButton.dataset.projectId = data.id

    let galleryModal = document.querySelector(".gallery-modal")
    galleryModal.appendChild(newWorkModal);

    trashButton.addEventListener("click",async function(event){
        event.preventDefault()
        let projectIdToDelete = this.dataset.projectId
        let response = await fetch(`http://localhost:5678/api/works/${projectIdToDelete}`,{
            method:"DELETE",
            headers:{
                "Authorization":`Bearer ${localStorage.getItem("token")}`
            }
        })
        if (response.ok){
            document.querySelectorAll(".galleryElement").forEach(function(e){
                if(e.dataset.projectId == projectIdToDelete){
                    e.remove()
                }
            })
            document.querySelectorAll(".modalElement").forEach(function(e){
                if(e.dataset.projectId == projectIdToDelete){
                    e.remove()
                }
            })
        }
    })

})


fetchData();





