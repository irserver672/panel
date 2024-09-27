const express = require("express");
const path = require("path");
const { exec } = require("child_process");
const app = express();
const port = 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Serve the HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// API endpoint to run a shell command (via POST request)
app.post("/start-server", (req, res) => {
  const command = `gcloud cloud-shell ssh --command "./runv" --authorize-session`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      res.status(500).json({ success: false, message: error.message });
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      res.status(500).json({ success: false, message: stderr });
      return;
    }
    console.log(`Stdout: ${stdout}`);
    res.json({ success: true, output: stdout });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

