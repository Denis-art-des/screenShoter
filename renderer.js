// В этом файле мы создаём логику для оправки ивента который мы описали в "preload.js"

let btn = document.getElementById('btn');

// это логика для отправки по клику
btn.addEventListener("click", () => {
    window.electronAPI.sendScreenshot() // можешь убедитьмя что он работает
})

// это тот самый ломающий всё цыкл.
// если хочешь запустить код в цикле то нужно прописать counter в определённых местех , "preload.js" и в файле "main.js"
// let counter = 1
// while (counter !== 10){
//     window.electronAPI.sendScreenshot(counter)
//        counter++
// }


// теперь main.js