'use client';

interface FunFactsProps {
  facts: string[];
}

export default function FunFacts({ facts }: FunFactsProps) {
  return (
    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg shadow-lg p-6 border-2 border-yellow-200">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <span className="text-3xl">💡</span>
        <span>Bạn có biết?</span>
      </h2>
      
      <div className="space-y-4">
        {facts.map((fact, index) => (
          <div key={index} className="flex gap-3">
            <span className="text-yellow-600 font-bold text-lg flex-shrink-0">
              {index + 1}.
            </span>
            <p className="text-gray-800 leading-relaxed">{fact}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

