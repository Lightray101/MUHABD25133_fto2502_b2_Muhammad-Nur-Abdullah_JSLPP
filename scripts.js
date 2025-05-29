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

  /**
   * Handles the form submission
   * @param {Event} e - The submit event
   */
  handleSubmit: function (e) {
    e.preventDefault(); // Prevent default form submission to handle validation manually

    const title = this.newTaskTitleInput.value.trim();

    if (title === "") {
      // Show the custom validation message only on submission if title is empty
      this.titleValidationMessage.style.display = "block";
      // Do NOT proceed with task creation
      return;
    } else {
      // Hide the custom validation message if title is not empty
      this.titleValidationMessage.style.display = "none";
    }

    // If we reach here, validation passed, proceed with task creation
    const newTask = {
      id: userTasks.reduce((maxId, task) => Math.max(maxId, task.id), 0) + 1,
      title: title,
      description: document.getElementById("new-task-description").value,
      status: document.getElementById("new-task-status").value,
      priority: document.getElementById("new-task-priority")?.value || "Medium",
    };

    TaskManager.addTask(newTask);
    this.closeModal();
  },
};

/**
 * Theme Management Module
 * Handles all operations related to theme switching
 */
const ThemeManager = {
  themeSwitch: document.getElementById("theme-switch"),
  mobileThemeSwitch: document.getElementById("mobile-theme-switch"),
  logo: document.getElementById("logo"),
  favicon: document.querySelector('link[rel="icon"]'),
  logoMobile: document.querySelector(".logo-mobile"),

  init: function () {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      document.documentElement.setAttribute("data-theme", savedTheme);
      this.themeSwitch.checked = savedTheme === "dark";
      if (this.mobileThemeSwitch)
        this.mobileThemeSwitch.checked = savedTheme === "dark";
      AssetManager.setAssetsForTheme(savedTheme);
    } else {
      AssetManager.setAssetsForTheme("light");
    }

    // Add event listeners for both toggles
    if (this.themeSwitch) {
      this.themeSwitch.addEventListener("change", () =>
        this.toggleTheme(this.themeSwitch.checked)
      );
    }
    if (this.mobileThemeSwitch) {
      this.mobileThemeSwitch.addEventListener("change", () =>
        this.toggleTheme(this.mobileThemeSwitch.checked)
      );
    }
  },

  toggleTheme: function (isDark) {
    const newTheme = isDark ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    AssetManager.setAssetsForTheme(newTheme);
    // Sync both toggles
    if (this.themeSwitch) this.themeSwitch.checked = isDark;
    if (this.mobileThemeSwitch) this.mobileThemeSwitch.checked = isDark;
  },

  setAssetsForTheme(theme) {
    if (this.logo) {
      this.logo.src =
        theme === "dark" ? "./assets/logo-dark.svg" : "./assets/logo-light.svg";
      this.logo.alt = theme === "dark" ? "logo-dark" : "logo-light";
    }
    if (this.favicon) {
      this.favicon.href =
        theme === "dark" ? "./assets/favicon (1).svg" : "./assets/favicon.svg";
    }
    if (this.logoMobile) {
      this.logoMobile.src = "./assets/favicon (1).svg";
      this.logoMobile.alt = "logo-mobile";
    }
  },
};

/**
 * Sidebar Management Module
 * Handles all operations related to sidebar visibility
 */
const SidebarManager = {
  sidebar: document.getElementById("side-bar-div"),
  layout: document.getElementById("layout"),
  hideButton: document.querySelector(".hide-sidebar-btn"),
  showButton: document.getElementById("show-sidebar-btn"),

  init: function () {
    // Check for saved sidebar state
    const isHidden = localStorage.getItem("sidebarHidden") === "true";
    if (isHidden) {
      this.hideSidebar();
    }

    // Add event listeners
    this.hideButton.addEventListener("click", () => this.hideSidebar());
    this.showButton.addEventListener("click", () => this.showSidebar());
  },

  hideSidebar: function () {
    this.sidebar.classList.add("hidden");
    this.layout.classList.add("expanded");
    this.showButton.style.display = "flex";
    localStorage.setItem("sidebarHidden", "true");
  },

  showSidebar: function () {
    this.sidebar.classList.remove("hidden");
    this.layout.classList.remove("expanded");
    this.showButton.style.display = "none";
    localStorage.setItem("sidebarHidden", "false");
  },
};

