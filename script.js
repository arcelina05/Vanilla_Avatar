document.addEventListener("DOMContentLoaded", function() {
    const downloadBtn = document.getElementById("downloadBtn");

    if (downloadBtn) {
        downloadBtn.addEventListener("click", function() {
            const element = document.getElementById('cv-content');
            if (element) {
                html2pdf()
                  .from(element)
                  .set({
                    margin: 10,
                    filename: 'CV-Lina-Arce.pdf',
                    html2canvas: { scale: 2, useCORS: true },
                    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                  })
                  .save();
            } else {
                console.error('No se encontró el elemento #cv-content');
            }
        });
    }
});
