# Soto's To Do App

Min to do app er sammensat af et array af forskellige lister, som hver har deres egne opgaver (”tasks”) tilknyttet. Disse bliver manipuleret igennem controllers i min app, hvori man både kan slette lister og oprette nye lister, og slette, tilføje eller redigere opgaverne i hver liste.

## HTML-struktur

I HTML-strukturen har jeg lavet en sidebar (”aside”) til at holde de forskellige lister, som kan klikkes på. Når en liste er selected (class=”active”) vil arrayet af tasks i den blive rendered i vinduet. Disse bliver sat ind i en ul med class=”tasks”.

Jeg har opbygget hver eneste li i min ul.tasks med et fieldset, der indeholder et input med type=”checkbox” til at kunne markere om opgaven er udført, og et label, som udskriver navnet/beskrivelsen på opgaven. Yderligere er der et menu-element inde i li’en, som indeholder to forskellige knapper, displayed som ikoner: en edit-knap (illustreret med et blyantikon) og en delete-knap (illustreret med et skraldespandsikon).

Da mit li-element i HTML er så komplekst, har jeg valgt at gemme hele strukturen som en template, som jeg kan klone og udskrive igen hver gang jeg mapper igennem mit array af tasks for en given task list. På denne måde kan jeg både inputte opgavens navn, id, mv. i alle HTML-elementernes relevante felter. Jeg udskriver arrayet af lister på samme måde i sidebaren, dog er liste-elementet en del mere simpelt, så har blot benyttet innerHTML til at udskrive den nødvendige HTML-struktur til dette formål.

```html
<template>
  <li class="task">
    <fieldset>
      <input type="checkbox" id="" name="" />
      <label for=""></label>
    </fieldset>
    <menu class="actions">
      <li class="actionEdit">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
          <path
            d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"
          />
        </svg>
      </li>
      <li class="actionDelete">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
          <!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
          <path
            d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0L284.2 0c12.1 0 23.2 6.8 28.6 17.7L320 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 7.2-14.3zM32 128l384 0 0 320c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-320zm96 64c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16z"
          />
        </svg>
      </li>
    </menu>
  </li>
</template>
```

## JS og MVC

Min js er opbygget med MVC-strukturen, der deles op i en model—min datastruktur, altså min liste af tasks—et view, dvs. hvad der udskrives på skærmen, og en controller, som er funktioner, der vil ændre i min model, og sende ændringerne tilbage for at blive vist på skærmen. Da jeg havde med en kompleks datastruktur at gøre, er min js også endt med at blive lang, med mange funktioner, der skal kunne gøre funktionaliteten mere brugervenlig.

I begyndelsen af mit script har jeg defineret nogle konstanter til at referere til elementer i HTML-strukturen, der skal bruges globalt. Dette inkluderer også mit localStorage-item, som jeg benytter senere til at gemme brugerens ændringer.

Dernæst definerer jeg min datastruktur. Jeg har opsat nogle lister med default tasks til at starte med, for at vise brugeren et eksempel på, hvordan appen kan benyttes. Lige så snart brugeren foretager ændringer, gemmes dette i localStorage.

```jsx
let taskLists;
if (storedTaskLists === null) {
  taskLists = [
    {
      title: "Home",
      active: true,
      tasks: [
        {
          title: "Do the dishes",
          done: false,
          id: self.crypto.randomUUID(),
        },
        {
          title: "Walk the dog",
          done: false,
          id: self.crypto.randomUUID(),
        },
        {
          title: "Buy groceries",
          done: false,
          id: self.crypto.randomUUID(),
        },
      ],
    },
    {
      title: "Work",
      active: false,
      tasks: [
        {
          title: "Send email",
          done: false,
          id: self.crypto.randomUUID(),
        },
        {
          title: "Write report",
          done: false,
          id: self.crypto.randomUUID(),
        },
      ],
    },
    {
      title: "School",
      active: false,
      tasks: [
        {
          title: "Organise notes",
          done: false,
          id: self.crypto.randomUUID(),
        },
        {
          title: "Hand in assignment",
          done: false,
          id: self.crypto.randomUUID(),
        },
      ],
    },
  ];
} else {
  taskLists = JSON.parse(storedTaskLists);
}
```

