export interface Faq {
  question: string;
  answer: string;
}

export const faqs: Faq[] = [
  {
    question: "What is SR Stays?",
    answer:
      "SR Stays is a PG (Paying Guest) discovery platform that helps users find verified PG accommodations, while also giving PG owners tools to list and manage their properties, and residents a dedicated app for maintenance requests.",
  },
  {
    question: "Is SR Stays free for PG seekers?",
    answer:
      "Yes, searching and contacting PG owners on SR Stays is completely free with zero brokerage.",
  },
  {
    question: "Can PG owners list their property for free?",
    answer:
      "Yes, PG owners can list their property on SR Stays and manage bookings, tenants, and rent through the owner dashboard.",
  },
  {
    question: "What is the SR Stays Maintenance app?",
    answer:
      "It's a separate module within the SR Stays ecosystem built for handling PG maintenance — complaints, utility bills, housekeeping schedules, and service tracking.",
  },
  {
    question: "Which cities does SR Stays cover?",
    answer:
      "SR Stays currently covers Hyderabad, Bangalore, Pune, Chennai, Mumbai, and Delhi NCR, with more cities being added regularly.",
  },
  {
    question: "How do I raise a maintenance complaint?",
    answer:
      "Residents can log in to the SR Stays Maintenance app, select the issue category, upload photos, and track the status until resolution.",
  },
];
