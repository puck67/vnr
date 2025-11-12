'use client';

import Link from 'next/link';
import { Shield, Swords, User } from 'lucide-react';
import { HistoricalEvent, Character } from '@/types';

interface EventContentProps {
  event: HistoricalEvent;
  relatedCharacters: Character[];
}

export default function EventContent({ event, relatedCharacters }: EventContentProps) {
  // Phân loại nhân vật: Pháp nếu role hoặc name chứa từ khóa liên quan đến Pháp/Tây Ban Nha
  const isFrenchCharacter = (character: Character) => {
    const lowerName = character.name.toLowerCase();
    const lowerRole = character.role.toLowerCase();
    
    // Kiểm tra tên (tên người Pháp/Tây Ban Nha)
    const frenchNames = ['rigault', 'genouilly', 'lanzarote', 'charner', 'léonard', 'bonard', 'louis-adolphe', 'louis', 'carlos', 'palanca', 'napoléon', 'napoleon', 'barbé', 'barbe', 'bourdais', 'grandière', 'de la grandiere', 'pierre', 'luro', 'dupré', 'dupre', 'piquet', 'léopold', 'philastre', 'paul', 'garnier'];
    const hasFrenchName = frenchNames.some(name => lowerName.includes(name));
    
    // Kiểm tra role (vai trò phía Pháp)
    const frenchRoles = ['pháp', 'tây ban nha', 'liên quân', 'thống đốc nam kỳ', 'quân đội pháp'];
    const hasFrenchRole = frenchRoles.some(role => lowerRole.includes(role));
    
    // Kiểm tra đô đốc + pháp/tây ban nha (tránh nhầm với Đề Đốc Việt Nam)
    const isAdmiral = lowerRole.includes('đô đốc') && (lowerRole.includes('pháp') || lowerRole.includes('tây ban nha'));
    
    return hasFrenchName || hasFrenchRole || isAdmiral;
  };
  
  const foreignCharacters = relatedCharacters.filter(c => isFrenchCharacter(c));
  const vietnamCharacters = relatedCharacters.filter(c => !isFrenchCharacter(c));

  const renderCharacterCard = (character: Character, isForeign: boolean = false) => (
    <Link
      key={character.id}
      href={`/characters/${character.id}`}
      className={`group relative flex items-start gap-4 p-4 rounded-lg border-2 transition-all hover:scale-[1.02] hover:shadow-md ${
        isForeign 
          ? 'bg-red-50 border-red-200 hover:bg-red-100' 
          : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
      }`}
    >
      {/* Avatar */}
      <div className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 ${
        isForeign ? 'bg-red-200' : 'bg-blue-200'
      }`}>
        <User className={`w-8 h-8 ${isForeign ? 'text-red-700' : 'text-blue-700'}`} />
      </div>
      
      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition">
          {character.name}
        </h4>
        <p className="text-sm text-gray-700 font-medium mt-1">
          {character.role}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {character.birthYear} - {character.deathYear || 'nay'}
        </p>
      </div>

      {/* Arrow */}
      <div className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all">
        →
      </div>
    </Link>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Thông tin chi tiết</h2>

      {/* Related Characters */}
      {relatedCharacters.length > 0 && (
        <div className="mb-8">
          <h3 className="font-bold text-xl mb-6 flex items-center gap-2 text-gray-800">
            <User className="w-6 h-6 text-blue-600" />
            <span>Nhân vật liên quan</span>
            <span className="text-sm font-normal text-gray-500">({relatedCharacters.length} người)</span>
          </h3>

          {/* Phía Việt Nam */}
          {vietnamCharacters.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-blue-600" />
                <h4 className="font-bold text-lg text-blue-900">Phía Việt Nam</h4>
                <span className="text-sm text-gray-500">({vietnamCharacters.length} người)</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vietnamCharacters.map(char => renderCharacterCard(char, false))}
              </div>
            </div>
          )}

          {/* Phía Pháp - Tây Ban Nha */}
          {foreignCharacters.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Swords className="w-5 h-5 text-red-600" />
                <h4 className="font-bold text-lg text-red-900">Phía Liên quân Pháp - Tây Ban Nha</h4>
                <span className="text-sm text-gray-500">({foreignCharacters.length} người)</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {foreignCharacters.map(char => renderCharacterCard(char, true))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sources */}
      {event.sources.length > 0 && (
        <div>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <span>📚</span>
            <span>Nguồn tham khảo</span>
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {event.sources.map((source, index) => (
              <li key={index}>{source}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

