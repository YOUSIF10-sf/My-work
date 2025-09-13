# Valet Insights

This is a Next.js application built with Firebase Studio.

## Overview

Valet Insights is a professional web application for managing and analyzing valet parking operations. It allows users to upload transaction data, calculate fees, and visualize key business metrics through an interactive dashboard.

### Key Features

- **Data Upload & Processing**: Upload Excel files with transaction data. The system automatically processes the data, calculates fees using an AI-powered flow, and determines operational shifts.
- **Interactive Dashboard**: A homepage with summary cards and charts to provide a quick overview of total revenue, shift performance, and more.
- **Operations Management**: A dedicated page to view, edit, and manage all processed transactions in an interactive table.
- **Invoicing**: A page to review finalized transactions and export them as PDF, Word, or print directly.
- **Settings**: A panel to configure pricing for parking and valet services, with the ability to apply new rates to selected transactions.
- **Data Export**: Functionality to download processed data as a detailed Excel file with AI-generated analysis for accounting purposes.

## Getting Started

To get started, run the development server and navigate to the home page.

```
npm run dev
```

### Environment Variables

Before running the application in a production environment or for development, you need to set up the required environment variables.

1.  Create a file named `.env` in the root of your project.
2.  Add the following variable to the file:

```
GEMINI_API_KEY="YOUR_API_KEY_HERE"
```

Replace `"YOUR_API_KEY_HERE"` with your actual Google AI (Gemini) API key. This is required for the AI-powered features like data analysis and fee calculation to work correctly.
