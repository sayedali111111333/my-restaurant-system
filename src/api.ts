import { supabase } from './supabaseClient';

// ΰε΅ αι  ¤§ο§
export async function addOrder(customer, items, totalAmount) {
  const { data, error } = await supabase.from('Orders').insert([{ customer, items, totalAmount, status: 'pending' }]);
  if (error) console.log('Error:', error); else console.log('Order added:', data);
}

// ¤ι  θι ιαι Ά
export async function getOrders() {
  const { data, error } = await supabase.from('Orders').select('*');
  if (error) console.log('Error:', error); else console.log('Orders:', data);
  return data;
}

// ¤ι  ηκ΅ ικλον
export async function getMenu() {
  const { data, error } = await supabase.from('MenuItem').select('*');
  if (error) console.log('Error:', error); else console.log('Menu:', data);
  return data;
}

// ¤ι  θι ιγκι
export async function getCustomers() {
  const { data, error } = await supabase.from('Customer').select('*');
  if (error) console.log('Error:', error); else console.log('Customers:', data);
  return data;
}
export async function getOrders() {
  const { data, error } = await supabase.from('Orders').select('*');
  if (error) console.log('Error:', error); else console.log('Orders:', data);
  return data;
}

// ¤ι  ηκ΅ ικλον
export async function getMenu() {
  const { data, error } = await supabase.from('MenuItem').select('*');
  if (error) console.log('Error:', error); else console.log('Menu:', data);
  return data;
}

// ¤ι  θι ιγκι
export async function getCustomers() {
  const { data, error } = await supabase.from('Customer').select('*');
  if (error) console.log('Error:', error); else console.log('Customers:', data);
  return data;
}
