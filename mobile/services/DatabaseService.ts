import 'react-native-url-polyfill/auto'

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://flbygwtoslnwzjpqkbpp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsYnlnd3Rvc2xud3pqcHFrYnBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTQ3MjIzMTQsImV4cCI6MjAxMDI5ODMxNH0.PGZe9-2QtFtdw0zdZaU94XtgVpzsUNlAoWSVvcKZZu0';
const supabase = createClient(supabaseUrl, supabaseKey);

const select = async () =>
{
    var promise = await supabase.from('player').select('*');
    console.log(promise); 
}

export default select;