/**
 * API Module
 * Handles fetching tasks from the remote API
 */
const ApiManager = {
  endpoint: "https://jsl-kanban-api.vercel.app/",
  async fetchTasks() {
    try {
      showLoading();
      const response = await fetch(this.endpoint);
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data = await response.json();
      hideLoading();
      return data;
    } catch (error) {
      showError("Error fetching tasks. Please try again later.");
      hideLoading();
      return null;
    }
  },
};

/**
 * UI Loading/Error State
 */
function showLoading() {
  let loadingDiv = document.getElementById("loading-message");
  if (!loadingDiv) {
    loadingDiv = document.createElement("div");
    loadingDiv.id = "loading-message";
    loadingDiv.textContent = "Loading tasks...";
    loadingDiv.style.cssText =
      "position:fixed;top:0;left:0;width:100vw;height:100vh;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.8);z-index:2000;font-size:1.5rem;";
    document.body.appendChild(loadingDiv);
  } else {
    loadingDiv.style.display = "flex";
  }
}
function hideLoading() {
  const loadingDiv = document.getElementById("loading-message");
  if (loadingDiv) loadingDiv.style.display = "none";
}
function showError(msg) {
  let errorDiv = document.getElementById("error-message");
  if (!errorDiv) {
    errorDiv = document.createElement("div");
    errorDiv.id = "error-message";
    errorDiv.style.cssText =
      "position:fixed;top:0;left:0;width:100vw;height:100vh;display:flex;align-items:center;justify-content:center;background:rgba(255,0,0,0.1);z-index:2100;font-size:1.2rem;color:#d32f2f;";
    document.body.appendChild(errorDiv);
  }
  errorDiv.textContent = msg;
  setTimeout(() => {
    if (errorDiv) errorDiv.style.display = "none";
  }, 4000);
}

// Main app initialization
async function initializeTasks() {
  let tasks = StorageManager.getTasks();
  if (!tasks || tasks.length === 0) {
    // Try fetching from API
    const apiTasks = await ApiManager.fetchTasks();
    if (apiTasks && Array.isArray(apiTasks)) {
      tasks = apiTasks.map((t, i) => ({
        id: t.id || i + 1,
        title: t.title || "",
        description: t.description || "",
        status: t.status || "todo",
        priority: t.priority || "Medium",
      }));
      StorageManager.saveTasks(tasks);
    }
  }
  userTasks = tasks;
  refreshTaskDisplay();
}

// Initialize tasks from local storage or use default tasks
let userTasks =
  StorageManager.getTasks().length > 0
    ? StorageManager.getTasks()
    : [
        {
          id: 1,
          title: "Launch Epic Career 🚀",
          description: "Create a killer Resume",
          status: "todo",
          priority: "High",
        },
        {
          id: 2,
          title: "Conquer React⚛️",
          description: "Learn the basics of React.",
          status: "todo",
          priority: "High",
        },
        {
          id: 3,
          title: "Understand Databases⚙️",
          description: "Study database concepts.",
          status: "todo",
          priority: "Medium",
        },
        {
          id: 4,
          title: "Crush Frameworks🖼️",
          description: "Explore various frameworks.",
          status: "todo",
          priority: "Low",
        },
        {
          id: 5,
          title: "Master JavaScript 💛",
          description: "Get comfortable with the fundamentals.",
          status: "doing",
          priority: "High",
        },
        {
          id: 6,
          title: "Never Give Up 🏆",
          description: "Keep pushing forward!",
          status: "doing",
          priority: "Medium",
        },
        {
          id: 7,
          title: "Explore ES6 Features 🚀",
          description: "Deep dive into ES6.",
          status: "done",
          priority: "Medium",
        },
        {
          id: 8,
          title: "Have fun 🥳",
          description: "Enjoy the process!",
          status: "done",
          priority: "Low",
        },
      ];

// Save initial tasks to local storage if none exist
if (StorageManager.getTasks().length === 0) {
  StorageManager.saveTasks(userTasks);
}

// Function to filter completed tasks
function getCompletedTasks(arr) {
  return arr.filter((task) => task.status === "done");
}

// Log all user-created tasks as an array
console.log("All tasks:", userTasks);

