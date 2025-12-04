import { Link } from 'react-router-dom';

const AgentCard = ({ agent, property, onContactClick }) => {
  // Support all owner types: agent, seller, owner
  if (!agent) {
    return null;
  }

  const isAgent = agent.role === 'agent';
  const ownerLabel = isAgent ? 'Agent' : 'Owner';

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Listed by {ownerLabel}</h3>
      
      <div className="flex items-start gap-4">
        {/* Agent/Owner Avatar */}
        {isAgent ? (
          <Link to={`/agents/${agent._id}`}>
            {agent.avatar ? (
              <img
                src={agent.avatar}
                alt={agent.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                {agent.name?.charAt(0)}
              </div>
            )}
          </Link>
        ) : (
          agent.avatar ? (
            <img
              src={agent.avatar}
              alt={agent.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
              {agent.name?.charAt(0)}
            </div>
          )
        )}

        {/* Agent/Owner Info */}
        <div className="flex-1">
          {isAgent ? (
            <Link 
              to={`/agents/${agent._id}`}
              className="text-xl font-bold text-gray-800 hover:text-blue-600"
            >
              {agent.name}
            </Link>
          ) : (
            <h3 className="text-xl font-bold text-gray-800">
              {agent.name}
            </h3>
          )}
          
          {agent.agencyName && (
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-medium">Agency:</span> {agent.agencyName}
            </p>
          )}

          {agent.experience && (
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-medium">Experience:</span> {agent.experience} years
            </p>
          )}

          {agent.specialization && agent.specialization.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {agent.specialization.map((spec, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                >
                  {spec}
                </span>
              ))}
            </div>
          )}

          {agent.bio && (
            <p className="text-sm text-gray-600 mt-3 line-clamp-2">
              {agent.bio}
            </p>
          )}

          {/* Contact Info */}
          <div className="mt-4 space-y-2">
            {agent.phone && (
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href={`tel:${agent.phone}`} className="hover:text-blue-600">
                  {agent.phone}
                </a>
              </div>
            )}

            {agent.email && (
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href={`mailto:${agent.email}`} className="hover:text-blue-600">
                  {agent.email}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-3">
        <button
          onClick={onContactClick}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Contact {ownerLabel}
        </button>
        {isAgent && (
          <Link
            to={`/agents/${agent._id}`}
            className="flex-1 border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium text-center"
          >
            View Profile
          </Link>
        )}
      </div>
    </div>
  );
};

export default AgentCard;
