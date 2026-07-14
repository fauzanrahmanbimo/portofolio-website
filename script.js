// Buka & tutup modal pratinjau sertifikat
function openCertModal(src) {
  const modal = document.getElementById("certModal");
  document.getElementById("certModalImg").src = src;
  modal.classList.add("open");
}
function closeCertModal() {
  document.getElementById("certModal").classList.remove("open");
}

// Tutup modal dengan tombol ESC
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") closeCertModal();
});

// Smooth scroll untuk link navbar
document.querySelectorAll('a[href^="#"]').forEach(function (link) {
  link.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});
