document.addEventListener("DOMContentLoaded", function() {
    const downloadBtn = document.getElementById("downloadBtn");
    
    if (downloadBtn) {
      downloadBtn.addEventListener("click", function() {
        // Notificar al usuario que se está generando el PDF
        console.log("Generando PDF...");
        
        const element = document.getElementById('cv-content');
        
        if (element) {
          // Configuración mejorada para html2pdf
          const opt = {
            margin: 10,
            filename: 'CV-Lina-Arce.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
              scale: 2, 
              useCORS: true,
              logging: true,
              letterRendering: true
            },
            jsPDF: { 
              unit: 'mm', 
              format: 'a4', 
              orientation: 'portrait',
              compress: true
            }
          };
          
          // Generar el PDF con las opciones configuradas
          html2pdf().from(element).set(opt).save()
            .then(() => {
              console.log("PDF generado con éxito");
            })
            .catch(err => {
              console.error("Error al generar el PDF:", err);
            });
        } else {
          console.error('No se encontró el elemento #cv-content');
          alert('Error al generar el PDF: No se encontró el contenido');
        }
      });
    } else {
      console.error('No se encontró el botón de descarga');
    }
  });