// Log only completed tasks as an array
console.log("Completed tasks:", getCompletedTasks(userTasks));

// DOM Elements
const taskColumns = {
  todo: document.querySelector('[data-status="todo"] .tasks-container'),
  doing: document.querySelector('[data-status="doing"] .tasks-container'),
  done: document.querySelector('[data-status="done"] .tasks-container'),
};
/**
 * Creates a task element with the given task data
 * @param {Object} task - The task object containing id, title, description, and status
 * @returns {HTMLElement} The created task element
 */
function createTaskElement(task) {
  const taskElement = document.createElement("div");
  taskElement.className = "task-div";
  taskElement.dataset.taskId = task.id;

  // Task title
  const titleSpan = document.createElement("span");
  titleSpan.textContent = task.title;
  taskElement.appendChild(titleSpan);

  // Priority orb (now on the right)
  const orb = document.createElement("span");
  const prioRaw = (task.priority || "Medium").trim().toLowerCase();
  const prio = ["high", "medium", "low"].includes(prioRaw) ? prioRaw : "medium";
  orb.className = `priority-orb priority-${prio}-orb`;
  taskElement.appendChild(orb);

  // Add click event to open modal
  taskElement.addEventListener("click", () => openTaskModal(task));

  return taskElement;
}
/**
 * Opens the task modal with the given task data
 * @param {Object} task - The task object to display in the modal
 */
function openTaskModal(task) {
  // Create modal elements
  const modal = document.createElement("div");
  modal.className = "modal";

  const modalContent = document.createElement("div");
  modalContent.className = "modal-content";

  // Create a header div for the title and close button
  const modalHeader = document.createElement("div");
  modalHeader.className = "modal-header";

  // Create the modal title
  const modalTitle = document.createElement("h2");
  modalTitle.textContent = "Edit Task";

  // Add a close button (X icon)
  const closeButton = document.createElement("button");
  closeButton.className = "close-modal-button";
  closeButton.innerHTML = "&times;";

  // Append title and close button to the header
  modalHeader.appendChild(modalTitle);
  modalHeader.appendChild(closeButton);

  // Append the header to modal content
  modalContent.appendChild(modalHeader);
  // Create form elements
  const form = document.createElement("form");
  form.innerHTML = `
    <div class="form-group">
      <label for="task-title">Title</label>
      <input type="text" id="task-title" value="${task.title}" required>
    </div>
    <div class="form-group">
      <label for="task-description">Description</label>
      <textarea id="task-description" required>${task.description}</textarea>
    </div>
    <div class="form-group">
      <label for="task-status">Status</label>
      <select id="task-status">
        <option value="todo" ${
          task.status === "todo" ? "selected" : ""
        }>todo</option>
        <option value="doing" ${
          task.status === "doing" ? "selected" : ""
        }>doing</option>
        <option value="done" ${
          task.status === "done" ? "selected" : ""
        }>done</option>
      </select>
    </div>
    <div class="form-group">
      <label for="task-priority">Priority</label>
      <select id="task-priority">
        <option value="High" ${
          task.priority === "High" ? "selected" : ""
        }>High</option>
        <option value="Medium" ${
          task.priority === "Medium" ? "selected" : ""
        }>Medium</option>
        <option value="Low" ${
          task.priority === "Low" ? "selected" : ""
        }>Low</option>
      </select>
    </div>
    <div class="modal-buttons">
      <button type="submit" class="save-btn">Save Changes</button>
      <button type="button" class="delete-btn">Delete Task</button>
    </div>
  `;

  // Add form to modal content
  modalContent.appendChild(form);

  // Save changes on submit
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const updatedData = {
      title: document.getElementById("task-title").value,
      description: document.getElementById("task-description").value,
      status: document.getElementById("task-status").value,
      priority: document.getElementById("task-priority").value,
    };
    TaskManager.updateTask(task.id, updatedData);
    modal.remove();
  });

  // Delete button logic
  form.querySelector(".delete-btn").addEventListener("click", function () {
    if (confirm("Are you sure you want to delete this task?")) {
      TaskManager.deleteTask(task.id);
      modal.remove();
    }
  });

  // Add event listener to modal backdrop
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.remove();
  });

  // Add event listener to the close button
  closeButton.addEventListener("click", () => modal.remove());

  // Add modal to DOM
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
}

