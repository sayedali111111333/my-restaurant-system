// ط¬ظ„ط¨ ظƒظ„ ط§ظ„ط·ظ„ط¨ط§طھ
import { supabase } from './supabaseClient';

export async function getOrders() {
  const { data, error } = await supabase.from('Order').select('*');
  if (error) console.log('Error:', error); else console.log('Orders:', data);
  return data;
}

// ط¬ظ„ط¨ ظ‚ط§ط¦ظ…ط© ط§ظ„ظ…ظ†ظٹظˆ
export async function getMenu() {
  const { data, error } = await supabase.from('MenuItem').select('*');
  if (error) console.log('Error:', error); else console.log('Menu:', data);
  return data;
}

// ط¬ظ„ط¨ ظƒظ„ ط§ظ„ط¹ظ…ظ„ط§ط،
export async function getCustomers() {
  const { data, error } = await supabase.from('Customer').select('*');
  if (error) console.log('Error:', error); else console.log('Customers:', data);
  return data;
}
