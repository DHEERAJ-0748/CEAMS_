import dotenv from 'dotenv';

// Load env vars
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['SUPABASE_URL', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (!process.env.SUPABASE_KEY && !process.env.SUPABASE_ANON_KEY) {
  missingEnvVars.push('SUPABASE_KEY (or SUPABASE_ANON_KEY)');
}

if (missingEnvVars.length > 0) {
  console.error('\x1b[31m%s\x1b[0m', '==================================================');
  console.error('\x1b[31m%s\x1b[0m', '  CRITICAL ERROR: Missing Environment Variables');
  console.error('\x1b[31m%s\x1b[0m', '==================================================');
  missingEnvVars.forEach(varName => {
    console.error('\x1b[31m%s\x1b[0m', `  - ${varName}`);
  });
  console.error('\x1b[31m%s\x1b[0m', '==================================================');
  console.error('\x1b[33m%s\x1b[0m', '  Please configure these in your .env file or host environment (e.g. Render).');
  console.error('\x1b[33m%s\x1b[0m', '  Refer to backend/.env.example for guidance.');
  console.error('\x1b[31m%s\x1b[0m', '==================================================');
  process.exit(1);
}