/**
 * Refreshes the task display by clearing and repopulating all columns
 */
function refreshTaskDisplay() {
  // Clear all columns
  Object.values(taskColumns).forEach((column) => (column.innerHTML = ""));

  // Sort and add tasks to appropriate columns
  const priorityOrder = { High: 0, Medium: 1, Low: 2 };
  ["todo", "doing", "done"].forEach((status) => {
    const tasks = userTasks
      .filter((task) => task.status === status)
      .sort(
        (a, b) =>
          priorityOrder[a.priority || "Medium"] -
          priorityOrder[b.priority || "Medium"]
      );
    tasks.forEach((task) => {
      const taskElement = createTaskElement(task);
      taskColumns[status].appendChild(taskElement);
    });
  });

  // Update column counts
  updateColumnCounts();
}

/**
 * Updates the count of tasks in each column header
 */
function updateColumnCounts() {
  const counts = {
    todo: userTasks.filter((task) => task.status === "todo").length,
    doing: userTasks.filter((task) => task.status === "doing").length,
    done: userTasks.filter((task) => task.status === "done").length,
  };

  document.getElementById("toDoText").textContent = `TODO (${counts.todo})`;
  document.getElementById("doingText").textContent = `DOING (${counts.doing})`;
  document.getElementById("doneText").textContent = `DONE (${counts.done})`;
}

// Mobile sidebar modal logic
function setupMobileSidebar() {
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const logoMobileDark = document.getElementById("logo-mobile-dark");
  const mobileSidebarModal = document.getElementById("mobile-sidebar-modal");
  const mobileSidebarClose = document.querySelector(".mobile-sidebar-close");

  function openSidebar() {
    if (window.innerWidth <= 768) {
      mobileSidebarModal.style.display = "flex";
      // Theme toggles are now always in sync
    }
  }

  if (mobileMenuBtn && mobileSidebarModal) {
    mobileMenuBtn.addEventListener("click", openSidebar);
  }
  if (logoMobileDark && mobileSidebarModal) {
    logoMobileDark.addEventListener("click", openSidebar);
  }
  if (mobileSidebarClose && mobileSidebarModal) {
    mobileSidebarClose.addEventListener("click", function () {
      mobileSidebarModal.style.display = "none";
    });
  }
}

// Initialize the theme and sidebar functionality
document.addEventListener("DOMContentLoaded", async () => {
  ModalManager.init();
  ThemeManager.init();
  SidebarManager.init();
  setupMobileSidebar();
  await initializeTasks();
});

const AssetManager = {
  logo: document.getElementById("logo"),
  favicon: document.querySelector('link[rel="icon"]'),
  logoMobile: document.querySelector(".logo-mobile"),

  setAssetsForTheme(theme) {
    if (this.logo) {
      this.logo.src =
        theme === "dark" ? "./assets/logo-dark.svg" : "./assets/logo-light.svg";
      this.logo.alt = theme === "dark" ? "logo-dark" : "logo-light";
    }
    if (this.favicon) {
      this.favicon.href =
        theme === "dark" ? "./assets/favicon (1).svg" : "./assets/favicon.svg";
    }
    if (this.logoMobile) {
      this.logoMobile.src = "./assets/favicon (1).svg";
      this.logoMobile.alt = "logo-mobile";
    }
  },
};

function updateMobileLogoForTheme() {
  const logoImg = document.querySelector(".logo-mobile");
  const logoSvg = document.getElementById("logo-mobile-dark");
  if (!logoImg || !logoSvg) return;
  if (
    window.innerWidth <= 768 &&
    document.documentElement.getAttribute("data-theme") === "dark"
  ) {
    logoImg.style.display = "none";
    logoSvg.style.display = "block";
  } else {
    logoImg.style.display = "block";
    logoSvg.style.display = "none";
  }
}

// Update on theme change and resize
window.addEventListener("resize", updateMobileLogoForTheme);
const observer = new MutationObserver(updateMobileLogoForTheme);
observer.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ["data-theme"],
});

document.addEventListener("DOMContentLoaded", async () => {
  ModalManager.init();
  ThemeManager.init();
  SidebarManager.init();
  setupMobileSidebar();
  updateMobileLogoForTheme();
  await initializeTasks();
});
