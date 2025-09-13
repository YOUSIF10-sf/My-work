import React from 'react';

export function ValetLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      role="img"
      aria-label="Valet Insights Logo"
      className="h-8 w-8 text-primary"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12 2L2 7L12 12L22 7L12 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 17L12 22L22 17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 12L12 17L22 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Data URI for embedding in jsPDF
export const ValetLogoPath =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJVSURBVHgB7d3LalRRFMfxRylkCEag2oADiKguXQSNuBG3YQLcBI1Ld7LBa3AFVjS4CS4g8I+oMzAiCApD13f/w4FvnpSZyf/c3Mmcg4gAAAAAAAAAAAAAAAAAAAAAAAAAANwD7948vL+9vQwjCanb+27X6/U4HA6azWYwGPz3N+fn59++f282m4d2gIdhGEKIUqn0drt9vV5/+/btm61ZWVn517ZtGIZra2vbtm13d3f9fj+lUul2u3///v3x8fEbYJomSZKmaZqmzWbzt23bbDabz+eLxaKurq5++PAhSRLbtm02m5fL5Uwm02q1ut1u8/l8n8+Xy+WbzWZJkiRJanZ29vr6+uHh4b29vampqZ6env79/X25XH758uXz5883NzdnZ2fHxsZev3596N/v9y+Xy+l0+t/v92q1+u/v93g8/vP5fDwePz4+/v79e3d3t9lsXl9ff/369f7+/sXFxYWFhZWVlY2NjYWFhYWFhYWFhZWVlY2NjYWFhYWFhZWVlY2NjYWFhYWFhZWVlY2NjYWFhYWZmdm/w/D8/Pzl5aVSqby8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLw8b/W8vLwAAAAAAAAAAAAAAAAAAAAAAAAAAIC/7gE9B7jsClf/AAAAAElFTkSuQmCC';
