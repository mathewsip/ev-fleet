
document.addEventListener("DOMContentLoaded", () => {
    const rows = document.querySelectorAll("tbody tr");
    rows.forEach(row => {
        row.addEventListener("click", () => {
            const link = row.querySelector("a");
            if (link) {
                window.location.href = link.href;
            }
        });
    });
});
