const list=document.querySelector('ul');
const form = document.querySelector('form');
const button = document.querySelector('button');

const addRecipe = (recipe,id) => {
    let time = recipe.created_at.toDate()
    let html=`
    <li data-id="${id}">
    <div>${recipe.title}</div>
    <div>${recipe.author}</div>
    <div>${time}</div>
    <button>Delete</button>
    </li>
    `;

    list.innerHTML+=html
}

//Reading data from firebase
// db.collection('recipes').get()
// .then((snapshot) => {
//    snapshot.docs.forEach((item) => 
//    addRecipe(item.data()))
// })
// .catch(err => {console.log(err)});

db.collection('recipes').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(item => {
        const added = item.doc;
        console.log(item)
        if(item.type === "added")
        addRecipe(added.data(), added.id)
        else if(item.type === "removed")
        deleteRecipe(added.id)
})
})


//delete
const deleteRecipe = (id) => {
    const recipes=document.querySelectorAll('li');
    recipes.forEach(item => {
         if(item.getAttribute('data-id') === id)
           item.remove();
    })
}

//add documents
form.addEventListener('submit', event => {
    event.preventDefault();

    const now = new Date(); //to know when the recipe is being added

    const recipe_input ={
        title : form.recipe.value, //gets the value from input box
        author: form.fname.value,
        created_at : firebase.firestore.Timestamp.fromDate(now) //creates timestamp object based on date
    };

    db.collection('recipes').add(recipe_input)
    .then(()=>{console.log('recipe added')})
    .catch((err)=>{console.log(err)})

    form.reset();
})


//deleting data
list.addEventListener('click', e => {
    if(e.target.tagName === "BUTTON")
      {const id = e.target.parentElement.getAttribute('data-id');
     db.collection('recipes').doc(id).delete()
     .then(()=>{console.log('recipe deleted')});
}
})