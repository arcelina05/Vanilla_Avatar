document.addEventListener("DOMContentLoaded", function() {
    const downloadBtn = document.getElementById("downloadBtn");
    
    if (downloadBtn) {
      downloadBtn.addEventListener("click", async function() {
        console.log("Preparando para generar PDF...");
        
        // Capturar el div que contiene el contenido del CV
        const content = document.getElementById('cv-content');
        
        if (!content) {
          console.error("No se encontró el elemento con id 'cv-content'");
          return;
        }
        
        try {
          // Primero intentamos convertir la imagen a base64
          await prepareImagesForPDF(content);
          
          // Después de procesar las imágenes, generamos el PDF
          generatePDF(content);
        } catch (error) {
          console.error("Error al preparar el PDF:", error);
          alert("Hubo un problema al generar el PDF. Intenta en otro navegador.");
        }
      });
    }
    
    // Función para convertir imágenes a base64
    async function prepareImagesForPDF(container) {
      const images = container.querySelectorAll('img');
      
      // Convertir todas las imágenes a base64
      for (let img of images) {
        if (!img.src.startsWith('data:')) {
          try {
            const base64Url = await convertImageToBase64(img);
            img.setAttribute('src', base64Url);
            console.log("Imagen convertida a base64");
          } catch (error) {
            console.warn("No se pudo convertir la imagen:", error);
          }
        }
      }
    }
    
    // Función para convertir una imagen a base64
    function convertImageToBase64(imgElement) {
      return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const newImg = new Image();
        
        // Importante: esto permite cargar la imagen sin problemas CORS
        newImg.crossOrigin = "Anonymous";
        
        newImg.onload = function() {
          canvas.width = this.width;
          canvas.height = this.height;
          ctx.drawImage(this, 0, 0);
          
          try {
            const dataURL = canvas.toDataURL('image/png');
            resolve(dataURL);
          } catch (e) {
            reject(e);
          }
        };
        
        newImg.onerror = function() {
          reject(new Error("No se pudo cargar la imagen"));
        };
        
        // Añadimos un timestamp para evitar problemas de caché
        newImg.src = imgElement.src + '?t=' + new Date().getTime();
      });
    }
    
    // Función para generar el PDF
    function generatePDF(content) {
      // Opciones para html2canvas
      const options = {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: true
      };
      
      // Generar el PDF
      html2canvas(content, options).then(function(canvas) {
        try {
          const imgData = canvas.toDataURL('image/png');
          
          // Crear el PDF
          const pdf = new jspdf.jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
          });
          
          // Calcular dimensiones
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          
          // Añadir la imagen al PDF
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          
          // Guardar el PDF
          pdf.save('CV-Lina-Arce.pdf');
          
          console.log("PDF generado con éxito");
        } catch (error) {
          console.error("Error al generar el PDF:", error);
          alert("Error al crear el PDF. Por favor, intenta en otro navegador.");
        }
      });
    }
  });