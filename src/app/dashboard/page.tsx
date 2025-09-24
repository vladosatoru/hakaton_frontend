'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface TrafficData {
  time: string;
  vehicles: number;
  speed: number;
}

interface Statistics {
  totalVehicles: number;
  averageSpeed: number;
  incidents: number;
  roadsCovered: number;
}

const Dashboard = () => {
  const [statistics, setStatistics] = useState<Statistics>({
    totalVehicles: 0,
    averageSpeed: 0,
    incidents: 0,
    roadsCovered: 0
  });

  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Симуляция загрузки данных
  useEffect(() => {
    const loadData = async () => {
      // Симуляция API запроса
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStatistics({
        totalVehicles: 15420,
        averageSpeed: 52,
        incidents: 3,
        roadsCovered: 1247
      });

      // Генерация данных трафика за последние 24 часа
      const data: TrafficData[] = [];
      for (let i = 23; i >= 0; i--) {
        const hour = new Date();
        hour.setHours(hour.getHours() - i);
        data.push({
          time: hour.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
          vehicles: Math.floor(Math.random() * 1000) + 500,
          speed: Math.floor(Math.random() * 30) + 40
        });
      }
      setTrafficData(data);
      setIsLoading(false);
    };

    loadData();
  }, []);

  const incidents = [
    {
      id: 1,
      type: 'ДТП',
      location: 'М1, км 15',
      time: '14:30',
      status: 'Активно',
      severity: 'high'
    },
    {
      id: 2,
      type: 'Затор',
      location: 'ул. Ленина',
      time: '13:45',
      status: 'Устранено',
      severity: 'medium'
    },
    {
      id: 3,
      type: 'Ремонт',
      location: 'А101, км 45',
      time: '12:00',
      status: 'Плановый',
      severity: 'low'
    }
  ];

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-text-muted">Загрузка данных...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-secondary py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Дашборд ЦОДД
            </h1>
            <p className="text-text-muted">
              Мониторинг дорожного движения в реальном времени
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-text-muted text-sm">Транспорт сегодня</p>
                  <p className="text-2xl font-bold text-foreground">{statistics.totalVehicles.toLocaleString()}</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-text-muted text-sm">Средняя скорость</p>
                  <p className="text-2xl font-bold text-foreground">{statistics.averageSpeed} км/ч</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-text-muted text-sm">Активные инциденты</p>
                  <p className="text-2xl font-bold text-foreground">{statistics.incidents}</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-primary/20 text-primary mr-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-text-muted text-sm">Дороги под контролем</p>
                  <p className="text-2xl font-bold text-foreground">{statistics.roadsCovered} км</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Traffic Chart */}
            <Card>
              <h3 className="text-xl font-bold text-foreground mb-6">Трафик за 24 часа</h3>
              <div className="h-64 flex items-end justify-between space-x-1">
                {trafficData.map((data, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div 
                      className="bg-primary rounded-t w-full transition-all duration-300 hover:bg-primary/80"
                      style={{ height: `${(data.vehicles / 1500) * 100}%` }}
                      title={`${data.time}: ${data.vehicles} автомобилей`}
                    ></div>
                    {index % 4 === 0 && (
                      <span className="text-xs text-text-muted mt-1">{data.time}</span>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Incidents */}
            <Card>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-foreground">Инциденты</h3>
                <Button size="sm">Все инциденты</Button>
              </div>
              <div className="space-y-4">
                {incidents.map((incident) => (
                  <div key={incident.id} className="flex items-center justify-between p-3 bg-secondary rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        incident.severity === 'high' ? 'bg-red-500' :
                        incident.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}></div>
                      <div>
                        <p className="font-medium text-foreground">{incident.type}</p>
                        <p className="text-sm text-text-muted">{incident.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-text-muted">{incident.time}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        incident.status === 'Активно' ? 'bg-red-100 text-red-800' :
                        incident.status === 'Устранено' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {incident.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mt-8">
            <h3 className="text-xl font-bold text-foreground mb-6">Быстрые действия</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="p-4 h-auto flex flex-col items-center space-y-2">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
                <span>Настроить светофоры</span>
              </Button>
              
              <Button variant="outline" className="p-4 h-auto flex flex-col items-center space-y-2">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Просмотр отчетов</span>
              </Button>
              
              <Button variant="outline" className="p-4 h-auto flex flex-col items-center space-y-2">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span>Создать инцидент</span>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;