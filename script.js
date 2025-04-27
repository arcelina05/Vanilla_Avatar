// Esta solución convierte primero todas las imágenes a base64 antes de generar el PDF
document.addEventListener("DOMContentLoaded", function() {
    const downloadBtn = document.getElementById("downloadBtn");
    
    if (downloadBtn) {
      downloadBtn.addEventListener("click", function() {
        // Capturamos todas las imágenes del contenido
        const contentDiv = document.getElementById('cv-content');
        const images = contentDiv.querySelectorAll('img');
        
        // Promesa para convertir todas las imágenes a base64
        const imagePromises = Array.from(images).map(img => {
          return new Promise((resolve, reject) => {
            // Solo procesamos imágenes que ya están cargadas
            if (img.complete) {
              toDataURL(img.src)
                .then(dataUrl => {
                  img.src = dataUrl;
                  resolve();
                })
                .catch(err => {
                  console.warn("No se pudo convertir la imagen a base64:", err);
                  resolve(); // Seguimos con el proceso aunque falle una imagen
                });
            } else {
              img.onload = () => {
                toDataURL(img.src)
                  .then(dataUrl => {
                    img.src = dataUrl;
                    resolve();
                  })
                  .catch(err => {
                    console.warn("No se pudo convertir la imagen a base64:", err);
                    resolve();
                  });
              };
              img.onerror = () => resolve(); // Continuamos si hay error
            }
          });
        });
        
        // Función para convertir imagen a base64
        function toDataURL(url) {
          return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function() {
              const reader = new FileReader();
              reader.onloadend = function() {
                resolve(reader.result);
              };
              reader.readAsDataURL(xhr.response);
            };
            xhr.onerror = function() {
              reject(new Error('Error al cargar la imagen'));
            };
            xhr.open('GET', url);
            xhr.responseType = 'blob';
            xhr.send();
          });
        }
        
        // Una vez que todas las imágenes sean base64, generamos el PDF
        Promise.all(imagePromises)
          .then(() => {
            const element = document.getElementById('cv-content');
            const opt = {
              margin: 10,
              filename: 'CV-Lina-Arce.pdf',
              image: { type: 'jpeg', quality: 0.98 },
              html2canvas: { 
                scale: 2,
                useCORS: true,
                allowTaint: true
              },
              jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };
            
            html2pdf().from(element).set(opt).save()
              .then(() => console.log("PDF generado con éxito"))
              .catch(err => console.error("Error al generar PDF:", err));
          })
          .catch(err => {
            console.error("Error en la conversión de imágenes:", err);
          });
      });
    }
  });