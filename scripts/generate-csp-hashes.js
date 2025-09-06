const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// Function to generate SHA-256 hash
function generateHash(content) {
  return crypto.createHash("sha256").update(content, "utf8").digest("base64");
}

// Function to extract inline scripts and styles from HTML
function extractInlineContent(htmlContent) {
  const scriptHashes = [];
  const styleHashes = [];

  // Extract inline scripts
  const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
  let scriptMatch;
  while ((scriptMatch = scriptRegex.exec(htmlContent)) !== null) {
    if (scriptMatch[1].trim()) {
      const hash = generateHash(scriptMatch[1]);
      scriptHashes.push(`'sha256-${hash}'`);
    }
  }

  // Extract inline styles
  const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let styleMatch;
  while ((styleMatch = styleRegex.exec(htmlContent)) !== null) {
    if (styleMatch[1].trim()) {
      const hash = generateHash(styleMatch[1]);
      styleHashes.push(`'sha256-${hash}'`);
    }
  }

  // Extract style attributes
  const styleAttrRegex = /style="([^"]*)"/gi;
  let styleAttrMatch;
  while ((styleAttrMatch = styleAttrRegex.exec(htmlContent)) !== null) {
    if (styleAttrMatch[1].trim()) {
      const hash = generateHash(styleAttrMatch[1]);
      styleHashes.push(`'sha256-${hash}'`);
    }
  }

  return { scriptHashes, styleHashes };
}

// Function to update vercel.json with hashes
function updateVercelConfig(scriptHashes, styleHashes) {
  const vercelPath = path.join(__dirname, "..", "vercel.json");
  const vercelConfig = JSON.parse(fs.readFileSync(vercelPath, "utf8"));

  // Create CSP with hashes
  const scriptSrc = `'self' ${scriptHashes.join(
    " "
  )} https://www.google-analytics.com https://www.googletagmanager.com https://www.gstatic.com https://www.google.com`;
  const styleSrc = `'self' ${styleHashes.join(
    " "
  )} https://fonts.googleapis.com`;

  const cspValue = `default-src 'self'; script-src ${scriptSrc}; style-src ${styleSrc}; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: https://*.googleapis.com; connect-src 'self' https://api.numindify.com/api/ http://nu-mindify-api.vercel.app/ https://www.numindify.com/ https://www.google-analytics.com https://vercel.live https://*.googleapis.com; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;`;

  // Update the CSP header
  vercelConfig.headers[0].headers[0].value = cspValue;

  // Write back to vercel.json
  fs.writeFileSync(vercelPath, JSON.stringify(vercelConfig, null, 2));

  console.log("Updated vercel.json with CSP hashes");
  console.log("Script hashes:", scriptHashes.length);
  console.log("Style hashes:", styleHashes.length);
}

// Main execution
function main() {
  try {
    const buildPath = path.join(__dirname, "..", "build");
    const indexPath = path.join(buildPath, "index.html");

    if (!fs.existsSync(indexPath)) {
      console.log(
        'Build directory not found. Please run "npm run build" first.'
      );
      return;
    }

    const htmlContent = fs.readFileSync(indexPath, "utf8");
    const { scriptHashes, styleHashes } = extractInlineContent(htmlContent);

    updateVercelConfig(scriptHashes, styleHashes);

    console.log("CSP hash generation completed successfully!");
  } catch (error) {
    console.error("Error generating CSP hashes:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { generateHash, extractInlineContent };
