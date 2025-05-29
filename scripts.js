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
