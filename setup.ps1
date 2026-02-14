# إنشاء src/supabaseClient.ts
$clientTs = @'
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
'@

$clientTs | Out-File -FilePath ".\src\supabaseClient.ts" -Encoding utf8

# إنشاء src/api.ts
$apiTs = @'
import { supabase } from "./supabaseClient";

export async function getOrders() {
  const { data, error } = await supabase.from("Order").select("*");
  if (error) console.log("Error:", error);
  return data;
}

export async function getMenu() {
  const { data, error } = await supabase.from("MenuItem").select("*");
  if (error) console.log("Error:", error);
  return data;
}

export async function getCustomers() {
  const { data, error } = await supabase.from("Customer").select("*");
  if (error) console.log("Error:", error);
  return data;
}
'@

$apiTs | Out-File -FilePath ".\src\api.ts" -Encoding utf8
