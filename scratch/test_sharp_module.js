const fs = require('fs');

try {
  const sharp = require('sharp');
  console.log('sharp module is directly available!');
} catch(e) {
  console.log('sharp module not directly in project node_modules:', e.message);
}
