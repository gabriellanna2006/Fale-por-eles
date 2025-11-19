import type { Timestamp } from 'firebase/firestore';

export type IncidentReport = {
  id: string;
  description: string;
  location: string;
  mediaUrls: string[];
  reportDate: Timestamp; // Using Timestamp for Firebase Timestamp flexibility
  reporterName: string;
  reporterContact: string;
};
