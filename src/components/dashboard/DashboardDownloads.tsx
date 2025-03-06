
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const DashboardDownloads = () => {
  const downloads = [
    { id: '1', title: 'Black Mirror', size: '1.2 GB', expiresIn: '15 dias', image: 'https://via.placeholder.com/300x170' },
    { id: '2', title: 'The Crown', size: '950 MB', expiresIn: '30 dias', image: 'https://via.placeholder.com/300x170' }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">Seus Downloads</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {downloads.map((item) => (
          <Card key={item.id} className="bg-gray-900/50 border-gray-800 overflow-hidden hover:border-gray-700 transition-colors">
            <img src={item.image} alt={item.title} className="w-full h-40 object-cover" />
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <div className="flex justify-between text-sm text-gray-400">
                <span>{item.size}</span>
                <span>Expira em {item.expiresIn}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardDownloads;
