export type IncidentReport = {
  id: string;
  description: string;
  location: string;
  mediaUrls: string[];
  reportDate: any; // Using `any` for Firebase Timestamp flexibility
  reporterName: string;
  reporterContact: string;
  aiAnalysis: {
    abuseEstimate: string;
    resources: string;
  };
};
