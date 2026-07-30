const { execSync } = require('child_process');

['public/transparent_logo.png', 'public/logo.png', 'scratch/emblem_raw.png', 'public/icon.png'].forEach(file => {
  try {
    const out = execSync(`cmd /c "npx sharp-cli -i ${file} metadata"`).toString();
    console.log(`--- Metadata for ${file} ---`);
    console.log(out);
  } catch (e) {
    console.error(`Error inspecting ${file}:`, e.message);
  }
});
