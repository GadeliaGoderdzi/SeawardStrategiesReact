const fs = require('fs');
const path = require('path');

// Test script to verify authentication system setup
console.log('🔍 Testing Authentication System Setup...\n');

// Check 1: Environment Variables
console.log('1. Checking Environment Variables:');
const requiredEnvVars = [
  'JWT_SECRET',
  'NODE_ENV',
  'FRONTEND_URL',
  'CORS_ORIGIN'
];

let envIssues = 0;
requiredEnvVars.forEach(varName => {
  if (process.env[varName]) {
    console.log(`   ✅ ${varName}: ${varName === 'JWT_SECRET' ? '[SET]' : process.env[varName]}`);
  } else {
    console.log(`   ❌ ${varName}: NOT SET`);
    envIssues++;
  }
});

// Check 2: Data Directory
console.log('\n2. Checking Data Directory:');
const dataDir = path.join(__dirname, 'data', 'users');
const usersFile = path.join(dataDir, 'users.json');

try {
  if (fs.existsSync(dataDir)) {
    console.log(`   ✅ Data directory exists: ${dataDir}`);
  } else {
    console.log(`   ❌ Data directory missing: ${dataDir}`);
    console.log('   💡 Creating data directory...');
    fs.mkdirSync(dataDir, { recursive: true });
    console.log('   ✅ Data directory created');
  }

  if (fs.existsSync(usersFile)) {
    const stats = fs.statSync(usersFile);
    console.log(`   ✅ Users file exists: ${usersFile} (${stats.size} bytes)`);
  } else {
    console.log(`   ❌ Users file missing: ${usersFile}`);
    console.log('   💡 Creating users file...');
    fs.writeFileSync(usersFile, JSON.stringify([], null, 2));
    console.log('   ✅ Users file created');
  }
} catch (error) {
  console.log(`   ❌ Error with data directory: ${error.message}`);
}

// Check 3: Dependencies
console.log('\n3. Checking Required Dependencies:');
const requiredDeps = [
  'bcrypt',
  'jsonwebtoken',
  'crypto',
  'nodemailer'
];

let depIssues = 0;
requiredDeps.forEach(dep => {
  try {
    require(dep);
    console.log(`   ✅ ${dep}: Available`);
  } catch (error) {
    console.log(`   ❌ ${dep}: Missing - run 'npm install ${dep}'`);
    depIssues++;
  }
});

// Check 4: Services
console.log('\n4. Checking Service Files:');
const serviceFiles = [
  'src/services/fileStorage.js',
  'src/services/emailService.js',
  'src/controllers/authController.js'
];

serviceFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file}: Exists`);
  } else {
    console.log(`   ❌ ${file}: Missing`);
  }
});

// Summary
console.log('\n📊 SUMMARY:');
if (envIssues === 0 && depIssues === 0) {
  console.log('   ✅ Authentication system is properly configured!');
  console.log('   🚀 You can now test user registration.');
} else {
  console.log('   ❌ Authentication system has configuration issues:');
  if (envIssues > 0) {
    console.log(`      - ${envIssues} environment variable(s) missing`);
  }
  if (depIssues > 0) {
    console.log(`      - ${depIssues} dependency(ies) missing`);
  }
  console.log('\n   📖 See ENV_SETUP_GUIDE.md for detailed setup instructions.');
}

console.log('\n🔧 Next Steps:');
console.log('   1. Create server/.env file with required variables');
console.log('   2. Run: npm install (if dependencies are missing)');
console.log('   3. Start server: npm run dev');
console.log('   4. Test registration at: http://localhost:3000/signup'); 