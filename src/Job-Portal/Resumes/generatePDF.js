import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generatePDF = async (elementId, filename = "resume.pdf") => {
  const input = document.getElementById(elementId);

  // Clone the element so we don't change live DOM
  const clone = input.cloneNode(true);

  // Replace profile image with stored Base64
  const base64Image = localStorage.getItem("profileImageBase64");
  if (base64Image) {
    const imgTags = clone.querySelectorAll("img");
    imgTags.forEach((img) => {
      img.src = base64Image;
    });
  }

  // Create a temporary container off-screen
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.appendChild(clone);
  document.body.appendChild(container);

  const canvas = await html2canvas(clone, {
    useCORS: true,
    allowTaint: false,
    scale: 2,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save(filename);

  // Clean up
  document.body.removeChild(container);
};



