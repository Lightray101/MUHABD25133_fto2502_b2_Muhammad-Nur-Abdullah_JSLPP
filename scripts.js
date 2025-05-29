/**
 * Local Storage Module
 * Handles all operations related to storing and retrieving tasks from local storage
 */
const StorageManager = {
  /**
   * Saves tasks to local storage
   * @param {Array} tasks - Array of task objects to save
   */
  saveTasks: (tasks) => {
    localStorage.setItem("kanbanTasks", JSON.stringify(tasks));
  },

  /**
   * Retrieves tasks from local storage
   * @returns {Array} Array of task objects
   */
  getTasks: () => {
    const tasks = localStorage.getItem("kanbanTasks");
    return tasks ? JSON.parse(tasks) : [];
  },
};

/**
 * Task Management Module
 * Handles all operations related to task management
 */
const TaskManager = {
  /**
   * Adds a new task to the task list
   * @param {Object} task - The task object to add
   */
  addTask: (task) => {
    userTasks.push(task);
    StorageManager.saveTasks(userTasks);
    refreshTaskDisplay();
  },

  /**
   * Updates an existing task
   * @param {number} taskId - The ID of the task to update
   * @param {Object} newData - The new task data
   */
  updateTask: (taskId, newData) => {
    const taskIndex = userTasks.findIndex((task) => task.id === taskId);
    if (taskIndex !== -1) {
      userTasks[taskIndex] = { ...userTasks[taskIndex], ...newData };
      StorageManager.saveTasks(userTasks);
      refreshTaskDisplay();
    }
  },

  deleteTask: function (taskId) {
    const taskIndex = userTasks.findIndex((task) => task.id === taskId);
    if (taskIndex !== -1) {
      userTasks.splice(taskIndex, 1);
      StorageManager.saveTasks(userTasks);
      refreshTaskDisplay();
    }
  },
};

/**
 * Modal Management Module
 * Handles all operations related to the Add Task modal
 */
const ModalManager = {
  modal: document.getElementById("add-task-modal"),
  form: document.getElementById("add-task-form"),
  addTaskBtn: document.getElementById("add-task-btn"),
  closeBtn: document.querySelector("#add-task-modal .close-modal-button"),
  cancelBtn: document.querySelector("#add-task-modal .close-btn"),

  /**
   * Initializes the modal functionality
   */
  init: function () {
    this.addTaskBtn.addEventListener("click", () => this.openModal());
    this.closeBtn.addEventListener("click", () => this.closeModal());
    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) this.closeModal();
    });
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));

    // Get references to input and message for validation
    this.newTaskTitleInput = document.getElementById("new-task-title");
    this.titleValidationMessage = document.getElementById(
      "title-validation-message"
    );

    // Hide the validation message initially
    this.titleValidationMessage.style.display = "none";

    // Add an input event listener to hide the message when user starts typing
    this.newTaskTitleInput.addEventListener("input", () => {
      if (this.newTaskTitleInput.value.trim() !== "") {
        this.titleValidationMessage.style.display = "none";
      }
    });
  },

  /**
   * Opens the Add Task modal
   */
  openModal: function () {
    this.modal.style.display = "flex";
    document.getElementById("new-task-title").focus();
  },

  /**
   * Closes the Add Task modal
   */
  closeModal: function () {
    this.modal.style.display = "none";
    this.form.reset();
  },

