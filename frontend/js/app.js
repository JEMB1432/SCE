function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.classList.toggle("close");
}

function toggleSubMenu(button) {
  const subMenu = button.nextElementSibling;
  button.classList.toggle("rotate");

  if (!button.classList.contains("rotate")) {
    subMenu.classList.remove("show");
    subMenu.style.animation = "closeAnimation 300ms ease-out";
  } else {
    subMenu.classList.add("show");
    subMenu.style.animation = "openAnimation 300ms ease-out";
  }
}

function openModal() {
  document.querySelector(".modal").classList.add("active");
}

function closeModal() {
  document.querySelector(".modal").classList.remove("active");
}

function editSubject() {
  openModal();
}

function deleteSubject() {
  if (confirm("¿Estás seguro de eliminar esta materia?")) {
    console.log("Materia eliminada");
  }
}

function saveSubject(event) {
  event.preventDefault();
  console.log("Materia guardada");
  closeModal();
}

// Close modal when clicking outside
document.querySelector(".modal").addEventListener("click", function (e) {
  if (e.target === this) {
    closeModal();
  }
});
