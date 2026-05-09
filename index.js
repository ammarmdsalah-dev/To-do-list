// testin the link by printing an alert
// alert ("")
//  the crud system ( creating-reading-updating-deleting)
// its like i ask him to do all this when all of the html code are implemnted
document.addEventListener("DOMContentLoaded", () => {
    // getting the elemnt i need bu their id 
    const taskinput = document.getElementById("task-input")
    const addTaskbtn = document.getElementById("add-task-btn")
    const tasklist = document.getElementById("task-list")
    const emptyState = document.getElementById("empty-state");
    let editingTask = null;
    const progressbar = document.getElementById('progress')
    const progressNumbers = document.getElementById('numbers')
    const progressTitle = document.getElementById('progress-title');
    const saveTasks = () => {
        const tasks = [];
        tasklist.querySelectorAll('li').forEach(li => {
            tasks.push({
                text: li.querySelector('span').textContent,
                completed: li.querySelector('.checkbox').checked
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const loadTasks = () => {
        const saved = localStorage.getItem('tasks');
        if (saved) {
            JSON.parse(saved).forEach(task => addtask(task.text, task.completed));
        }
    };



    const checkEmpty = () => {
        if (tasklist.children.length === 0) {
            emptyState.style.display = "flex";
        } else {
            emptyState.style.display = "none";
        }
    };

    const updateprogress = (checkcompletion = true) => {
        const totaltasks = tasklist.children.length
        const completedtasks = tasklist.querySelectorAll('.checkbox:checked').length


        const progressPercent = totaltasks === 0 ? 0 : (completedtasks / totaltasks) * 100;
        progressbar.style.width = `${progressPercent}%`;
        progressNumbers.innerText = `${completedtasks} / ${totaltasks}`;
        saveTasks();
        if (progressPercent === 100 && totaltasks > 0) {
            progressTitle.innerText = "ELHAMDULILAH";

        } else {
            progressTitle.innerText = "Keep it up";

        }


    }

    // making functon the create li for the ul dynamicly 
    const addtask = (text, completed = false) => {


        // trim to get the value without any extra spaces 
        const taskText = text || taskinput.value.trim();
        // if condition to make sure the inout is not null
        if (!taskText) {
            return
        }
        if (editingTask) {
            editingTask.textContent = taskText;
            editingTask = null;
            taskinput.value = '';
            updateprogress();
            return;
        }
        // for creating elemnt 
        const li = document.createElement('li')
        //the content of the li = the value of the input the  user gonna enter
        //li.textContent = taskText

        li.innerHTML = `
    <input type="checkbox" class="checkbox"
     ${completed ? 'checked' : ''}/>
    <span>${taskText}</span>
    <div class="task-buttons">
         <button class="edit-btn"><i class="fa-solid fa-pen"></i> </button>
         <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
     </div>    
`;
        const checkbox = li.querySelector('.checkbox')
        const editbtn = li.querySelector('.edit-btn');
        const span = li.querySelector('span');

        if (completed) {
            li.classList.add('completed')
            editbtn.disabled = true
            editbtn.style.opacity = '0.5'
            editbtn.style.pointerEvents = 'none'
        }

        checkbox.addEventListener('change', () => {
            const isChecked = checkbox.checked
            li.classList.toggle('completed', isChecked)
            editbtn.disabled = isChecked
            editbtn.style.opacity = isChecked ? '0.5' : '1'
            editbtn.style.pointerEvents = isChecked ? 'none' : 'auto'
            updateprogress();

        })


        editbtn.addEventListener('click', () => {
            if (checkbox.checked) return
            taskinput.value = span.textContent;
            taskinput.focus();
            editingTask = span;

        })

        li.querySelector('.delete-btn').addEventListener('click', () => {
            li.remove();
            checkEmpty();
            updateprogress();
        })



        tasklist.appendChild(li)
        taskinput.value = ''
        checkEmpty();
        updateprogress();




    }
    addTaskbtn.addEventListener('click', () => addtask())
    taskinput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addtask()


        }



    })

    loadTasks();
})