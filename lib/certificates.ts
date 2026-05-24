export const certificates = [
  {
    slug: "Computer Networking",
    num: "01",
    course: "Master Computer Networking",
    description:
      "Successfully completed the Computer Networking course covering networking fundamentals, protocols, routing, switching, network architecture, and real-world computer communication concepts used in modern distributed systems and cloud infrastructure.",
    outcome: [
      "Network Architecture",
      "TCP/IP Protocols",
      "Routing & Switching",
      "Distributed Communication",
    ],
    image: "/assets/certificates/certificate1.png",
    live: "https://drive.google.com/file/d/1foTQf9Ts00OAToWeQk8ncBmM8Hh5aATS/view?usp=sharing",
  },
  {
    slug: "gcp-data-engineering",
    num: "02",
    course: "Google Cloud Data Engineering",
    description:
      "Completed a Google Cloud course focused on scalable data pipelines, cloud storage, and managed analytics services for enterprise data platforms.",
    outcome: [
      "Cloud Data Pipelines",
      "BigQuery & Storage",
      "DataOps Practices",
    ],
    image: "/assets/certificates/certificate2.jpg",
    live: "https://drive.google.com/file/d/16s3fdduhxwn_Q39RnVM3HlAOfg1Z1kzi/view?usp=sharing",
  },
  {
    slug: "python-data-science",
    num: "03",
    course: "Python for Data Science",
    description:
      "Completed a Python for Data Science course with practical training in data analysis, visualization, and scripting for analytics workflows.",
    outcome: [
      "Data Analysis with Python",
      "Pandas & NumPy",
      "Data Visualization",
      "Scripting for ETL",
    ],
    image: "/assets/certificates/certificate3.png",
    live: "https://drive.google.com/file/d/1fbBtLqpcI6AyilSyMsCVBfCEEHSRXDt8/view?usp=sharing",
  },
];

export type Certificate = (typeof certificates)[number];