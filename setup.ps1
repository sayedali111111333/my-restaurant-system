# setup.ps1
# سكربت لإعداد المشروع مع Supabase وربطه بـ Vercel ونشره Production

# 1️⃣ تثبيت مكتبة Supabase
Write-Host "Installing @supabase/supabase-js..."
npm install @supabase/supabase-js

# 2️⃣ إنشاء src/supabaseClient.ts
Write-Host "Creating src/supabaseClient.ts..."
$supabaseClient = @"
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
"@
$supabaseClient | Out-File -Encoding utf8 src/supabaseClient.ts

# 3️⃣ إنشاء src/api.ts
Write-Host "Creating src/api.ts..."
$apiFile = @"
// جلب كل الطلبات
import { supabase } from './supabaseClient';

export async function getOrders() {
  const { data, error } = await supabase.from('Order').select('*');
  if (error) console.log('Error:', error); else console.log('Orders:', data);
  return data;
}

// جلب قائمة المنيو
export async function getMenu() {
  const { data, error } = await supabase.from('MenuItem').select('*');
  if (error) console.log('Error:', error); else console.log('Menu:', data);
  return data;
}

// جلب كل العملاء
export async function getCustomers() {
  const { data, error } = await supabase.from('Customer').select('*');
  if (error) console.log('Error:', error); else console.log('Customers:', data);
  return data;
}
"@
$apiFile | Out-File -Encoding utf8 src/api.ts

# 4️⃣ إنشاء vercel.json لحل مشكلة Refresh 404
Write-Host "Creating vercel.json..."
$vercelJson = @"
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
"@
$vercelJson | Out-File -Encoding utf8 vercel.json

# 5️⃣ Commit + Push على GitHub
Write-Host "Git add, commit and push..."
git add .
git commit -m "Setup Supabase client, API, fix React Router 404"
git push origin main

# 6️⃣ نشر Production على Vercel
Write-Host "Deploying to Production on Vercel..."
vercel --prod

Write-Host "✅ Setup completed!"