## Task Events

Den hovedsagelige del af scriptet, der foretager de markante ændringer, er min event listener på ul.tasks. Jeg har ved hjælp af event delegation givet hele ul-elementet en event listener, der vil udføre forskellige opgaver afhængig af targetet, der er landet på.

Først vil eventet foretage de nødvendige ændringer i dokumentet (hvis der er behov for dette, som f.eks. hvis der skal tilføjes et input-felt til at kunne redigere i opgavens navn), dernæst vil eventet sende en ændring tilbage til min model, der ændrer en property inde i det relevante objekt. Til sidst bliver localStorage opdateret, og jeg kører derefter min displayTasks og displayTaskLists funktioner igen, som løber min datastruktur igennem og udskriver al relevant information på siden, med de ændringer, der er blevet foretaget.

```jsx
viewTasks.addEventListener("click", (e) => {
  const activeList = taskLists.findIndex((list) => list.active === true);
  const targetTask = e.target.closest("li.task");
  const targetTaskOriginal = targetTask.innerHTML;

  // MARK TASK AS DONE
  if (e.target.matches("label")) {
    const currentTaskList = taskLists[activeList].tasks;
    const currentTask = currentTaskList.findIndex(
      (task) => task.title === e.target.textContent
    );
    if (currentTaskList[currentTask].done === false) {
      currentTaskList[currentTask].done = true;
    } else {
      currentTaskList[currentTask].done = false;
    }
    updateLocalStorage();
    displayTasks();
  }

  // DELETE TASK
  if (e.target.classList.contains("actionDelete")) {
    removeTask(activeList, targetTask.dataset.id);
  }

  // EDIT TASK
  if (e.target.classList.contains("actionEdit")) {
    const oldLabel = targetTask.querySelector("label").textContent;
    targetTask.innerHTML = `<label for=""></label><input id="editTask" type="text" placeholder="Edit task..." />`;
    const editingTask = targetTask.querySelector("input");
    editingTask.value = oldLabel;
    editingTask.focus();
    editingTask.addEventListener("focusout", (e) => {
      targetTask.innerHTML = targetTaskOriginal;
    });
    editingTask.addEventListener("keydown", (e) => {
      if (e.code === "Enter") {
        const activeList = taskLists.findIndex((list) => list.active === true);
        const activeTasks = taskLists[activeList].tasks;
        const currentTask = activeTasks.findIndex(
          (task) => task.title == oldLabel
        );
        const newTask = e.target.value;
        activeTasks[currentTask].title = newTask;
        activeTasks[currentTask].done = false;
        updateLocalStorage();
        displayTaskLists();
        clearInput(e.target);
      }
    });
  }
});
```

## Refleksion

Havde jeg haft yderligere tid, er jeg sikker på, at koden kunne nedskrives betydeligt ved at rykke linjer, jeg genbrugte mange steder, over i en funktion, der så kunne kaldes når det blev relevant. Jeg ville også mene, at benyttelse af JS-modules ville gøre en app som denne meget mere overskuelig og organiseret at kode, samt brug af et framework som Astro, som ville gøre brug af <template> overflødig.

Min største udfordring har bestemt ligget i at få så mange forskellige funktioner til at snakke sammen, så der ikke var konflikt. Ofte når en funktionalitet var blevet lavet, var der andet, der gik i stykker. Dette ville have været nemmere at undgå, hvis koden havde været mere organiseret og renskrevet som udgangspunkt.

Jeg har i min løsning lavet en delete-knap, der kan slette hele lister, men denne fungerer ikke helt som forventet på den første liste i arrayet grundet den metode, jeg benytter til at finde ud af, hvilken liste, der skal være selected (class=”active”) efter en liste er slettet.

Når en liste bliver slettet, vælger scriptet et objekt i arrayet som har den aktive listes indeks minus 1, så det altid vil være listen før den slettede liste, som bliver aktiv. Dette virker dog ikke på den første liste, som ikke har et objekt før sig i arrayet. For at løse dette, kunne man evt. indskrive en or-betingelse, som sammenligner om indeksnummeret er højere end 0, således at hvis indekset bliver minus, vil den aktive liste bestemmes ud fra indeksnummeret plus 1 eller array.length.
