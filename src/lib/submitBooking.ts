/**
 * Booking form submission delegate.
 * Delegates directly to the unified submitDemoRequest helper.
 */
import { submitDemoRequest } from './submitDemoRequest';

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
  hp?: string;
}

export async function submitBooking(
  payload: BookingPayload
): Promise<{ success: boolean; error?: string }> {
  try {
    await submitDemoRequest({
      source: 'booking-page',
      name: payload.name,
      business: payload.business_name,
      email: payload.email,
      phone: payload.phone,
      trade: payload.business_type,
      website: payload.website_url,
      services: payload.services,
      monthlyCalls: payload.monthly_calls,
      whenUnanswered: payload.missed_call_handling,
      handles: payload.receptionist_tasks,
      hp: payload.hp,
    });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Something went wrong. Please try again.' };
  }
}
