// Esperamos a que todo el documento esté cargado
document.addEventListener("DOMContentLoaded", function() {
    // Obtenemos el botón de descarga
    const downloadBtn = document.getElementById("downloadBtn");
    
    if (downloadBtn) {
      // Añadimos el evento click al botón
      downloadBtn.addEventListener("click", function() {
        console.log("Generando PDF...");
        
        // Obtenemos el contenido del CV
        const content = document.getElementById('cv-content');
        
        if (!content) {
          console.error("No se encontró el elemento con id 'cv-content'");
          return;
        }
        
        // Primero usamos html2canvas para convertir el contenido en una imagen
        html2canvas(content, {
          allowTaint: true,
          useCORS: true,
          scale: 2,
          logging: true
        }).then(function(canvas) {
          // Convertimos el canvas a una imagen en formato base64
          const imgData = canvas.toDataURL('image/png');
          
          // Creamos un nuevo documento PDF
          const pdf = new jspdf.jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
          });
          
          // Calculamos las dimensiones para ajustar la imagen al PDF
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          
          // Añadimos la imagen al PDF
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          
          // Guardamos el PDF
          pdf.save('CV-Lina-Arce.pdf');
          
          console.log("PDF generado con éxito");
        }).catch(function(error) {
          console.error("Error al generar el PDF:", error);
          alert("Hubo un problema al generar el PDF. Por favor, intenta con otra imagen o en otro navegador.");
        });
      });
    } else {
      console.error("No se encontró el botón con id 'downloadBtn'");
    }
  });