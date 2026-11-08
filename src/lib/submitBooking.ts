/**
 * Booking form submission.
 * TODO (Supabase): replace the simulated request below with an insert, for example
 *   const { error } = await supabase.from('demo_requests').insert(payload);
 * The keys below are snake_case so they can map straight onto table columns.
 */
export interface BookingPayload {
  name: string;
  business_name: string;
  email: string;
  phone: string;
  business_type: string;
  website_url: string;
  services: string;
  monthly_calls: string;
  missed_call_handling: string;
  receptionist_tasks: string[];
}

export async function submitBooking(
  payload: BookingPayload
): Promise<{ success: boolean; error?: string }> {
  // Simulated network latency until the backend is connected
  await new Promise((resolve) => setTimeout(resolve, 700));
  void payload;
  return { success: true };
}
