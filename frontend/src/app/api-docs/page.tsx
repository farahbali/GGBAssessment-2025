'use client';

import dynamic from 'next/dynamic';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });
import 'swagger-ui-react/swagger-ui.css';

export default function ApiDocs() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const specUrl = `${API_BASE_URL}/api-docs.json`;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Feedback Board API Documentation</h1>
        <div className="bg-white rounded-lg shadow-lg p-4">
          <SwaggerUI url={specUrl} docExpansion="list" defaultModelExpandDepth={1} defaultModelsExpandDepth={1} />
        </div>
      </div>
    </div>
  );
}
