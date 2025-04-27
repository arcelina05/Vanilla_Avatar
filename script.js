document.addEventListener("DOMContentLoaded", function() {
    const sendBtn = document.getElementById("sendBtn");
    const message = document.getElementById("message");
    const downloadBtn = document.getElementById("downloadBtn");

    if (sendBtn) {
        sendBtn.addEventListener("click", function() {
            const email = "lina.arce01@unicatolica.edu.co";
            const subject = "Nuevo mensaje desde tu portafolio";
            const body = message.value;
            window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        });
    }

    if (downloadBtn) {
        downloadBtn.addEventListener("click", function() {
            const element = document.getElementById('cv-content');
            if (element) {
                setTimeout(() => {  
                    html2pdf().from(element).set({
                        margin: 10,
                        filename: 'CV-Lina-Arce.pdf',
                        html2canvas: { scale: 2, useCORS: true },
                        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                    }).save();
                }, 300); // espera 300 milisegundos antes de generar el PDF
            } else {
                console.error('No se encontró el elemento #cv-content');
            }
        });
    }
});