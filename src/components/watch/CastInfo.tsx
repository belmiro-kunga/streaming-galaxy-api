
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronsUp } from 'lucide-react';

interface CastMember {
  name: string;
  role: string;
  photo: string;
}

interface CrewMember {
  name: string;
  role: string;
}

interface CastInfoProps {
  castMembers: CastMember[];
  crewMembers: CrewMember[];
  showCastInfo: boolean;
  onToggleCastInfo: () => void;
}

const CastInfo: React.FC<CastInfoProps> = ({
  castMembers,
  crewMembers,
  showCastInfo,
  onToggleCastInfo,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Elenco Principal</h3>
      
      <div className="space-y-4">
        {castMembers.map((actor, index) => (
          <div key={index} className="flex items-center gap-3">
            <img 
              src={actor.photo} 
              alt={actor.name} 
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-medium">{actor.name}</p>
              <p className="text-sm text-gray-400">{actor.role}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6">
        <Button 
          variant="outline" 
          className="w-full text-sm bg-transparent border-white/20 hover:bg-white/10"
          onClick={onToggleCastInfo}
        >
          {showCastInfo ? "Ver menos" : "Ver elenco completo"}
          <ChevronsUp className={`ml-2 w-4 h-4 transition-transform ${showCastInfo ? 'rotate-180' : ''}`} />
        </Button>
      </div>

      <div className="mt-6 pt-6 border-t border-white/10">
        <h4 className="text-sm font-semibold text-gray-400 mb-2">Equipe</h4>
        <ul className="text-sm text-gray-300">
          {crewMembers.map((member, index) => (
            <li key={index} className="mb-1">
              <span className="text-gray-400">{member.role}:</span> {member.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CastInfo;
