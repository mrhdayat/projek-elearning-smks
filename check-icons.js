#!/usr/bin/env node

// Script untuk mengecek semua icon imports di proyek
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Daftar icon yang CONFIRMED WORKING dari react-icons/lu
const validIcons = [
  'LuUsers', 'LuTrendingUp', 'LuDownload', 'LuFilter', 'LuActivity',
  'LuSearch', 'LuBell', 'LuX', 'LuCheck', 'LuClock', 'LuFileText',
  'LuMessageCircle', 'LuAward', 'LuCalendar', 'LuBookOpen',
  'LuClipboardCheck', 'LuAlertCircle', 'LuGraduationCap',
  'LuAlertTriangle', 'LuTrendingDown', 'LuHeart', 'LuUpload', 'LuEye',
  'LuArrowLeft', 'LuArrowRight', 'LuPin', 'LuReply', 'LuThumbsUp',
  'LuUser', 'LuConstruction', 'LuRefreshCw', 'LuPlus',
  // Additional commonly used icons
  'LuChevronDown', 'LuLogOut', 'LuCheckCircle', 'LuMapPin', 'LuSave'
];

// Daftar icon yang TIDAK tersedia (confirmed)
const invalidIcons = [
  'LuBarChart3', 'LuBarChart', 'LuChart', 'LuBarChart2', 'LuPieChart'
];

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  
  // Cek import statements
  const importRegex = /import\s*{([^}]+)}\s*from\s*['"]react-icons\/lu['"]/g;
  let match;
  
  while ((match = importRegex.exec(content)) !== null) {
    const imports = match[1].split(',').map(s => s.trim());
    
    imports.forEach(iconName => {
      if (invalidIcons.includes(iconName)) {
        issues.push({
          type: 'ERROR',
          message: `❌ ${iconName} is NOT available in react-icons/lu`,
          suggestion: 'Use LuActivity or LuTrendingUp instead'
        });
      } else if (!validIcons.includes(iconName)) {
        issues.push({
          type: 'WARNING',
          message: `⚠️ ${iconName} might not be available`,
          suggestion: 'Check react-icons/lu documentation'
        });
      }
    });
  }
  
  // Cek usage dalam JSX
  invalidIcons.forEach(iconName => {
    const usageRegex = new RegExp(`<${iconName}[^>]*>`, 'g');
    if (usageRegex.test(content)) {
      issues.push({
        type: 'ERROR',
        message: `❌ ${iconName} is used in JSX but not available`,
        suggestion: 'Replace with LuActivity or LuTrendingUp'
      });
    }
  });
  
  return issues;
}

function scanDirectory(dir) {
  const results = {};
  
  function scan(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    items.forEach(item => {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        scan(fullPath);
      } else if (stat.isFile() && (item.endsWith('.jsx') || item.endsWith('.js'))) {
        const issues = checkFile(fullPath);
        if (issues.length > 0) {
          results[fullPath] = issues;
        }
      }
    });
  }
  
  scan(dir);
  return results;
}

// Main execution
console.log('🔍 Checking icon imports in the project...\n');

const srcDir = path.join(__dirname, 'src');
const results = scanDirectory(srcDir);

if (Object.keys(results).length === 0) {
  console.log('✅ All icon imports are valid!');
} else {
  console.log('❌ Found issues with icon imports:\n');
  
  Object.entries(results).forEach(([filePath, issues]) => {
    console.log(`📁 ${filePath.replace(__dirname, '.')}`);
    issues.forEach(issue => {
      console.log(`   ${issue.type}: ${issue.message}`);
      console.log(`   💡 Suggestion: ${issue.suggestion}`);
    });
    console.log('');
  });
}

console.log('\n📋 Valid icons you can use:');
console.log(validIcons.join(', '));

console.log('\n🚫 Invalid icons to avoid:');
console.log(invalidIcons.join(', '));
