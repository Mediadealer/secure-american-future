/**
 * ClickMagick tracking utilities
 *
 * Goal types in ClickMagick stats: Clicks -> Actions -> Engagements -> Sales
 *   - Action (cmc_goal: 'a')      = User clicks "Initialize Dashboard"  (rename to "Initialize" in CM settings)
 *   - Engagement (cmc_goal: 'e')  = User submits email (registration)  (rename to "Registrations" in CM settings)
 *   - Sales are tracked via EverFlow postback
 */

/**
 * Fire a ClickMagick goal by injecting the script with the appropriate cmc_goal.
 * This is how ClickMagick tracks in-page events -- you re-fire the script
 * with a new config that includes cmc_goal.
 */
export function fireClickMagickGoal(
  goal: 'a' | 'e',
  ref?: string
): void {
  if (typeof window === 'undefined') return;

  // Set the goal config
  // TODO: Set ClickMagick uid and hid
  (window as any).clickmagick_cmc = {
    uid: 'YOUR_UID_HERE',
    hid: 'YOUR_HID_HERE',
    cmc_project: 'secure payouts dashboard',
    cmc_goal: goal,
    ...(ref ? { cmc_ref: ref } : {}),
    vid_info: 'on',
  };

  // Re-fire the ClickMagick script to register the goal
  const script = document.createElement('script');
  script.src = '//cdn.clkmc.com/cmc.js';
  script.async = true;
  script.onload = () => {
    if (script.parentNode) {
      script.parentNode.removeChild(script);
    }
  };
  document.body.appendChild(script);
}

/**
 * Track "Action" (Initialize) -- user clicks "Initialize Dashboard"
 */
export function trackInitialize(): void {
  fireClickMagickGoal('a', 'initialize');
}

/**
 * Track "Engagement" (Registration) -- user submits email
 */
export function trackRegistration(): void {
  fireClickMagickGoal('e', 'registration');
}

/**
 * Get the ClickMagick click ID from cookie or URL
 */
export function getClickMagickId(): string | null {
  if (typeof window === 'undefined') return null;

  // Try cookie first (cmc_vid is set by cmc.js)
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'cmc_vid') {
      return value;
    }
  }

  // Fallback to localStorage
  try {
    const lsValue = localStorage.getItem('_cmc_cmc_vid');
    if (lsValue) return lsValue;
  } catch {}

  return null;
}
