/**
 * Tuntematon osoite (esim. vanha tai väärin kirjoitettu linkki) ohjataan etusivulle.
 */
import { Redirect } from 'expo-router';

export default function NotFound() {
  return <Redirect href="/" />;
}
