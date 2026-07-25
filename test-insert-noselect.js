const { createClient } = require('@supabase/supabase-js');

async function run() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Authenticate (use the newly created test user or create one)
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: `test-${Date.now()}@example.com`,
    password: 'Password123!',
  });
  console.log('SignUp:', signUpError ? signUpError.message : 'Success', signUpData?.user?.id);

  // Attempt to insert restaurant WITHOUT .select()
  const { data: rest, error: restError } = await supabase
    .from('restaurants')
    .insert({
      name: 'Test Rest',
      slug: `test-rest-${Date.now()}`
    }); // No .select()
  
  console.log('Insert WITHOUT select Result:');
  console.log(restError);
}

run();
