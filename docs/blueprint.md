# **App Name**: Valet Insights

## Core Features:

- Data Upload and Extraction: Allows users to upload Excel files, automatically identifies and extracts data from columns named 'Exit Time', 'Exit Gate', 'Duration', 'Plate No', and 'Pay Type'.
- Interactive Data Table: Displays the extracted data in an interactive table for review and editing. Supports handling over 3000 operations per file.
- Record Filtering and Editing: Enables users to select, delete, and modify individual operation records within the data table.
- Shift Determination: Automatically determines the shift (Morning: 8 AM - 8 PM, Evening: 8 PM - 8 AM) based on the 'Exit Time' data.
- Fee Calculation: Calculates parking fees based on 'Duration' (<= 6 hours: 35 SAR per hour, > 6 hours: 210 SAR per day) and adds a fixed valet service fee of 50 SAR. Can function as a tool within the system, that an LLM could enable/disable or include the result within it's reasining.
- Data Export to Dashboard: Exports the processed and analyzed data to the main dashboard for summary and visualization.
- Comprehensive Excel Export: Provides a 'Download' button to export all operations into a detailed Excel file, including analysis to assist the accountant. This includes identification of top and bottom revenue-generating locations (gates) and peak entry/exit times.

## Style Guidelines:

- Primary color: Deep, futuristic purple (#7029D3) to reflect the AI-inspired theme. Purple symbolizes creativity, wisdom, and innovation.
- Background color: Very light purple (#F5F0FF) provides a soft, clean backdrop that keeps the focus on content.
- Accent color: Electric blue (#29D3A3) serves to highlight interactive elements and calls to action, complementing the primary purple.
- Headline font: 'Space Grotesk' (sans-serif) for a computerized, techy feel. Body font: 'Inter' (sans-serif) to ensure readability and a modern aesthetic.
- Use a set of modern, minimalist icons, with subtle animations on hover.
- The layout should feature a clean, grid-based design. Ensure all elements are aligned and spaced evenly. Implement a responsive design to optimize the site for various screen sizes.
- Incorporate subtle transitions and animations to enhance user experience without overwhelming. Loading animations and transitions should be smooth and efficient.