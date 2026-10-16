/**
 * Shared helper for demo request submissions.
 * TODO: connect backend / CRM (e.g. webhook, HubSpot, or EmailJS).
 */
export interface DemoRequestPayload {
  name?: string;
  email: string;
}

export async function submitDemoRequest({ name, email }: DemoRequestPayload): Promise<{ success: boolean; error?: string }> {
  // Simulate network latency for lead capture
  await new Promise((resolve) => setTimeout(resolve, 600));

  // In production, integrate fetch('/api/demo-request', { ... })
  // For now, simulate success:
  return { success: true };
}
